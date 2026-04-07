import React from 'react';
import ReactModal from 'react-modal';
import '../../css/v1/modal.css';
import { LuX } from "react-icons/lu";

ReactModal.setAppElement('#root'); // For accessibility

const Modal = ({
  title,
  isModalOpen = true,
  onClose,
  children,
  fullscreen = false,
  maxWidth = '550px',
  closeOnOverlay = true,
  zIndex = 5000
}) => {
  console.log('Modal isModalOpen', isModalOpen)
  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={closeOnOverlay}
      contentLabel={title || "Action Modal"}
      className={fullscreen ? "modal-content-v1 modal-content--fullscreen" : "modal-content-v1"}
      overlayClassName={fullscreen ? "modal-overlay-v1 modal-overlay--fullscreen" : "modal-overlay-v1"}
      style={{
        overlay: { zIndex: zIndex },
        content: !fullscreen ? { maxWidth: maxWidth } : {}
      }}
      closeTimeoutMS={200}
    >
      <div className="modal-inner-v1">
        <div className="modal-header-v1">
          <h2 className="modal-title-v1">{title}</h2>
          <button
            onClick={onClose}
            className="modal-close-btn-v1"
            aria-label="Close modal"
          >
            <LuX size={24} />
          </button>
        </div>
        <div className="modal-body-v1">
          {children}
        </div>
      </div>
    </ReactModal>
  );
};

export default Modal;
