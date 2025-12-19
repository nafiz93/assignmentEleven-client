import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myCompanyId, setMyCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  // STEP 1: check if employee already affiliated (old employee)
  useEffect(() => {
    if (!user?.uid) return;

    fetch(`http://localhost:3000/employee-company?employeeUid=${user.uid}`)
      .then(async (res) => {
        if (res.status === 404) return null; // first time employee
        return res.json();
      })
      .then((data) => {
        if (data?.companyId) {
          setMyCompanyId(data.companyId);
          navigate(`/dashboard/employee/assets/${data.companyId}`);
        }
      })
      .catch((err) => {
        console.error("employee-company check failed:", err);
      });
  }, [user?.uid, navigate]);

  // STEP 2: if first time -> load companies list for dropdown
  useEffect(() => {
    if (!user?.uid) return;
    if (myCompanyId) return;

    fetch("http://localhost:3000/companies/list")
      .then((res) => res.json())
      .then((data) => setCompanies(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("companies list failed:", err);
      });
  }, [user?.uid, myCompanyId]);

  // STEP 3: Continue -> save affiliation then go to assets
  async function handleContinue(e) {
    e.preventDefault();

    if (!selectedCompanyId) {
      alert("Please select a company");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/employee-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeUid: user.uid,
          companyId: selectedCompanyId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Failed to save company");
        return;
      }

      navigate(`/dashboard/employee/assets/${selectedCompanyId}`);
    } catch (err) {
      console.error("save employee-company failed:", err);
      alert("Network error while saving company");
    }
  }

  if (!user) return <p className="p-6 text-sm text-gray-700">Please login.</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">First Time Login</h2>
          <p className="mt-1 text-sm text-gray-600">
            Select a company to view assets
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-800"
              >
                Company
              </label>

              <div className="mt-2">
                <select
                  id="company"
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  required
                  className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="">-- Select Company --</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                You will be redirected to your company assets after continuing.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            >
              Continue
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
          If you don’t see your company, contact your administrator.
        </div>
      </div>
    </div>
  );
}
