import { useEffect, useRef, useState } from 'react';
import './App.css';
import Form from './components/Form';
import { Container, createTheme, ThemeProvider } from '@mui/material';
import { ChatComponent } from './components/Dashboard';
import axios from 'axios';
import { useLocalStorage } from './hooks/useLocalStorage';
import { io } from 'socket.io-client';

const defaultTheme = createTheme();

function App() {
  const [id, setId] = useState();
  const [username, setUsername] = useLocalStorage('username', null);
  const savedMessages = localStorage.getItem('messages');
  const [messages, setMessages] = useState(() => {
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const socketRef = useRef();

  const handleLogin = (username) => {
    setUsername(username);
  };

  const handleDelete = (id) => {
    if (socketRef.current) {
      if (id.toString().length < 24) {
        socketRef.current.emit('deleteMessageClient', id);
      } else {
        socketRef.current.emit('deleteMessageServer', id);
      }
      setMessages(messages.filter((message) => message._id !== id));
    }
  };

  const handleLogout = () => {
    setUsername(null);
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    window.localStorage.removeItem('messages');
  };

  const handleMessageSubmit = (message) => {
    const newMessage = {
      body: message,
      postId: new Date().toString(),
      user: {
        id,
        username,
      },
    };
    if (socketRef.current) {
      socketRef.current.emit('chatMessage', newMessage);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('https://dummyjson.com/comments');
        const normalizedMessages = data.comments.splice(5, 5).map((message) => {
          return { _id: message.id, ...message };
        });
        setMessages(normalizedMessages);
      } catch (error) {
        console.error(error);
      }
    };

    if (!savedMessages) {
      fetchData();
    }

    if (username) {
      socketRef.current = io('http://localhost:3000', {
        transports: ['websocket'],
      });
    }

    if (socketRef.current) {
      socketRef.current.on('chatMessage', (message) => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          localStorage.setItem('messages', JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      });

      socketRef.current.on('deleteMessage', (messageId) => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.filter(
            (message) => message._id !== messageId
          );
          localStorage.setItem('messages', JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [savedMessages, username]);

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="md">
          <ChatComponent
            messages={messages}
            onDelete={handleDelete}
            username={username}
          />
          <Form
            onIdSubmit={setId}
            onUsernameSubmit={handleLogin}
            onLogout={handleLogout}
            id={id}
            username={username}
            onSubmitMessage={handleMessageSubmit}
          />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
