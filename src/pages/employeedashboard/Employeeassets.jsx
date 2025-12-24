import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export default function EmployeeAssets() {
  const { user } = useAuth();
  const { companyId } = useParams();
const axiosSecure = useAxiosSecure();
  const [assets, setAssets] = useState([]);

 useEffect(() => {
  if (!companyId) return;

  axiosSecure
    .get(`/assets/${companyId}`)
    .then((res) => {
      const data = res.data;
      setAssets(Array.isArray(data) ? data : []);
    })
    .catch((err) => {
      console.error("load assets failed:", err);
      setAssets([]);
    });
}, [companyId, axiosSecure]);
  function requestAsset(assetId) {
    if (!user?.uid || !user?.email) {
      alert("You must be logged in to request an asset.");
      return;
    }

    axiosSecure
  .post("/requests", {
    employeeUid: user.uid,
    employeeEmail: user.email,
    companyId,
    assetId,
  })
  .then(() => {
    alert("Request sent (pending)");
  })
  .catch((err) => {
    console.error("request asset failed:", err);
    alert(err?.response?.data?.message || "Request failed");
  });

  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Company Assets</h2>

      {assets.length === 0 ? (
        <p className="text-gray-500">No assets available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Asset Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {assets.map((asset) => {
                const outOfStock = asset.quantity === 0;

                return (
                  <tr
                    key={asset._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {asset.name}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-800">
                      {asset.quantity}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          outOfStock
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {outOfStock ? "Out of stock" : "Available"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => requestAsset(asset._id)}
                        disabled={outOfStock}
                        className={`px-4 py-1.5 text-sm rounded-md font-medium text-white transition ${
                          outOfStock
                            ? "bg-gray-300 cursor-not-allowed"
                            : "btn bg-primary"
                        }`}
                      >
                        Request
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
