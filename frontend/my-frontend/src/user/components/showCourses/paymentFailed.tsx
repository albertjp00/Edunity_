import { useNavigate, useSearchParams } from "react-router-dom";
import "./paymentFailed.css";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reason =
    searchParams.get("reason") || "Your payment could not be completed.";

  return (
    <div className="failed-container">
      <div className="failed-card">
        <div className="failed-icon">✖</div>

        <h1 className="failed-title">Payment Failed</h1>

        <p className="failed-text">
          Unfortunately, your payment was not completed.
        </p>

        <div className="failed-reason">
          {reason}
        </div>

        <div className="failed-actions">
          {/* <button
            className="failed-btn primary"
            onClick={() => navigate("/checkout")}
          >
            Try Again
          </button> */}

          <button
            className="failed-btn secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
