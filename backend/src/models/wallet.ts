// models/walletModel.ts
import { Schema, model, Document } from "mongoose";

interface Transaction {
  type: "credit" | "debit";
  amount: number;
  courseId?: string;
  description?: string;
  createdAt: Date;
}

export interface IWallet extends Document {
  userId: string;
  balance: number;
  transactions: Transaction[];
}

const WalletSchema = new Schema<IWallet>({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      type: { type: String, enum: ["credit", "debit"], required: true },
      amount: { type: Number, required: true },
      courseId: { type: String },
      description: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export const WalletModel = model<IWallet>("Wallet", WalletSchema);
