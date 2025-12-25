import React from "react";

export default function UserInfoCard({ userData }) {
  if (!userData) return null;

  const { name, email, role, subscription, assetLimit, packageLimit } = userData;
  const limit = assetLimit ?? packageLimit;

  return (
    <section className="relative w-full max-w-2xl">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-cyan-400/25 blur-3xl" />

      {/* Glass card */}
      <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-b border-white/15">
          <div>
            <h2 className="text-lg font-semibold">User Profile</h2>
            <p className="text-sm">
              Account info and plan details
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10  border border-white/15">
              {role ? role.toUpperCase() : "UNKNOWN"}
            </span>

            {role === "hr" && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-400/15  border border-emerald-200/20">
                {subscription || "standard"}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassField label="Name" value={name || "N/A"} />
            <GlassField label="Email" value={email || "N/A"} breakAll />

            {role === "hr" && (
              <>
                <GlassField label="Subscription" value={subscription || "N/A"} />
                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-wide ">
                    Limit
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="text-base font-semibold ">
                      {typeof limit === "number" ? limit : "N/A"}
                    </p>
                    <span className="text-xs ">assets</span>
                  </div>

                  {/* optional glass progress */}
                  {typeof limit === "number" && (
                    <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden border border-white/10">
                      <div
                        className="h-full rounded-full bg-black/40"
                        style={{ width: "35%" }}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function GlassField({ label, value, breakAll = false }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 p-4">
      <p className="text-xs uppercase tracking-wide ">{label}</p>
      <p
        className={`mt-1 text-base font-semibold ${
          breakAll ? "break-all" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
