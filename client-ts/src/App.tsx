import {
  CircularProgress,
  Container,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { ChatComponent } from './components/Chat';
import { Form } from './components/Form';
import { useChat } from './hooks/useChat';
import { useLocalStorage } from './hooks/useLocalStorage';
import { VALID_ID_LENGTH } from './constants';
import { Message } from './types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const defaultTheme = createTheme();

function App() {
  const [username, setUsername] = useLocalStorage('username', '');
  const [prevMessageCount, setPrevMessageCount] = useState(0);
  const [messageSent, setMessageSent] = useState(false);

  const { messages, socketRef, setMessages } = useChat(username);

  const handleLogin = (username: string) => {
    setUsername(username);
  };

  const handleDelete = (id: string | number) => {
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
    setUsername('');
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    window.localStorage.clear();
  };

  const handleMessageSubmit = (message: string) => {
    if (username) {
      const newMessage: Omit<Message, '_id'> = {
        body: message,
        postId: new Date().toString(),
        user: {
          username,
        },
      };
      if (socketRef.current) {
        socketRef.current.emit('chatMessage', newMessage);
        setPrevMessageCount(messages.length);
        setMessageSent(true);
      }
    }
  };

  // Here we check that the message has been added. There's no such thing as too many checks. 😊
  useEffect(() => {
    if (messageSent && prevMessageCount === messages.length) {
      toast.warning(
        'Our sockets might be taking a nap.😴 Please wait for 30 seconds and try again.',
        {
          autoClose: 5000,
          closeOnClick: true,
        }
      );
      setMessageSent(false);
    } else if (messageSent) {
      setMessageSent(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container
          component="main"
          maxWidth="md"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            height: '100vh',
            padding: '1rem',
          }}>
          {messages.length === 0 ? (
            <CircularProgress sx={{ alignSelf: 'center' }} size="20%" />
          ) : (
            <ChatComponent
              messages={messages}
              onDelete={handleDelete}
              username={username}
            />
          )}
          <Form
            onUsernameSubmit={handleLogin}
            onLogout={handleLogout}
            username={username}
            onSubmitMessage={handleMessageSubmit}
          />
        </Container>
        <ToastContainer autoClose={1500} />
      </ThemeProvider>
    </>
  );
}

export default App;
