import React, { useEffect, useState } from "react";
import "./wallet.css";
import instructorApi from "../../../api/instructorApi";

interface Transaction {
  type: "credit" | "debit";
  amount: number;
  courseId?: string;
  description?: string;
  createdAt: string;
}

interface WalletData {
  userId: string;
  balance: number;
  transactions: Transaction[];
}


const UserWallet: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        // setLoading(true);
        
        const res = await instructorApi.get('/instructor/wallet');
        console.log('sw',res);
        
        setWallet(res.data);
      } catch (err) {
        console.log(err);
        
      } finally {
        // setLoading(false); 
      }
    };

    fetchWallet();
  }, []);

  // if (loading) return <p className="wallet-loading">Loading wallet...</p>;

  return (
    <div className="wallet-container">
      <h2 className="wallet-title">My Wallet</h2>

      <div className="wallet-balance">
        <h3>Current Balance</h3>
        <p>₹{wallet?.balance.toFixed(2)}</p>
      </div>

      <div className="wallet-transactions">
        <h3>Transaction History</h3>
        {wallet?.transactions.length ? (
          <table className="wallet-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount (₹)</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {wallet?.transactions
                .slice()
                .reverse()
                .map((tx, index) => (
                  <tr
                    key={index}
                    className={tx.type === "credit" ? "credit" : "debit"}
                  >
                    <td>{tx.type === "credit" ? "Credit" : "Debit"}</td>
                    <td>{tx.amount.toFixed(2)}</td>
                    <td>{tx.description || "N/A"}</td>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default UserWallet;
