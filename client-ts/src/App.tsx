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

const defaultTheme = createTheme();

function App() {
  const [username, setUsername] = useLocalStorage('username', '');

  const { messages, socketRef, setMessages, handleTyping, typing } =
    useChat(username);

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

    socketRef.current?.disconnect();

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

      socketRef.current?.emit('chatMessage', newMessage);
    }
  };

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
            onTyping={handleTyping}
            typing={typing}
          />
        </Container>
        <ToastContainer autoClose={1500} />
      </ThemeProvider>
    </>
  );
}

export default App;
