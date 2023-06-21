import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_URL, SOCKET_URL } from '../constants';

export const useChat = (username) => {
  const savedMessages = localStorage.getItem('messages');
  const [messages, setMessages] = useState(() => {
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const socketRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(API_URL);
        const normalizedMessages = data.comments.splice(5, 5).map((message) => {
          return { _id: message.id, ...message };
        });
        setMessages(normalizedMessages);
      } catch (error) {
        console.error(error);
      }
    };

    if (!savedMessages) {
      fetchData();
    }
  }, [savedMessages]);

  useEffect(() => {
    if (username) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      socketRef.current.on('chatMessage', (message) => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          localStorage.setItem('messages', JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      });

      socketRef.current.on('deleteMessage', (messageId) => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.filter(
            (message) => message._id !== messageId
          );
          localStorage.setItem('messages', JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [username]);

  return { messages, socketRef, setMessages };
};
