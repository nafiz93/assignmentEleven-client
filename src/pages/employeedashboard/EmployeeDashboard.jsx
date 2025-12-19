import useAuth from "@/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myCompanyId, setMyCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [loadingAffiliation, setLoadingAffiliation] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Optional: keep dropdown stable/readable
  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) =>
      String(a.companyName || "").localeCompare(String(b.companyName || ""))
    );
  }, [companies]);

  // STEP 1: check if employee already affiliated (old employee)
  useEffect(() => {
    if (!user?.uid) return;

    let cancelled = false;
    setLoadingAffiliation(true);
    setError("");

    fetch(`http://localhost:3000/employee-company?employeeUid=${user.uid}`)
      .then(async (res) => {
        if (res.status === 404) return null; // first time employee
        if (!res.ok) throw new Error("Failed to check employee affiliation");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        if (data?.companyId) {
          setMyCompanyId(data.companyId);
          navigate(`/dashboard/employee/assets/${data.companyId}`);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("employee-company check failed:", err);
        setError("Could not verify your company affiliation. Please try again.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingAffiliation(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.uid, navigate]);

  // STEP 2: if first time -> load companies list for dropdown
  useEffect(() => {
    if (!user?.uid) return;
    if (myCompanyId) return;

    let cancelled = false;
    setLoadingCompanies(true);
    setError("");

    fetch("http://localhost:3000/companies/list")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load companies");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setCompanies(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("companies list failed:", err);
        setError("Could not load companies list. Please refresh the page.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingCompanies(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.uid, myCompanyId]);

  // STEP 3: Continue -> save affiliation then go to assets
  async function handleContinue(e) {
    e.preventDefault();
    setError("");

    if (!selectedCompanyId) {
      setError("Please select a company to continue.");
      return;
    }

    try {
      setSaving(true);

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
        setError(data?.message || "Failed to save company. Please try again.");
        return;
      }

      navigate(`/dashboard/employee/assets/${selectedCompanyId}`);
    } catch (err) {
      console.error("save employee-company failed:", err);
      setError("Network error while saving company. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-6">
        <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Please login</h2>
          <p className="mt-1 text-sm text-gray-600">
            You need to be authenticated to access the employee dashboard.
          </p>
        </div>
      </div>
    );
  }

  const showForm = !loadingAffiliation && !myCompanyId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border bg-white shadow-sm">
          {/* Header */}
          <div className="border-b px-6 py-6 sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                  Employee Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  {showForm
                    ? "First time login — select your company to view assets."
                    : "Checking your company affiliation…"}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700">
                UID: <span className="font-mono">{user.uid}</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 sm:px-8">
            {/* Loading state */}
            {loadingAffiliation && (
              <div className="flex items-center gap-3 rounded-2xl border bg-gray-50 p-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                <div className="text-sm text-gray-700">
                  Verifying your company…
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Form (first-time only) */}
            {showForm && (
              <form onSubmit={handleContinue} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Company
                  </label>

                  <div className="mt-2">
                    <select
                      id="company"
                      value={selectedCompanyId}
                      onChange={(e) => setSelectedCompanyId(e.target.value)}
                      disabled={loadingCompanies || saving}
                      required
                      className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                      <option value="">-- Select Company --</option>
                      {sortedCompanies.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.companyName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    This selection links your employee account to a company and
                    will be used to load assets.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    {loadingCompanies
                      ? "Loading companies…"
                      : `${sortedCompanies.length} companies available`}
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedCompanyId || saving || loadingCompanies}
                    className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Continue"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-5 text-xs text-gray-500 sm:px-8">
            If your company is missing from the list, contact your administrator.
          </div>
        </div>
      </div>
    </div>
  );
}
