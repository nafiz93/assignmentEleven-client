import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export default function Upgrade() {
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);
  
const axiosSecure = useAxiosSecure();


  // Load plans from backend
  useEffect(() => {
  axiosSecure
    .get("/plans")
    .then((res) => {
      setPlans(Array.isArray(res.data) ? res.data : []);
    })
    .catch((err) => {
      console.error("plans load failed:", err);
      setPlans([]);
    });
}, [axiosSecure]);

  // Create checkout and redirect to Stripe
 function handleUpgrade(planName) {
  axiosSecure
    .post("/create-checkout", {
      uId: user.uid,
      plan: planName,
    })
    .then((res) => {
      const url = res.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        console.error("Checkout URL missing in response");
      }
    })
    .catch((err) => {
      console.error("checkout creation failed:", err);
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
