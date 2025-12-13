import { toast } from 'react-toastify';
import './subscription.css'
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../../../api/userApi';
import { getSubscription, subscribe } from '../../services/courseServices';
import SubscriptionCourses from './subscriptionCourses';

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const Subscription = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);


  const [activePayment, setActivePayment] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const CheckSubscription = async () => {
      try {
        const res = await getSubscription();
        
        setIsActive(res?.data.result);
      } catch (error) {
        console.log(error);
        setIsActive(false);
      } finally {
        setLoading(false);
      }
    };

    CheckSubscription();
  }, []);


  const handleSubscribe = async () => {

    if (activePayment) {
      toast.warning("Payment window is already open!");
      return;
    }

    if (localStorage.getItem("payment_in_progress") === "true") {
      toast.warning("Payment already in progress in another tab!");
      return;
    }

    setLoading(true);
    setActivePayment(true);
    localStorage.setItem("payment_in_progress", "true");

    try {
      const res = await subscribe();
      if (!res) throw new Error("Failed to create subscription order.");

      const { data } = res;

      const options: RazorpayOptions = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Edunity",
        description: "Monthly Subscription",
        order_id: data.orderId,

        handler: async function (response) {
          try {
            await api.post("/user/paymentSubscription/verify", {
              ...response,
            });


            toast.success("Subscription Activated!");
            navigate("/user/mySubscriptions");

          } finally {
            setLoading(false);
            setActivePayment(false);
            localStorage.removeItem("payment_in_progress");
          }
        },

        modal: {
          ondismiss: async function () {
            try {
              toast.info("Payment cancelled!");
              // await paymentSubscriptionCancel();  // Enable later if needed
            } finally {
              setLoading(false);
              setActivePayment(false);
              localStorage.removeItem("payment_in_progress");
            }
          },
        },
        theme: { color: "#6a5af9" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Try again.");
      setLoading(false);
      setActivePayment(false);
      localStorage.removeItem("payment_in_progress");
    }
  };

  // const isActive = false; // Later replace with user subscription status

  return (
    <div className="subscription-container">
      <h1 className="subscription-title">Subscription Plan</h1>

      {loading && <p>Checking subscription...</p>}

      {!loading && !isActive && (
        <div className="subscription-card">
          <h2>Premium Access</h2>

          <p className="subscription-desc">
            Unlock all subscription-enabled courses and watch unlimited content.
          </p>

          <ul className="subscription-benefits">
            <li>✔ Access to all subscription courses</li>
            <li>✔ No ads</li>
            <li>✔ Premium certificate templates</li>
            <li>✔ Unlimited course viewing</li>
          </ul>

          <h3 className="subscription-price">₹399 / month</h3>

          <button
            className="btn-subscribe"
            onClick={handleSubscribe}
            disabled={loading || activePayment}
          >
            {loading ? "Processing..." : "Subscribe Now"}
          </button>
        </div>
      )}

      {/* ---- CASE 3: USER IS SUBSCRIBED ---- */}
      {!loading && isActive && (
        <div className="courses-section">
          <h2>Your Subscription Courses</h2>
          <SubscriptionCourses />
        </div>
      )}
    </div>
  );

};

export default Subscription;
