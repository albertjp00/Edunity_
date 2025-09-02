// components/RejectKycModal.tsx
import React, { useState } from "react";
import './rejectmodal.css'

interface RejectKycModalProps {
  isOpen: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const RejectKycModal: React.FC<RejectKycModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const rejectionReasons = [
    "Invalid ID proof",
    "Blurry/unclear documents",
    "Expired documents",
    "Name mismatch",
    "Address mismatch",
    "Other",
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Reject KYC</h2>
        <p>Please select a reason for rejection:</p>

        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="form-select"
        >
          <option value="">-- Select Reason --</option>
          {rejectionReasons.map((r, i) => (
            <option key={i} value={r}>
              {r}
            </option>
          ))}
        </select>

        {reason === "Other" && (
          <textarea
            placeholder="Enter custom reason"
            className="form-textarea"
            onChange={(e) => setReason(e.target.value)}
          />
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn-confirm"
            disabled={!reason}
            onClick={() => onConfirm(reason)}
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectKycModal;
