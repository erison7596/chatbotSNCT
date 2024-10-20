"use client"
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center h-16">
        <div className="w-8 h-8 bg-gray-600 rounded-md"></div>
        <div className="w-11 h-11 bg-gray-600 rounded-full"></div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="bg-gray-100 p-4 w-64 flex flex-col">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="flex-grow overflow-y-auto space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className="w-full h-10 bg-green-300 rounded-2xl"></div>
            <div className="w-full h-10 bg-red-300 rounded-2xl"></div>
          </div>
        </aside>
        <main className="flex-1 flex flex-col h-full overflow-y-auto p-4">
          <div className="flex-1 space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="flex p-4 border-t border-gray-300 mt-4">
            <div className="flex-1 h-10 bg-gray-300 rounded"></div>
            <div className="w-24 h-10 bg-green-300 rounded ml-2"></div>
          </div>
          <footer className="text-center py-1 border-t mt-1 bg-gray-100">
          <div className="h-2 bg-gray-100 rounded w-48 mx-auto"></div>
      </footer>
        </main>
      </div>
      
    </div>
  );
};

export default LoadingScreen;
