import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./paymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✔</div>

        <h1 className="success-title">Payment Successful 🎉</h1>

        <p className="success-text">
          Thank you for your purchase.
        </p>

        {orderId && (
          <p className="order-id">
            Order ID: <span>{orderId}</span>
          </p>
        )}

        <div className="success-actions">
          <button
            className="success-btn primary"
            onClick={() => navigate("/user/myCourses")}
          >
            Go to My Courses
          </button>

          <button
            className="success-btn secondary"
            onClick={() => navigate("/user/home")}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
