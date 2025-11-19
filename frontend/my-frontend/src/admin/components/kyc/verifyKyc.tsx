import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./verifyKyc.css"
import { toast } from "react-toastify"
import adminApi from "../../../api/adminApi"

interface KycDetails {
  instructorId: string
  idProof: string
  addressProof: string
}

const VerifyKYC: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [kyc, setKyc] = useState<KycDetails | null>(null)

  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedReason, setSelectedReason] = useState("")

  const navigate = useNavigate()

  const fetchKyc = async () => {
    try {
      const res = await adminApi.get(`/admin/getKyc/${id}`)
      setKyc(res.data.data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load KYC details")
    }
  }

  const verifyKyc = async () => {
    if (!kyc) return
    try {
      const res = await adminApi.put(`/admin/verifyKyc/${kyc.instructorId}`)
      if (res.data.success) {
        toast.success("KYC Verified")
        navigate("/admin/instructors")
      }
    } catch (err) {
      console.error(err)
      toast.error("Verification failed")
    }
  }

  const rejectKyc = async () => {
    if (!kyc) return
    if (!selectedReason.trim()) {
      toast.error("Please select a reason for rejection")
      return
    }

    try {
      const res = await adminApi.put(
        `/admin/rejectKyc/${kyc.instructorId}`,
        { reason: selectedReason }
      )
      if (res.data.success) {
        toast.success("KYC Rejected")
        navigate("/admin/instructors")
      }
    } catch (err) {
      console.error(err)
      toast.error("Rejection failed")
    } finally {
      setShowRejectModal(false)
      setSelectedReason("")
    }
  }

  useEffect(() => {
    fetchKyc()
  }, [])

  if (!kyc) return <p>Loading KYC details...</p>

  return (
    <div className="kyc-view">
      <h2>KYC Details</h2>

      <p>
        <strong>ID Proof:</strong>
      </p>
      <a
        href={`${import.meta.env.VITE_API_URL}/assets/${kyc.idProof}`}
        target="_blank"
        rel="noopener noreferrer"
        className="kyc-link"
      >
        View ID Proof
      </a>

      <p>
        <strong>Address Proof:</strong>
      </p>
      <a
        href={`${import.meta.env.VITE_API_URL}/assets/${kyc.addressProof}`}
        target="_blank"
        rel="noopener noreferrer"
        className="kyc-link"
      >
        View Address Proof
      </a>

      <br />
      <button onClick={verifyKyc} className="verify-btn">
        Verify KYC
      </button>
      <button onClick={() => setShowRejectModal(true)} className="verify-btn">
        Reject
      </button>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="kyc-modal-overlay">
          <div className="modal-content">
            <h3>Reject KYC Verification</h3>
            <p>Please select a reason for rejecting this KYC request:</p>

            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="reject-select"
            >
              <option value="">-- Select Reason --</option>
              <option value="Invalid ID proof">Invalid ID proof</option>
              <option value="Blurry or unreadable document">
                Blurry or unreadable document
              </option>
              <option value="Mismatch in personal details">
                Mismatch in personal details
              </option>
              <option value="Expired document">Expired document</option>
              <option value="Incomplete submission">Incomplete submission</option>
              <option value="Suspected fraudulent document">
                Suspected fraudulent document
              </option>
              <option value="Other">Other</option>
            </select>

            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={rejectKyc}
                disabled={!selectedReason}
              >
                Confirm
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerifyKYC
