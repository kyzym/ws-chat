import { List } from '@mui/material';
import { MessageItem } from './MessageItem';

export const ChatComponent = ({ messages, onDelete, username }) => {
  return (
    <List>
      {messages &&
        messages.map((message, index) => (
          <MessageItem
            key={message._id}
            message={message}
            onDelete={onDelete}
            username={username}
            index={index}
          />
        ))}
    </List>
  );
};
