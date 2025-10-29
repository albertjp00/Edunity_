import React from "react";
import "./modal.css";

interface ConfirmModalProps {
  show: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}


const ConfirmModal:React.FC<ConfirmModalProps> = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title || "Confirm Action"}</h3>
        <p>{message || "Are you sure?"}</p>
        <div className="modal-actions">
          <button className="btn cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div> 
  );
};

export default ConfirmModal;
