import { Bars3Icon } from '@heroicons/react/24/outline';
import useMediaQuery from '../hooks/useMediaQuery';
import Image from 'next/image';

const Header = ({ onToggleSidebar }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)'); 

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center h-16">
      {!isDesktop && (
        <button onClick={onToggleSidebar} className="p-2 rounded-md hover:bg-gray-700">
          <Bars3Icon className="h-6 w-6" />
        </button>
      )}
      <Image src="/icon.png" alt="ChatBot IFPE" width={65} height={65} />
    </header>
  );
};

export default Header;
