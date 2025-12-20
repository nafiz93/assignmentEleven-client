import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";

export default function Allrequests() {
  const { user, loading } = useAuth();
  const axios = useAxios();
  // const queryClient = useQueryClient();

  const userId = user?.uid;

  //find the HR---------------------------------------------------------------------------------1
  const getCompanyId = async () => {
    const response = await axios.get(`/users?uid=${userId}`);
    return response.data._id;
  };

  const { data: hrId, isLoading: companyLoading } = useQuery({
    queryKey: ["companyId", userId],
    queryFn: getCompanyId,
    enabled: !!userId,
  });

  const getRequests = async () => {
    const response = await axios.get(`/requests?companyId=${hrId}`);
    return response.data;
  };

  const {
    data: requests = [],
    isLoading: requestsLoading,
    refetch,
  } = useQuery({
    queryKey: ["requests", hrId],
    queryFn: getRequests,
    enabled: !!hrId,
  });

  //end of the code to find the HR--------------------------------------------------------------1
  const approveMutation = useMutation({
    mutationFn: async (requestId) => {
      const response = await axios.patch(`/requests/${requestId}/approve`, {
        userId,
      });
      return response.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleApprove = async (requestId) => {
    console.log("requestId", requestId, "hrId:", userId);
    approveMutation.mutate(requestId);
  };

  const handleReject = async (requestId) => {
    const rejectedDoc = async () => {
      const response = await axios.patch(`/requests/${requestId}/reject`);
      return response.data;
    };
    const data = await rejectedDoc();
    console.log("rejected", data);
  };

  if (loading || companyLoading || requestsLoading) {
    return (
      <div className="min-h-screen bg-[#e9e4e3] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e9e4e3] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-[#ded6d4] rounded-2xl shadow-md p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          All Requests
        </h2>

        <div className="overflow-x-auto rounded-xl border border-gray-300 bg-transparent">
          <table className="min-w-full">
            <thead className="bg-[#d8d0ce]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                  Employee Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-10 text-center text-gray-600"
                  >
                    No requests found
                  </td>
                </tr>
              )}

              {requests.map((item) => (
                <tr
                  key={item._id}
                  className="border-t border-gray-300 hover:bg-[#d8d0ce]/40 transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {item.employeeEmail}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    {item.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(item._id)}
                          className="px-4 py-2 rounded-md bg-black text-white text-sm font-semibold shadow hover:bg-black/90 transition"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(item._id)}
                          className="px-4 py-2 rounded-md border border-gray-800 text-gray-900 text-sm font-semibold hover:bg-black hover:text-white transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
