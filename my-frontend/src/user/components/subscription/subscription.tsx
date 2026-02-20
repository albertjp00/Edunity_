import { toast } from "react-toastify";
import "./subscription.css";
import { useEffect, useState } from "react";
import {
  getSubscription,
  getSubscriptionPlan,
  subscribe,
  subscriptionVerify,
} from "../../services/courseServices";
import SubscriptionCourses from "./subscriptionCourses";
import type { RazorpayInstance, RazorpayOptions } from "../../interfaces";

export interface ISubscription {
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  paymentId: string;
  orderId: string;
  billingCycle: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface ISubscriptionPlan {
    _id : string;
  durationInDays: number;
  features: string[];
  isActive: boolean;
  price: number;
}

const Subscription = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<ISubscription | null>(null);
  const [plan, setPlan] = useState<ISubscriptionPlan>();

  const [activePayment, setActivePayment] = useState(false);

  const CheckSubscription = async () => {
    try {
      const res = await getSubscription();
      console.log(res);
      if (!res) return;
      setIsActive(res?.data.result);
      setSubscription(res?.data?.result);
    } catch (error) {
      console.log(error);
      setIsActive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    CheckSubscription();
  }, []);

  const getSubscriptionPlans = async () => {
    try {
      if (isActive) return;

      const res = await getSubscriptionPlan();
      console.log("subss ", res);
      if (!res) return;
      setPlan(res.data.subscription);
    } catch (error) {
      console.log(error);
      setIsActive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !isActive) {
      getSubscriptionPlans();
    }
  }, [loading, isActive]);

  const daysLeft = subscription?.endDate
    ? Math.ceil(
        (new Date(subscription.endDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const handleSubscribe = async (id : string) => {
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
      console.log("sub ",id);
      
      const res = await subscribe(id);
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
            await subscriptionVerify(response);

            toast.success("Subscription Activated!");
            CheckSubscription();
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
          {plan && plan.isActive ? (
            <div className="">
              <h2>Premium Access</h2>

              <p className="subscription-desc">
                Unlock all subscription-enabled courses and watch unlimited
                content.
              </p>

              <ul className="subscription-benefits">
                {plan.features.map((feature, index) => (
                  <li key={index}>✔ {feature}</li>
                ))}
              </ul>

              <h3 className="subscription-price">
                ₹{plan.price} / {plan.durationInDays} days
              </h3>

              <button
                className="btn-subscribe"
                onClick={()=>handleSubscribe(plan._id)}
                disabled={loading || activePayment}
              >
                {loading ? "Processing..." : "Subscribe Now"}
              </button>
            </div>
          ) : (
            <p>No active subscription plan available.</p>
          )}
        </div>
      )}

      {!loading && isActive && subscription && (
        <>
          {/* SUBSCRIPTION DETAILS */}
          <div className="subscription-strip">
            <div className="strip-top">
              <h2>Premium Subscription</h2>
              <span className="pill-active">
                {subscription.isActive ? "Active" : "Expired"}
              </span>
            </div>

            <div className="strip-timeline">
              <div className="timeline-item">
                <p className="label">Started</p>
                <p>{new Date(subscription.startDate).toDateString()}</p>
              </div>

              <div className="timeline-line" />

              <div className="timeline-item">
                <p className="label">Ends On</p>
                <p>{new Date(subscription.endDate).toDateString()}</p>
              </div>
            </div>

            <div className="strip-footer">
              <div className="billing-info">
                <p className="label">Access </p>
                {/* <p>{subscription?.billingCycle}</p> */}
              </div>

              <div className="days-badge">⏳ {daysLeft && daysLeft > 0 ? `${daysLeft} days left` : "Expired"}</div>
            </div>
          </div>

          {/* COURSES */}
          <div className="courses-section">
            <SubscriptionCourses />
          </div>
        </>
      )}
    </div>
  );
};

export default Subscription;
