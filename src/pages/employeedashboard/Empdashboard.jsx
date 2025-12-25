import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import UserInfoCard from "@/components/UserInfoCard/UserInfoCard"; // adjust path

export default function Empdashboard() {
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

   const getRequests = async () => {
      const res = await axiosSecure.get(`/requests/myasset?empid=${userId}`);
      return res.data;
    };
  
    const { data: requests = [], isLoading: requestsLoading } = useQuery({
      queryKey: ["requests", userId],
      queryFn: getRequests,
      enabled: !!userId,
    });

    console.log(requests);

    const myassets=requests.filter(request=>request.status==='approved')

  if (loading || companyLoading || requestsLoading) {
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
        <h2 className="text-2xl font-semibold text-primary ml-10">Employee Dashboard</h2>
        <p className="text-sm text-primary ml-10">
          Overview of your account
        </p>
      </div>

      {/* Glass User Info Card */}
      <UserInfoCard userData={hrId} />

      {/* Optional: quick stats (placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 text-primary shadow-[0_10px_30px_rgba(0,0,0,0.20)]">
          <p className="text-sm text-primary">My Requests</p>
          <p className="mt-2 text-3xl font-semibold">
            {requests.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 text-primary shadow-[0_10px_30px_rgba(0,0,0,0.20)]">
          <p className="text-sm text-primary">My Assets</p>
          <p className="mt-2 text-3xl font-semibold">
            {myassets.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.20)]">
          <p className="text-sm text-primary">Status</p>
          <p className="mt-2 text-3xl text-primary font-semibold">
            Active
          </p>
        </div>
      </div>
    </section>
  );
}
