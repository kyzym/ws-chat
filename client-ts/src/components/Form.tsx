import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import SendIcon from '@mui/icons-material/Send';
import { Box, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface FormProps {
  onUsernameSubmit: (username: string) => void;
  onLogout: () => void;
  username: string;
  onSubmitMessage: (message: string) => void;
  onTyping: () => void;
  typing: string;
}

export const Form: React.FC<FormProps> = ({
  onUsernameSubmit,
  onLogout,
  username,
  onSubmitMessage,
  onTyping,
  typing,
}) => {
  const [storedMessage, setStoredMessage] = useLocalStorage('message', '');
  const [messageError, setMessageError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userNameField = event.currentTarget.username;
    const username = userNameField.value.trim();

    if (username === '') {
      setUsernameError(true);
      return;
    }
    setUsernameError(false);
    onUsernameSubmit(username);
    toast(`Hello ${username} 🥳`);
  };

  const handleMessageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = storedMessage.trim();
    if (message === '') {
      setMessageError(true);
      return;
    }
    setMessageError(false);
    onSubmitMessage(message);
    setStoredMessage('');
  };

  const handleLogout = () => {
    onLogout();
    toast(`Goodbye ${username} 🥲`);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStoredMessage(event.target.value);
  };

  return (
    <Container
      component="div"
      sx={{
        mb: 3,
        display: 'flex',
        flexDirection: 'column',
        mt: 'auto',
      }}>
      <CssBaseline />
      {username ? (
        <Box>
          <Grid container alignItems="center" justifyContent="space-between">
            <Typography variant="h5">{username.toUpperCase()}</Typography>
            <Button
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size="small"
              variant="contained">
              Logout
            </Button>
          </Grid>
          <Box component="form" onSubmit={handleMessageSubmit}>
            <TextField
              error={messageError}
              helperText={messageError ? "Message can't be empty" : ''}
              margin="normal"
              required
              fullWidth
              id="message"
              label="Your Message"
              name="message"
              autoFocus
              value={storedMessage}
              onChange={handleChange}
              autoComplete="off"
              inputProps={{ style: { wordBreak: 'break-all' } }}
              multiline
              minRows={2}
              onKeyDown={onTyping}
              sx={{ mb: '0' }}
            />

            <Grid container alignItems="center" height="5px">
              {typing ? (
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {typing + ' is typing...'}
                </Typography>
              ) : null}
            </Grid>

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                endIcon={<SendIcon />}>
                Send
              </Button>
            </Grid>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              error={usernameError}
              helperText={usernameError ? "Username can't be empty" : ''}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Your Username"
              name="username"
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};
