import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {  

  useEffect(() => {    
    const handleEscape = (event) => {
      if (event.keyCode === 27) {        
        onClose();
      }
    };

    if (isOpen) {      
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {      
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'visible';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {    
    return null;
  }
  
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={() => {      
      onClose();
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => {          
          onClose();
        }}>&times;</button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;