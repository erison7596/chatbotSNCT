import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import TypingText from './TypingText';

const ChatSidebar = ({ chats, currentChatId, onSelectChat, onAddChat, isOpen, openModal }) => {
  return (
    <aside className={`bg-gray-100 p-4 w-64 teste2 fixed md:relative transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-50 flex flex-col`}>
      <h2 className="text-xl font-bold mb-4">Seus Chats</h2>
      <div className="flex-grow overflow-y-auto ">
        <ul>
          {chats.map((chat) => (
            <li key={chat.id} className={`chat-item ${chat.id === currentChatId ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
              <div className="chat-item-text" onClick={() => onSelectChat(chat.id)}>
                {chat.id === currentChatId && chat.name === 'New Chat' ? (
                  <TypingText text={chat.name} />
                ) : (
                  <span>{chat.name}</span>
                )}
              </div>
              <div className="chat-item-button">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <div className="h-8 w-8 p-0 flex justify-center items-center">
                      <MoreHorizontal className="h-4 w-4" />
                    </div>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-white border rounded-xl shadow-lg p-2 z-50">
                      <DropdownMenu.Item className="dropdown-menu-item" onSelect={() => openModal(chat)}>
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="h-5 w-5 shrink-0">
                        <path fill="red" fill-rule="evenodd" d="M10.556 4a1 1 0 0 0-.97.751l-.292 1.14h5.421l-.293-1.14A1 1 0 0 0 13.453 4zm6.224 1.892-.421-1.639A3 3 0 0 0 13.453 2h-2.897A3 3 0 0 0 7.65 4.253l-.421 1.639H4a1 1 0 1 0 0 2h.1l1.215 11.425A3 3 0 0 0 8.3 22H15.7a3 3 0 0 0 2.984-2.683l1.214-11.425H20a1 1 0 1 0 0-2zm1.108 2H6.112l1.192 11.214A1 1 0 0 0 8.3 20H15.7a1 1 0 0 0 .995-.894zM10 10a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1" clip-rule="evenodd"></path>
                      </svg>
                        <nav className='text-red-500'>Excluir</nav>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <button onClick={onAddChat} className="w-full py-2 bg-green-500 text-white rounded-2xl hover:bg-green-600 mb-2">Novo Chat</button>
        <button onClick={() => openModal({ id: 'all', name: 'todos os chats' })} className="w-full py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600">Apagar todos os chats</button>
      </div>
    </aside>
  );
};


export default ChatSidebar;
