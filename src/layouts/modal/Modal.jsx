import React from 'react';
import ReactModal from 'react-modal';
import '../../css/modal.css';
import { LuX } from "react-icons/lu";

ReactModal.setAppElement('#root'); // For accessibility

const Modal = ({ title, isModalOpen, onClose, children, fullscreen = false, maxWidth = '' }) => {
  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={onClose}
      contentLabel="Modal"
      // dito fix mo yung max width
      className={fullscreen ? "modal-content-fullscreen" : "modal-content"}
      overlayClassName={fullscreen ? "modal-overlay-fullscreen" : "modal-overlay"}
    >
      <div className="modal-header">
        <h2 className="modal-title">{title}</h2>
        <button onClick={onClose} className="hover:scale-110 transition-transform flex items-center justify-center p-2 rounded-full hover:bg-white/5"><LuX size={24} /></button>
      </div>
      <div className="modal-body">{children}</div>
    </ReactModal>
  );
};

export default Modal;
