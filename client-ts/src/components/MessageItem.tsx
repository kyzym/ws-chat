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
import { useTheme } from '@mui/material/styles';
import { UsersMessage } from '../types';

interface MessageItemProps {
  message: UsersMessage;
  onDelete: (id: string | number) => void;
  username: string;
  index: number;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onDelete,
  username,
  index,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      style={{
        marginBottom: '20px',
        backgroundColor:
          message.user.username === username
            ? theme.palette.info.light
            : index % 2 === 0
            ? theme.palette.grey[200]
            : theme.palette.background.paper,
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
};
