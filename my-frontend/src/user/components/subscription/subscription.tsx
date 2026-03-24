import { toast } from "react-toastify";
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
  _id: string;
  name: string;
  durationInDays: number;
  features: string[];
  isActive: boolean;
  price: number;
}

const Subscription = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [subscription, setSubscription] = useState<ISubscription | null>(null);
  const [plans, setPlans] = useState<ISubscriptionPlan[] | null>(null);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const [activePayment, setActivePayment] = useState(false);

  const CheckSubscription = async () => {
    try {
      const res = await getSubscription();
      console.log("check", res);

      if (!res) return;
      setIsActive(res?.data.result);
      setSubscription(res?.data?.result);
    } catch (error) {
      console.log(error);
      setIsActive(false);
    } finally {
      setPageLoading(false);
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
      setPlans(res.data.subscription);
    } catch (error) {
      console.log(error);
      setIsActive(false);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!pageLoading && !isActive) {
      getSubscriptionPlans();
    }
    if (localStorage.getItem("payment_in_progress")) {
      localStorage.removeItem("payment_in_progress");
    }
  }, [pageLoading, isActive]);

  const daysLeft = subscription?.endDate
    ? Math.ceil(
        (new Date(subscription.endDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const handleSubscribe = async (id: string) => {
    if (activePayment) {
      toast.warning("Payment window is already open!");
      return;
    }

    if (localStorage.getItem("payment_in_progress") === "true") {
      toast.warning("Payment already in progress in another tab!");
      return;
    }

    setActivePayment(true);
    setProcessingPlanId(id);
    localStorage.setItem("payment_in_progress", "true");

    try {
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
            await subscriptionVerify(response, id);
            toast.success("Subscription Activated!");
            CheckSubscription();
          } finally {
            setActivePayment(false);
            localStorage.removeItem("payment_in_progress");
            setProcessingPlanId(null);
          }
        },

        modal: {
          ondismiss: async function () {
            try {
              toast.info("Payment cancelled!");
              // await paymentSubscriptionCancel();  // Enable later if needed
            } finally {
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
      setActivePayment(false);
      localStorage.removeItem("payment_in_progress");
    }
  };

  const activePlans = plans?.filter((plan) => plan.isActive) ?? [];
return (
  <div className="min-h-screen bg-slate-50 p-8">
    <div className="max-w-6xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Choose Your Plan
        </h1>
        <p className="text-slate-600 max-w-md mx-auto">
          Unlock premium content and take your skills to the next level with our flexible subscriptions.
        </p>
      </header>

      {pageLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Verifying your status...</p>
        </div>
      )}

      {/* PRICING CARDS */}
      {!pageLoading && !isActive && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-start">
          {activePlans.map((plan) => (
            <div
              key={plan._id}
              className={`relative bg-white border rounded-3xl p-8 transition-all duration-300 group hover:shadow-2xl hover:-translate-y-2 
                ${plan.name.toLowerCase().includes('pro') ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-10' : 'border-slate-200'}`}
            >
              {/* Optional "Popular" Badge */}
              {plan.name.toLowerCase().includes('pro') && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                  <span className="text-slate-500 font-medium">/{plan.durationInDays} days</span>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full mb-6" />

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-600 text-sm leading-tight">
                    <div className="mt-0.5 rounded-full bg-indigo-50 p-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan._id)}
                disabled={activePayment}
                className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all duration-200 shadow-md active:scale-95
                  ${activePayment 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200"
                  }`}
              >
                {processingPlanId === plan._id ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing
                  </span>
                ) : "Get Started Now"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVE SUBSCRIPTION */}
      {!pageLoading && isActive && subscription && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-slate-200 shadow-xl rounded-3xl overflow-hidden mb-12">
            <div className="bg-indigo-600 px-8 py-4 flex justify-between items-center text-white">
              <h2 className="font-bold text-lg tracking-tight">Active Membership</h2>
              <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {subscription.isActive ? "● Premium" : "Expired"}
              </span>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-8">
                <div className="text-center md:text-left">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Started On</p>
                  <p className="font-semibold text-slate-800">{new Date(subscription.startDate).toLocaleDateString()}</p>
                </div>
                
                <div className="hidden md:flex flex-col items-center">
                   <div className="w-full h-0.5 bg-slate-100 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-600" />
                   </div>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Renews/Ends</p>
                  <p className="font-semibold text-slate-800">{new Date(subscription.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl">⏳</div>
                  <div>
                    <p className="text-indigo-900 font-bold leading-none">
                       {daysLeft && daysLeft > 0 ? `${daysLeft} Days Remaining` : "Membership Expired"}
                    </p>
                    <p className="text-indigo-600/70 text-xs mt-1">Thank you for being a member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 px-2">Your Premium Courses</h3>
            <SubscriptionCourses />
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default Subscription;
