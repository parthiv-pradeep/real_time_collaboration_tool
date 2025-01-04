const mongoose = require('mongoose');

// Define the Document schema
const DocumentSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true, // Ensure each document has an ID
    },
    data: {
        type: Object,
        default: {}, // Default to an empty object if no data is provided
    },
});

// Create and export the Document model
module.exports = mongoose.model('Document', DocumentSchema);
