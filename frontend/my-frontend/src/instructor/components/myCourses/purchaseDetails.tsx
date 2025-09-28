import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/userApi";

export interface IPurchaseDetails {
  name: string;
  email: string;
  title: string;
  thumbnail?: string;
  price?: number;
  category: string;
  amountPaid: number;
  paymentStatus: string;
  createdAt: string; // Date will come as string from API
}


const PurchaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // purchaseId from route
  const [details, setDetails] = useState<IPurchaseDetails | null>(null);

  useEffect(() => {
    if (!id) return;
    const getPurchaseDetails = async ()=>{
        try {
            const res = await api.get(`/instructor/purchaseDetails/${id}`)
            if(res.data.success){
                setDetails(res.data.details)
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    getPurchaseDetails()
  }, [id]);

  if (!details) return <p>Loading...</p>;


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Purchase Details</h2>

      <div className="flex gap-4 mb-4">
        {details.thumbnail && (
          <img
            src={details.thumbnail}
            alt={details.title}
            className="w-32 h-32 object-cover rounded"
          />
        )}
        <div>
          <h3 className="text-lg font-semibold">{details.title}</h3>
          <p className="text-gray-600">Category: {details.category}</p>
          <p className="text-gray-600">Price: ₹{details.price ?? "N/A"}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <p><strong>Purchased by:</strong> {details.name} ({details.email})</p>
        <p><strong>Amount Paid:</strong> ₹{details.amountPaid}</p>
        <p><strong>Payment Status:</strong> {details.paymentStatus}</p>
        <p><strong>Purchased At:</strong> {new Date(details.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default PurchaseDetails;
