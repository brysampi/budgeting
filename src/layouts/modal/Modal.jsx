import React from 'react';
import ReactModal from 'react-modal';
import '../../css/modal.css';
import { LuX } from "react-icons/lu";

ReactModal.setAppElement('#root'); // For accessibility

const Modal = ({
  title,
  isModalOpen,
  onClose,
  children,
  fullscreen = false,
  maxWidth = '550px',
  closeOnOverlay = true,
  zIndex = 5000
}) => {
  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={closeOnOverlay}
      contentLabel={title || "Action Modal"}
      className={fullscreen ? "modal-content modal-content--fullscreen" : "modal-content"}
      overlayClassName={fullscreen ? "modal-overlay modal-overlay--fullscreen" : "modal-overlay"}
      style={{
        overlay: { zIndex: zIndex },
        content: !fullscreen ? { maxWidth: maxWidth } : {}
      }}
      closeTimeoutMS={200}
    >
      <div className="modal-inner">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <LuX size={24} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </ReactModal>
  );
};

export default Modal;
