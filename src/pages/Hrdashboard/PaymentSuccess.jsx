import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Payment successful. Upgrading...");

  const uId = params.get("uId");
  const plan = params.get("plan");

  useEffect(() => {
    if (!uId || !plan) {
      setMsg("Missing uId or plan. Cannot upgrade.");
      return;
    }

    fetch("http://localhost:3000/upgrade-after-payment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uId, plan }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMsg(data.message || "Upgraded");
        setTimeout(() => navigate("/dashboard/hr"), 1000); // change if needed
      });
  }, [uId, plan, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Payment Success</h2>
      <p>{msg}</p>
    </div>
  );
}
