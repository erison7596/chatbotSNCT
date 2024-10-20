"use client"
import { useState, useEffect } from 'react';

const useChatName = () => {
  const [chatName, setChatName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('chatName2');
    if (savedName) {
      setChatName(savedName);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatName2', chatName);
  }, [chatName]);

  return [chatName, setChatName];
};

export default useChatName;
