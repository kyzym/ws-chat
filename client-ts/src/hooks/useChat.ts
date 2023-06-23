import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { API_URL, SOCKET_URL } from '../constants';
import { Message, Messages } from '../types';
import { toast } from 'react-toastify';

export const useChat = (username: string) => {
  const savedMessages = localStorage.getItem('messages');
  const [messages, setMessages] = useState<Messages>(() => {
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const socketRef = useRef<Socket | null>(null);

  interface ServerMessage extends Omit<Message, '_id'> {
    id: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get<{ comments: ServerMessage[] }>(
          API_URL
        );
        const normalizedMessages = data.comments.map(({ id, ...message }) => {
          return { _id: id, ...message };
        });

        setMessages(normalizedMessages);
      } catch (error) {
        console.error(error);

        toast.error(
          'Failed to fetch messages from server. Please refresh the page and try again.'
        );
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
        timeout: 7000,
      });

      socketRef.current.on('connect_error', (error) => {
        toast.error(
          `Connection error: ${error.message}   The server for the backend fell asleep.Please wait about one minute.
        `,
          {
            autoClose: 12000,
            closeOnClick: true,
          }
        );
        console.log(
          '----Most likely, the server for the backend fell asleep.Please wait 30 seconds.'
        );
      });

      socketRef.current.on('chatMessage', (message) => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          localStorage.setItem('messages', JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      });

      socketRef.current.on('deleteMessage', (messageId: number | string) => {
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
