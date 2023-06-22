import { List } from '@mui/material';
import { MessageItem } from './MessageItem';
import { useRef, useEffect } from 'react';
import { Messages } from '../types';

interface ChatComponentProps {
  messages: Messages;
  onDelete: (id: string | number) => void;
  username: string;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({
  messages,
  onDelete,
  username,
}) => {
  const scrollRef = useRef<HTMLUListElement>(null);
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
        p: 1,
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
