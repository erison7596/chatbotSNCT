"use client"
import React, { useState, useEffect, useCallback } from 'react';
import ChatComponent from '../components/ChatComponent';
import ChatSidebar from '../components/ChatSidebar';
import Header from '../components/Header';
import LoadingScreen from '../components/LoadingScreen';
import InitialScreen from '../components/InitialScreen';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const Home = () => {
  const [userName, setUserName] = useState('');
  const [chatName, setChatName] = useState('');
  const [chatId, setChatId] = useState('');
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [initialMessages, setInitialMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);
  const [isUserNameSet, setIsUserNameSet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  const cleanMessageText = (text) => {
    const regex = /\/provide_name\{"name":"(.*?)"\}/;
    const match = text.match(regex);
    return match ? text.replace(regex, match[1]) : text;
  };

  const startChat = useCallback(async (name, id, isNew = false) => {
    setIsLoading(true);
    const uniqueChatId = id || `chat_${Date.now()}`;
    setChatId(uniqueChatId);
    localStorage.setItem('currentChatId', uniqueChatId);
    if (isNew) {
      const newChat = { id: uniqueChatId, name: 'New Chat' };
      const updatedChats = [...chats, newChat];
      setChats(updatedChats);
      localStorage.setItem('chats', JSON.stringify(updatedChats));
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: uniqueChatId,
            message: `/provide_name{"name":"${name}"}`,
          }),
        });
        const data = await response.json();

        if (data && data.length > 0) {
          const botMessage = cleanMessageText(data[0].text);
          setInitialMessages([{ text: botMessage, sender: 'bot', isNew: true }]);
          setChatName(botMessage);
        }
      } catch (error) {
        console.error('Error starting chat:', error);
      }
    } else {
      const storedMessages = JSON.parse(localStorage.getItem(`chat_${uniqueChatId}_messages`)) || [];
      const updatedMessages = storedMessages.map(msg => ({ ...msg, isNew: false }));
      setInitialMessages(updatedMessages);
    }
    setIsChatStarted(true);
    setIsLoading(false);
  }, [chats, cleanMessageText]);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedChatId = localStorage.getItem('currentChatId');
    if (storedUserName) {
      setUserName(storedUserName);
      setIsUserNameSet(true);
    }

    const storedChats = JSON.parse(localStorage.getItem('chats')) || [];
    setChats(storedChats);
    if (storedChatId) {
      setChatId(storedChatId);
      const selectedChat = storedChats.find(chat => chat.id === storedChatId);
      if (selectedChat) {
        setChatName(selectedChat.name);
        startChat(storedUserName, storedChatId); 
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'chats') {
        const updatedChats = JSON.parse(event.newValue) || [];
        setChats(updatedChats);
        const currentChat = updatedChats.find(chat => chat.id === chatId);
        if (currentChat) {
          setChatName(currentChat.name);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [chatId]);

  const handleAddChat = () => {
    const uniqueChatId = `chat_${Date.now()}`;
    const newChat = { id: uniqueChatId, name: 'New Chat' };
    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    setChatId(uniqueChatId);
    setChatName('New Chat');
    setInitialMessages([]);
    startChat(userName, uniqueChatId, true);
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (id) => {
    const selectedChat = chats.find(chat => chat.id === id);
    if (selectedChat) {
      setChatName(selectedChat.name);
      startChat(userName, selectedChat.id);
      setIsSidebarOpen(false); 
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserNameSubmit = (name) => {
    setUserName(name);
    localStorage.setItem('userName', name);
    setIsUserNameSet(true);
    startChat(name, null, true);
  };

  const openModal = (chat) => {
    setChatToDelete(chat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setChatToDelete(null);
    setIsModalOpen(false);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('chats');
    chats.forEach(chat => {
      localStorage.removeItem(`chat_${chat.id}_messages`);
    });
    window.location.reload(); 
  };

  const deleteChat = (id) => {
    const updatedChats = chats.filter(chat => chat.id !== id);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    localStorage.removeItem(`chat_${id}_messages`);
    window.location.reload(); 
    closeModal(); 
  };

  const confirmDeleteChat = () => {
    if (chatToDelete) {
      if (chatToDelete.id === 'all') {
        clearLocalStorage();
      } else {
        deleteChat(chatToDelete.id);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col teste">
      {isLoading ? (
        <LoadingScreen />
      ) : isUserNameSet ? (
        <>
          <Header onToggleSidebar={handleToggleSidebar} />
          <div className="flex flex-1 overflow-hidden relative">
            <ChatSidebar 
              chats={chats} 
              currentChatId={chatId} 
              onSelectChat={handleSelectChat} 
              onAddChat={handleAddChat} 
              isOpen={isSidebarOpen}
              openModal={openModal} 
            />
            <main className="flex-1 flex flex-col h-[100dvh-64px] overflow-y-auto">
              {isChatStarted ? (
                <ChatComponent 
                  chatName={chatName} 
                  chatId={chatId} 
                  initialMessages={initialMessages} 
                  setChatName={setChatName} 
                  setChats={setChats}
                />
              ) : (
                <div className="flex flex-1 justify-center items-center flex-col">
                  <h2 className="text-2xl mb-1">Selecione ou crie um novo chat para começar</h2>
                  <button 
                    onClick={handleAddChat} 
                    className="py-2 px-4 bg-green-500 text-white rounded-2xl hover:bg-green-600"
                  >
                    Iniciar um novo chat
                  </button>
                </div>
              )}
              <footer className="relative px-2 py-1 text-center text-xs text-token-text-secondary md:px-[60px]">
                <p>Desenvolvido por <a href='https://github.com/erison7596' target='_blank' className='git'>Erison</a></p>
              </footer>
            </main>
            <DeleteConfirmationModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onConfirm={confirmDeleteChat}
              chatName={chatToDelete?.name}
            />
          </div>
        </>
      ) : (
        <InitialScreen onSubmit={handleUserNameSubmit} />
      )}
    </div>
  );
};

export default Home;
