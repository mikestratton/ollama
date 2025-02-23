import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function OllamaChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama2', // Replace with your model
        prompt: input,
        stream: false, // Set to true for streaming responses
      });

      const ollamaMessage = { text: response.data.response, sender: 'ollama' };
      setMessages((prevMessages) => [...prevMessages, ollamaMessage]);
    } catch (error) {
      console.error('Error fetching response from Ollama:', error);
      const errorMessage = {
        text: 'Sorry, there was an error processing your request.',
        sender: 'ollama',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          borderBottom: '1px solid #ccc',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: '8px',
              textAlign: message.sender === 'user' ? 'right' : 'left',
            }}
          >
            <strong style={{ marginRight: '5px' }}>
              {message.sender === 'user' ? 'You:' : 'Ollama:'}
            </strong>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ padding: '16px', display: 'flex' }}
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '8px' }}
        />
        <button
          type="submit"
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default OllamaChat;