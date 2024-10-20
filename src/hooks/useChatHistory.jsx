"use client"
import { useState, useEffect } from 'react';

const useChatHistory = (chatId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_${chatId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [chatId]);

  useEffect(() => {
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
  }, [messages, chatId]);

  return [messages, setMessages];
};

export default useChatHistory;
