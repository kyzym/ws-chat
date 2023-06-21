import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Grid } from '@mui/material';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Form({
  onUsernameSubmit,
  onLogout,
  username,
  onSubmitMessage,
}) {
  const [storedMessage, setStoredMessage] = useLocalStorage('message', '');

  const handleSubmit = (event) => {
    event.preventDefault();
    const userNameField = event.currentTarget.username;
    const username = userNameField.value.trim();
    onUsernameSubmit(username);
  };

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const message = storedMessage.trim();
    onSubmitMessage(message);
    setStoredMessage('');
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleChange = (event) => {
    setStoredMessage(event.target.value);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {username ? (
        <div>
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
          <form onSubmit={handleMessageSubmit}>
            <TextField
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
            />
            <Button type="submit" variant="contained">
              Send
            </Button>
          </form>
        </div>
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
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
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
              sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}
