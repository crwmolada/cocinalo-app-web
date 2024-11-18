import React, { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Alert.scss';
import { IoMdClose } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

const Alert = ({ message, type = 'error', title, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <CSSTransition
      in={true}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div className="alert-overlay">
        <div className={`alert alert-${type}`}>
          <div className="alert-icon">
            <MdErrorOutline />
          </div>
          <div className="alert-content">
            {title && <h3>{title}</h3>}
            <p>{message}</p>
          </div>
          <button className="alert-close" onClick={onClose}>
            <IoMdClose />
          </button>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Alert; 