import React, { useState, useEffect } from "react";
import "./addSubscription.css";
import {
  createSubscriptionPlan,
  getSubscriptionPlans,
  updateSubscriptionPlan,
} from "../../services/adminServices";
import { toast } from "react-toastify";

interface ISubscription {
  _id: string;
  name: string;
  price: number;
  durationInDays: number;
  features: string[];
  isActive: boolean;
}

const SubscriptionPlan: React.FC = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [durationInDays, setDurationInDays] = useState(30);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [plans, setPlans] = useState<ISubscription[]>([]);
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      const res = await getSubscriptionPlans();
      setPlans(res.data.subscription);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch plans");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures([...features, featureInput]);
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleCreate = async () => {
    if (plans.length > 0) {
      toast.error("Plan already exists. Edit instead.");
      return;
    }

    try {
      setLoading(true);

      const res = await createSubscriptionPlan({
        name,
        price,
        durationInDays,
        features,
        isActive,
      });

      if (res.data.success) {
        toast.success("Subscription created successfully");
        resetForm();
        fetchPlans();
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      setLoading(true);

      const res = await updateSubscriptionPlan(editingId, {
        name,
        price,
        durationInDays,
        features,
        isActive,
      });

      if (res.data.success) {
        toast.success("Subscription updated successfully");
        resetForm();
        fetchPlans();
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setName("");
    setPrice(0);
    setDurationInDays(30);
    setFeatures([]);
    setIsActive(true);
  };

  const handleEdit = (plan: ISubscription) => {
    setIsEditing(true);
    setEditingId(plan._id);

    setName(plan.name);
    setPrice(plan.price);
    setDurationInDays(plan.durationInDays);
    setFeatures(plan.features);
    setIsActive(plan.isActive);
  };

  return (
    <div className="admin-container">
      {/* LEFT SIDE */}
      {plans.length === 0 || isEditing ? (
        <div className="subscription-card">
          <div className="subscription-header">
            <h2>Create Subscription Plan</h2>
            <p>Define pricing and features</p>
          </div>

          <form className="subscription-form" onSubmit={submitHandler}>
            <div className="form-group">
              <label>Plan Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(+e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (Days)</label>
              <input
                type="number"
                min={1}
                value={durationInDays}
                onChange={(e) => setDurationInDays(+e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Features</label>
              <div className="feature-input">
                <input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                />
                <button type="button" onClick={addFeature}>
                  Add
                </button>
              </div>

              <div className="feature-list">
                {features.map((f, i) => (
                  <span key={i} className="feature-chip">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="toggle-row">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
              />
              <span>Active Plan</span>
            </div>

            <div className="buttons">
                <button className="submit-btn" disabled={loading}>
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Plan"
                  : "Create Plan"}
            </button>
            <button onClick={()=>setIsEditing(false)} className="submit-btn">cancel</button>
            </div>
          </form>
        </div>
      ) : null}

      {/* RIGHT SIDE */}
      <div className="plans-container">
        <h2>Current Plan</h2>

        {plans.length === 0 ? (
          <p>No plans available</p>
        ) : (
          plans.map((plan) => (
            <div key={plan._id} className="plan-card">
              <button className="edit-btn" onClick={() => handleEdit(plan)}>
                Edit Plan
              </button>

              <div className="plan-header">
                <h3>{plan.name}</h3>
                <span className={plan.isActive ? "active" : "inactive"}>
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="plan-price">₹{plan.price}</p>
              <p>{plan.durationInDays} Days</p>

              <ul>
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
