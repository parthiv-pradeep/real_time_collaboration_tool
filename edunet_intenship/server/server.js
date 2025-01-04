require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const Document = require('./Document'); // Mongoose model for documents
const { Server } = require('socket.io');

// MongoDB connection using dotenv
const dbURI = process.env.MONGO_URI;
if (!dbURI) {
    console.error('Error: MONGO_URI is not set in the .env file');
    process.exit(1); // Exit the application if no database URI is provided
}

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Initialize Socket.IO server
const io = new Server(3001, {
    cors: {
        origin: "http://localhost:5173", // Ensure this matches your frontend's URL
        methods: ["GET", "POST"],
    },
});

// Event listeners for socket communication
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('get-document', async (documentId) => {
        if (!documentId) {
            socket.emit('error', 'Document ID is required');
            return;
        }

        try {
            const document = await findOrCreateDocument(documentId);

            // Join the client to the specific document room
            socket.join(documentId);

            // Send the initial document content to the client
            socket.emit('load-document', document.data);

            // Listen for changes from the client and broadcast to others
            socket.on('send-changes', (delta) => {
                socket.broadcast.to(documentId).emit('receive-changes', delta);
            });

            // Save the document content when the client triggers save
            socket.on('save-document', async (data) => {
                await Document.findByIdAndUpdate(documentId, { data });
                console.log(`Document ${documentId} saved.`);
            });
        } catch (err) {
            console.error('Error handling document:', err);
            socket.emit('error', 'An error occurred while handling the document');
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Helper function to find or create a document
async function findOrCreateDocument(id) {
    if (!id) throw new Error('Document ID cannot be null');

    const existingDocument = await Document.findById(id);
    if (existingDocument) return existingDocument;

    return await Document.create({ _id: id, data: "" });
}
