import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import UserInfoCard from "@/components/UserInfoCard/UserInfoCard"; // adjust path

export default function HrDashboardHome() {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const userId = user?.uid;

  const getCompanyId = async () => {
    const response = await axiosSecure.get(`/users?uid=${userId}`);
    return response.data; // user object
  };

  const { data: hrId, isLoading: companyLoading } = useQuery({
    queryKey: ["companyId", userId],
    queryFn: getCompanyId,
    enabled: !!userId,
  });

  if (loading || companyLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl px-6 py-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-primary">HR Dashboard</h2>
        <p className="text-sm text-primary">
          Overview of your account and plan
        </p>
      </div>

      {/* Glass User Info Card */}
      <UserInfoCard userData={hrId} />

      {/* Optional: quick stats (placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 text-primary shadow-[0_10px_30px_rgba(0,0,0,0.20)]">
          <p className="text-sm text-primary">Current Employees</p>
          <p className="mt-2 text-3xl font-semibold">
            {hrId?.currentEmployees ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 text-primary shadow-[0_10px_30px_rgba(0,0,0,0.20)]">
          <p className="text-sm text-primary">Plan</p>
          <p className="mt-2 text-3xl font-semibold">
            {hrId?.subscription ?? "N/A"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 text-primary shadow-[0_10px_30px_rgba(0,0,0,0.20)]">
          <p className="text-sm text-primary">Asset Limit</p>
          <p className="mt-2 text-3xl font-semibold text-primary">
            {hrId?.assetLimit ?? hrId?.packageLimit ?? "N/A"}
          </p>
        </div>
      </div>
    </section>
  );
}
