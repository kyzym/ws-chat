import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const ChatComponent = ({ messages, onDelete, username }) => {
  const getInitials = (name) => {
    const splitName = name.toUpperCase().split(' ');
    if (splitName.length === 1) return splitName[0].substring(0, 2);
    return splitName[0].substring(0, 1) + splitName[1].substring(0, 1);
  };

  return (
    <List>
      {messages &&
        messages.map((message, index) => (
          <Paper
            elevation={3}
            key={index}
            style={{
              marginBottom: '20px',
              backgroundColor:
                message.user.username === username
                  ? 'lightblue'
                  : index % 2 === 0
                  ? 'lightgray'
                  : 'white',
            }}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>{getInitials(message.user.username)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={message.user.username}
                secondary={message.body}
              />
              {message.user.username === username && (
                <Typography variant="caption" color="textSecondary">
                  Your message
                </Typography>
              )}
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(message._id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        ))}
    </List>
  );
};
