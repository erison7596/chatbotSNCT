import React, { useState, useEffect, useRef } from 'react';
import TypingText from './TypingText';

const ChatComponent = ({ chatName, setChatName, chatId, initialMessages = [], setChats }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem(`chat_${chatId}_messages`)) || [];
    const updatedMessages = storedMessages.map(msg => ({ ...msg, isNew: false }));
    setMessages(updatedMessages);

    const storedChats = JSON.parse(localStorage.getItem('chats')) || [];
    const currentChat = storedChats.find(chat => chat.id === chatId);
    if (currentChat) {
      setChatName(currentChat.name);
    }
  }, [chatId, setChatName]);

  useEffect(() => {
    localStorage.setItem(`chat_${chatId}_messages`, JSON.stringify(messages));
  }, [messages, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const cleanMessageText = (text) => {
    const regex = /\/provide_name\{"name":"(.*?)"\}/;
    return text.replace(regex, '$1');
  };

  const updateLocalStorageAndState = (updatedChats, updatedChatName) => {
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    setChatName(updatedChatName);
    setChats(updatedChats);
  };

  const sendMessage = async () => {
    if (input.trim() !== '') {
      const newMessage = { text: input, sender: 'user', isNew: false };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInput('');
      setIsTyping(true);
      setIsLoading(true);

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sender: chatId, message: input }),
        });

        const data = await response.json();
        setIsTyping(false);
        setIsLoading(false);

        const botMessages = data.map((message) => ({
          text: cleanMessageText(message.text),
          sender: 'bot',
          isNew: true,
        }));
        setMessages((prevMessages) => [...prevMessages, ...botMessages]);

        if (chatName === 'New Chat') {
          const updatedChatName = input;
          const updatedChats = JSON.parse(localStorage.getItem('chats')) || [];
          const chatIndex = updatedChats.findIndex(chat => chat.id === chatId);
          if (chatIndex !== -1) {
            updatedChats[chatIndex].name = updatedChatName;
            updateLocalStorageAndState(updatedChats, updatedChatName);
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setIsTyping(false);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 relative rounded-lg ${msg.sender === 'user' ? 'bg-green-500 text-black message-user' : 'bg-gray-300 message-bot'}`}>
                {msg.sender === 'bot' && msg.isNew ? <TypingText text={msg.text} /> : msg.text}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">Nenhuma mensagem</div>
        )}
        {isTyping && (
          <div className="text-left mb-4">
            <div className="inline-block p-2 rounded-md bg-gray-300">
              Digitando...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex p-4 border-t border-gray-300">
        <input
          className="flex-1 p-2 border border-gray-300 rounded-xl"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite uma mensagem..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="ml-2 p-2 bg-green-500 text-white rounded-xl hover:bg-green-600">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
