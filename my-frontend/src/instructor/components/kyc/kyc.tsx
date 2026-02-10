import { useState, type ChangeEvent, type FormEvent } from 'react'
import './kyc.css'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { kycSubmit } from '../../services/instructorServices'

interface KycFiles {
  idProof: File | null
  addressProof: File | null
}

const KycVerification: React.FC = () => {
  const navigate = useNavigate()

  const [file, setFile] = useState<KycFiles>({
    idProof: null,
    addressProof: null,
  })

  const validate = (): boolean => {
    if (!file.idProof) {
      toast.error('Please upload ID proof', { autoClose: 1500 })
      return false
    }

    if (!file.addressProof) {
      toast.error('Please upload address proof', { autoClose: 1500 })
      return false
    }

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf']

    if (
      !validTypes.includes(file.idProof.type) ||
      !validTypes.includes(file.addressProof.type)
    ) {
      toast.error('Only JPG, PNG, or PDF files are allowed', { autoClose: 1500 })
      return false
    }
    return true
  }

  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile((prev) => ({
        ...prev,
        idProof: e.target.files![0],
      }))
    }
  }

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile((prev) => ({
        ...prev,
        addressProof: e.target.files![0],
      }))
    }
  }

  const handleKYCSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const formData = new FormData()
    if (file.idProof) formData.append('idProof', file.idProof)
    if (file.addressProof) formData.append('addressProof', file.addressProof)


    try {
      const response = await kycSubmit(formData)

      if (response?.data.success) {
        toast.success('KYC submitted successfully!')
        navigate('/instructor/profile')
      }
    } catch (error) {
      console.error('KYC submission failed:', error)
      toast.error('Something went wrong!')
    }
  }

  return (
    <div className="kyc-container">
      <h2>Upload KYC Documents</h2>
      <form
        onSubmit={handleKYCSubmit}
        className="kyc-form"
        encType="multipart/form-data"
      >
        <label>ID Proof</label>
        <input type="file" name="idProof" onChange={handleIdChange} />

        <label>Address Proof</label>
        <input type="file" name="addressProof" onChange={handleAddressChange} />

        <button type="submit">Submit KYC</button>
      </form>
    </div>
  )
}

export default KycVerification
