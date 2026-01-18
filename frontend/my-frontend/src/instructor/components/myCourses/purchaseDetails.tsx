import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./purchaseDetails.css";
import { purchaseDetails } from "../../services/instructorServices";

export interface IPurchaseDetails {
  name: string;
  title: string;
  thumbnail?: string;
  price?: number;
  category: string;
  amountPaid: number;
  paymentStatus?: string;
  createdAt: string; 
}

const PurchaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [details, setDetails] = useState<IPurchaseDetails[]>([]);

  useEffect(() => {
    if (!id) return;
    const getPurchaseDetails = async () => {
      try {
        const res = await purchaseDetails(id)
        if(!res)  return
        if (res.data.success) {
          setDetails(res.data.details); 
          console.log(res.data);
          
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPurchaseDetails();
  }, [id]);

  if (details.length === 0) return <p className="no-purchases">No purchases yet.</p>;

  return (
    <div className="purchase-container">
      <h1>Total Purchased Users - {details.length}</h1>
      <br />
      <br />
      <h2 className="purchase-heading">Purchase Details</h2>

      

      <div className="purchase-list">
        {details.map((purchase, index) => (
          <div key={index} className="purchase-card">
            <div className="purchase-info">
              {purchase.thumbnail && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/assets/${purchase.thumbnail}`}
                  alt={purchase.title}
                  className="purchase-thumbnail"
                />
              )}
              <div>
                <h3 className="purchase-title">{purchase.title}</h3>
                <p className="purchase-meta">Category: {purchase.category}</p>
                <p className="purchase-meta">
                  Price: ₹{purchase.price ?? "N/A"}
                </p>
              </div>
            </div>

            <div className="purchase-details">
              <p>
                <strong>Purchased by:</strong> {purchase.name}
              </p>
              <p>
                <strong>Amount Paid:</strong> ₹{purchase.amountPaid}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                {purchase.paymentStatus ?? "N/A"}
              </p>
              <p>
                <strong>Purchased At:</strong>{" "}
                {new Date(purchase.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseDetails;
