import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";

export default function Upgrade() {
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);

  const axiosSecure = useAxios();

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
  }, [user,axiosSecure]);

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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Upgrade Plans
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Pick a plan that fits your team size. You can upgrade anytime.
        </p>
      </div>

      {plans.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-600">Loading plans...</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {plans.map((p) => {
          // ✅ Frontend UX block: prevent paying for same plan
          const alreadyOnThisPlan = user.subscription === p.plan;

          return (
            <div
              key={p.plan}
              className={[
                "relative overflow-hidden rounded-2xl border bg-primary p-6 shadow-sm transition",
                alreadyOnThisPlan
                  ? "border-gray-200 opacity-75"
                  : "border-gray-200 hover:shadow-md",
              ].join(" ")}
            >
              {/* Accent */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900" />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Plan
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {p.plan}
                  </h3>
                </div>

                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Price
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    ${(p.priceCents / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">
                    Employee Limit:
                  </span>{" "}
                  {p.limit}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Best for teams up to {p.limit} employees.
                </p>
              </div>

              <button
                onClick={() => handleUpgrade(p.plan)}
                disabled={alreadyOnThisPlan}
                className={[
                  "mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
                  alreadyOnThisPlan
                    ? "cursor-not-allowed bg-gray-100 text-gray-500"
                    : "bg-gray-900 text-white hover:bg-gray-800",
                ].join(" ")}
              >
                {alreadyOnThisPlan ? "Current Plan" : `Upgrade to ${p.plan}`}
              </button>

              {alreadyOnThisPlan && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  You’re currently on this plan.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
