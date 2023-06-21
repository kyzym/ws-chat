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
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  const handleLogin = (username) => {
    setUsername(username);

    socketRef.current = io('http://localhost:3000', {
      transports: ['websocket'],
    });
  };

  const handleDelete = (id) => {
    if (id.toString().length < 24) {
      socketRef.current.emit('deleteMessageClient', id);
    } else {
      socketRef.current.emit('deleteMessageServer', id);
    }
    setMessages(messages.filter((message) => message._id !== id));
  };

  const handleLogout = () => {
    setUsername(null);
    socketRef.current.disconnect();
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
    socketRef.current.emit('chatMessage', newMessage);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const { data } = await axios.get('https://dummyjson.com/comments');
        // setMessages(data.comments.splice(5, 5));
        const { data } = await axios.get('https://dummyjson.com/comments');
        const normalizedMessages = data.comments.splice(5, 5).map((message) => {
          return { _id: message.id, ...message };
        });
        setMessages(normalizedMessages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    socketRef.current = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    socketRef.current.on('chatMessage', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socketRef.current.on('deleteMessage', (messageId) => {
      setMessages((messages) =>
        messages.filter((message) => message._id !== messageId)
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

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
