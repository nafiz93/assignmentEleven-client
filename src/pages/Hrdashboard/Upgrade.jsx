import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";

export default function Upgrade() {
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);

  // Load plans from backend
  useEffect(() => {
    fetch("http://localhost:3000/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data));
  }, []);

  // Create checkout and redirect to Stripe
  function handleUpgrade(planName) {
    fetch("http://localhost:3000/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uId: user.uid, plan: planName }),
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.href = data.url;
      });
  }

  if (!user) return <p>Please login.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Upgrade Plans</h2>

      {plans.length === 0 && <p>Loading plans...</p>}

      {plans.map((p) => {
        // ✅ Frontend UX block: prevent paying for same plan
        const alreadyOnThisPlan = user.subscription === p.plan;

        return (
          <div
            key={p.plan}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 12,
              opacity: alreadyOnThisPlan ? 0.6 : 1,
            }}
          >
            <p><b>Plan:</b> {p.plan}</p>
            <p><b>Price:</b> ${(p.priceCents / 100).toFixed(2)}</p>
            <p><b>Employee Limit:</b> {p.limit}</p>

            <button
              onClick={() => handleUpgrade(p.plan)}
              disabled={alreadyOnThisPlan}
            >
              {alreadyOnThisPlan ? "Current Plan" : `Upgrade to ${p.plan}`}
            </button>
          </div>
        );
      })}
    </div>
  );
}
