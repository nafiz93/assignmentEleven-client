import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Payment successful. Upgrading your account...");

  const uId = params.get("uId");

  useEffect(() => {
    if (!uId) {
      setMsg("Missing uId. Cannot upgrade.");
      return;
    }

    fetch("http://localhost:3000/upgrade-after-payment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMsg(data.message || "Upgraded");

        // After upgrade, send HR to dashboard (change to your route)
        setTimeout(() => {
          navigate("/dashboard/hr");
        }, 1000);
      });
  }, [uId, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Payment Success</h2>
      <p>{msg}</p>
    </div>
  );
}
