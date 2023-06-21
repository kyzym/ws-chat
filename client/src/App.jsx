import { Container, ThemeProvider, createTheme } from '@mui/material';
import { useState } from 'react';
import './App.css';
import { ChatComponent } from './components/Dashboard';
import Form from './components/Form';
import { useChat } from './hooks/useChat';
import { useLocalStorage } from './hooks/useLocalStorage';
import { VALID_ID_LENGTH } from './constants';

const defaultTheme = createTheme();

function App() {
  const [id, setId] = useState();
  const [username, setUsername] = useLocalStorage('username', null);

  const { messages, socketRef, setMessages } = useChat(username);

  const handleLogin = (username) => {
    setUsername(username);
  };

  const handleDelete = (id) => {
    if (socketRef.current) {
      if (id.toString().length < VALID_ID_LENGTH) {
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
