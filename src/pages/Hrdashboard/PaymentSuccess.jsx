import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Payment successful. Upgrading...");

  const uId = params.get("uId");
  const plan = params.get("plan");
  
const axiosSecure = useAxios();

 useEffect(() => {
  if (!uId || !plan) {
    setMsg("Missing uId or plan. Cannot upgrade.");
    return;
  }

  axiosSecure
    .patch("/upgrade-after-payment", { uId, plan })
    .then((res) => {
      setMsg(res.data?.message || "Upgraded");
      setTimeout(() => navigate("/dashboard/hr"), 1000);
    })
    .catch((err) => {
      console.error("upgrade failed:", err);
      setMsg("Upgrade failed. Please try again.");
    });
}, [uId, plan, axiosSecure, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Payment Success</h2>
      <p>{msg}</p>
    </div>
  );
}
