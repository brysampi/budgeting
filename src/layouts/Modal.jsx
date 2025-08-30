import React from 'react';
import ReactModal from 'react-modal';
import '../css/modal.css';
import { LuX } from "react-icons/lu";

ReactModal.setAppElement('#root'); // For accessibility

const Modal = ({title, isOpen, onClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">
        <h2 className="modal-title">{title}</h2>
        <button onClick={onClose}><LuX /></button>
      </div>
      <div className="modal-body">{children}</div>
    </ReactModal>
  );
};

export default Modal;
