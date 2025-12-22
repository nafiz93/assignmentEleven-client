import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Payment Cancelled</h2>
      <p>No changes were made.</p>
      <Link to="/dashboard/hr/upgrade">Go back to Upgrade</Link>
    </div>
  );
}
