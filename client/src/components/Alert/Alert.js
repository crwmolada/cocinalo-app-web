import React from 'react';
import './Alert.scss';
import { IoMdClose } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

const Alert = ({ message, type = 'error', onClose }) => {
  return (
    <div className="alert-overlay">
      <div className={`alert alert-${type}`}>
        <div className="alert-icon">
          <MdErrorOutline size={24} />
        </div>
        <div className="alert-content">
          <h3>Receta no encontrada</h3>
          <p>{message}</p>
        </div>
        <button className="alert-close" onClick={onClose}>
          <IoMdClose size={20} />
        </button>
      </div>
    </div>
  );
};

export default Alert; 