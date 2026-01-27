import mongoose, { Schema, Document } from 'mongoose'

export interface IKyc extends Document {
  instructorId: string
  idProof: string
  addressProof: string
}

const KycSchema: Schema<IKyc> = new mongoose.Schema({
  instructorId: {
    type: String,
    required: true,
  },
  idProof: {
    type: String,
    required: true,
  },
  addressProof: {
    type: String,
    required: true,
  },
})

export const KycModel = mongoose.model<IKyc>('Kyc', KycSchema)

