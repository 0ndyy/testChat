import React, { useState, useEffect, useRef } from 'react';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    // Connect to the WebSocket server
    ws.current = new WebSocket('wss://your-app.onrender.com');


    ws.current.onmessage = (event) => {
      // Check the type of event.data
      if (typeof event.data === 'string') {
        // If the data is a string, add it to messages
        setMessages((prevMessages) => [...prevMessages, event.data]);
      } else if (event.data instanceof Blob) {
        // If the data is a Blob, read it as text
        const reader = new FileReader();
        reader.onload = () => {
          setMessages((prevMessages) => [...prevMessages, reader.result]);
        };
        reader.readAsText(event.data);
      } else {
        console.error('Unsupported data type received:', event.data);
      }
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputValue.trim() !== '') {
      ws.current.send(inputValue);
      setInputValue('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Simple Chat App</h2>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
          marginBottom: '10px',
        }}
      >
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', marginRight: '10px' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatApp;
