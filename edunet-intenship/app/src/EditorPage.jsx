import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const EditorPage = () => {
  const { id: documentId } = useParams();
  const [value, setValue] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socketRef.current = socket;

    socket.emit('get-document', documentId);

    socket.on('load-document', (document) => {
      setValue(document);
    });

    socket.on('receive-changes', (delta) => {
      setValue(delta);
    });

    return () => {
      socket.disconnect();
    };
  }, [documentId]);

  useEffect(() => {
    const handleAutosave = () => {
      fetch(`http://localhost:5000/document/${documentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: value }),
      })
      .then(response => response.json())
      .then(data => console.log(data.message))
      .catch(error => console.error('Error saving document:', error));
    };

    const intervalId = setInterval(handleAutosave, 5000); // Autosave every 5 seconds

    return () => clearInterval(intervalId);
  }, [value, documentId]);

  const handleChange = (content, delta, source, editor) => {
    setValue(content);
    if (source === 'user') {
      socketRef.current.emit('send-changes', content);
    }
  };

  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': [] }],
      [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const handleShare = () => {
    const url = `${window.location.origin}/document/${documentId}`;
    navigator.clipboard.writeText(url);
    alert(`Share this URL: ${url}`);
  };

  return (
     <div className="editor-page">
      <div className="navbar">
        <div className="navbar-left">
          <h1>Real-time colab</h1>
        </div>
        <div className="navbar-right">
          <button className="share-button" onClick={handleShare}>Share</button>
        </div>
      </div>
      <div className="toolbar-container">
        <ReactQuill value={value} onChange={handleChange} modules={modules} />
      </div>
    </div>
  );
};

export default EditorPage;
