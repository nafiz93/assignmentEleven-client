import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Myrequest() {
  const { user, loading } = useAuth();
  const axios = useAxios();
  

  const userId = user?.uid;

  const getRequests = async () => {
    const res = await axios.get(`/requests/myasset?empid=${userId}`);
    return res.data;
  };

  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["requests", userId],
    queryFn: getRequests,
    enabled: !!userId,
  });

  
 
 

  if (loading || requestsLoading) {
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
              
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-10 text-center text-gray-600"
                  >
                    No Assets found
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

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
