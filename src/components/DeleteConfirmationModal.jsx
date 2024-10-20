import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, chatName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Excluir chat?</h2>
        <p className="mb-4">Isso excluirá <strong>{chatName}</strong>.</p>
        <p className="text-gray-600 mb-4">Você tem certeza disso? depois de feito não poderá ser refeito</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
