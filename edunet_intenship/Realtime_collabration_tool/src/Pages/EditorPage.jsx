import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './EditorPage.css';
import { io } from 'socket.io-client';

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
    const wrapperRef = useRef();
    const [socket, setSocket] = useState(null);
    const [quill, setQuill] = useState(null);

    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);

        s.on("connect", () => {
            console.log("Connected to server:", s.id);
        });

        s.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            s.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!quill || !socket) return;

        const receiveHandler = (delta) => {
            quill.updateContents(delta);
        };

        socket.on('receive-changes', receiveHandler);

        return () => {
            socket.off('receive-changes', receiveHandler);
        };
    }, [quill, socket]);

    useEffect(() => {
        if (!quill || !socket) return;

        const textChangeHandler = (delta, oldDelta, source) => {
            if (source !== 'user') return;
            socket.emit('send-changes', delta);
        };

        quill.on('text-change', textChangeHandler);

        return () => {
            quill.off('text-change', textChangeHandler);
        };
    }, [quill, socket]);

    useEffect(() => {
        if (!wrapperRef.current) return;

        wrapperRef.current.innerHTML = '';
        const editor = document.createElement("div");
        wrapperRef.current.append(editor);

        const Q = new Quill(editor, {
            theme: 'snow',
            modules: { toolbar: TOOLBAR_OPTIONS },
        });
        setQuill(Q);
    }, []);

    return <div className="container" ref={wrapperRef}></div>;
}
