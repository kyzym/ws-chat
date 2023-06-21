import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { getInitials } from '../helpers/helpers';

export const MessageItem = ({ message, onDelete, username, index }) => (
  <Paper
    elevation={3}
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
        secondaryTypographyProps={{ style: { wordBreak: 'break-all' } }}
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
);
