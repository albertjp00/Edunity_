import axios from "axios"
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

  const navigate = useNavigate()

  const fetchKyc = async () => {
    try {
      const res = await adminApi.get(
        `/admin/get-kyc/${id}`
      )
      setKyc(res.data.data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load KYC details")
    }
  }

  const verifyKyc = async () => {
    if (!kyc) return
    try {
      const res = await adminApi.put(`/admin/verify-kyc/${kyc.instructorId}`
      )
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
    try {
      const res = await adminApi.put(`/admin/reject-kyc/${kyc.instructorId}`
      )
      if (res.data.success) {
        toast.success("KYC Rejected")
        navigate("/admin/instructors")
      }
    } catch (err) {
      console.error(err)
      toast.error("Verification failed")
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
        href={`http://localhost:5000/assets/${kyc.idProof}`}
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
        href={`http://localhost:5000/assets/${kyc.addressProof}`}
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
      <button onClick={rejectKyc} className="verify-btn">
        Reject
      </button>
    </div>
  )
}

export default VerifyKYC
