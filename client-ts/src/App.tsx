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

const defaultTheme = createTheme();

function App() {
  const [username, setUsername] = useLocalStorage('username', '');

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
      console.log(username, 'in handleMessageSubmit');
      const newMessage: Omit<Message, '_id'> = {
        body: message,
        postId: new Date().toString(),
        user: {
          username,
        },
      };
      if (socketRef.current) {
        socketRef.current.emit('chatMessage', newMessage);
      }
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
          />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
