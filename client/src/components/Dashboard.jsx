import { List } from '@mui/material';
import { MessageItem } from './MessageItem';
import { useRef, useEffect } from 'react';

export const ChatComponent = ({ messages, onDelete, username }) => {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <List
      sx={{
        overflowY: 'scroll',
        mb: 3,
      }}
      ref={scrollRef}>
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
