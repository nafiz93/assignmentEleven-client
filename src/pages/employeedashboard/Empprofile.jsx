import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";

export default function Empprofile() {
  const { user, loading } = useAuth();
  const axios = useAxios();

  const userId = user?.uid;

  const [form, setForm] = useState({
    name: "",
    email: "",
    companyLogo: "",
  });

  // Fetch logged-in HR data
  const getUser = async () => {
    const res = await axios.get(`/users?uid=${userId}`);
    return res.data;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user", userId],
    queryFn: getUser,
    enabled: !!userId,
  });

  // Fill form after data loads
  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        email: data.email || "",
        companyLogo: data.companyLogo || "",
      });
    }
  }, [data]);

  // SIMPLE handleChange
  const handleChange = (e) => {
    const field = e.target.name;  //get the name of the input like name="name" or name="email" 
    const value = e.target.value;  //get the value of this input  like akram or akram@gmail.com

    const newForm = { ...form };
    newForm[field] = value;

    setForm(newForm);
  };

  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.patch(`/users?uid=${userId}`, form);
    refetch();
    alert("Profile updated");
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h2 className="text-xl font-semibold text-center text-gray-800">
          HR Profile
        </h2>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Company Logo URL
          </label>
          <input
            name="companyLogo"
            value={form.companyLogo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="https://..."
          />
        </div>

        {/* Logo Preview */}
        {form.companyLogo && (
          <div className="flex justify-center">
            <img
              src={form.companyLogo}
              alt="Company Logo"
              className="w-24 h-24 object-contain border rounded"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-black/90 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
