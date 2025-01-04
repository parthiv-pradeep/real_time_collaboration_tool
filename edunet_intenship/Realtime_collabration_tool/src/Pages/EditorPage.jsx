import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './EditorPage.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ align: [] }],
    ['image', 'blockquote', 'code-block'],
    ['clean'],
];

export default function EditorPage() {
    const { id: documentId } = useParams();
    const wrapperRef = useRef();
    const [socket, setSocket] = useState(null);
    const [quill, setQuill] = useState(null);

    // Establish socket connection
    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);

        s.on("connect", () => console.log("Connected to server:", s.id));
        s.on("disconnect", () => console.log("Disconnected from server"));

        return () => {
            s.disconnect();
        };
    }, []);

    // Save document changes periodically
    useEffect(() => {
        if (!socket || !quill) return;

        const interval = setInterval(() => {
            socket.emit('save-document', quill.getContents());
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, [socket, quill]);

    // Load document from the server
    useEffect(() => {
        if (!socket || !quill) return;

        socket.once('load-document', (document) => {
            quill.setContents(document);
            quill.enable(); // Enable editor once the document is loaded
        });

        socket.emit('get-document', documentId);
    }, [socket, quill, documentId]);

    // Handle incoming changes from other clients
    useEffect(() => {
        if (!socket || !quill) return;

        const handleReceiveChanges = (delta) => {
            quill.updateContents(delta);
        };

        socket.on('receive-changes', handleReceiveChanges);

        return () => {
            socket.off('receive-changes', handleReceiveChanges);
        };
    }, [socket, quill]);

    // Broadcast changes made in the editor to other clients
    useEffect(() => {
        if (!socket || !quill) return;

        const handleTextChange = (delta, oldDelta, source) => {
            if (source !== 'user') return;
            socket.emit('send-changes', delta);
        };

        quill.on('text-change', handleTextChange);

        return () => {
            quill.off('text-change', handleTextChange);
        };
    }, [socket, quill]);

    // Initialize the Quill editor
    useEffect(() => {
        if (!wrapperRef.current) return;

        wrapperRef.current.innerHTML = '';
        const editor = document.createElement('div');
        wrapperRef.current.append(editor);

        const Q = new Quill(editor, {
            theme: 'snow',
            modules: { toolbar: TOOLBAR_OPTIONS },
        });

        Q.disable(); // Initially disable the editor until the document is loaded
        Q.setText('Loading...');
        setQuill(Q);
    }, []);

    const handleShare = () => {
        const baseUrl = window.location.origin;
        const documentLink = `${baseUrl}/document/${documentId}`;

        navigator.clipboard.writeText(documentLink)
            .then(() => alert(`Document link copied to clipboard:\n${documentLink}`))
            .catch(() => alert('Failed to copy the document link.'));
    };

    return (
        <>
            <div className="header">
                <h1>Real-Co</h1>
                <button className="share_btn" onClick={handleShare}>Share</button>
            </div>
            <div className="container" ref={wrapperRef}></div>
        </>
    );
}
