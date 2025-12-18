import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import useAuth from "@/hooks/useAuth";

export default function Register() {
  const { role } = useParams(); // "hr" or "employee"
  const {registerUser}=useAuth();
const axios=useAxios();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Upload company logo to ImgBB (kept same behavior)
      const imageFile = data.companyLogo?.[0];
      if (!imageFile) throw new Error("Company logo is required");

      const formData = new FormData();
      formData.append("image", imageFile);

      const imageApiUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
      const imgRes = await fetch(imageApiUrl, { method: "POST", body: formData });
      const imgJson = await imgRes.json();

      const companyLogoUrl = imgJson?.data?.url;
      if (!companyLogoUrl) throw new Error("Image upload failed");

      // ✅ ONLY CHANGE: role is now dynamic (sent from route param)
      const payload = {
        name: data.name,
        companyName: data.companyName,
        companyLogo: companyLogoUrl,
        email: data.email,
        password: data.password,
        dateOfBirth: data.dateOfBirth,

        // Auto-assigned:
        role: role, // ✅ dynamic now
        packageLimit: 5,
        currentEmployees: 0,
        subscription: "basic",
      };

      const res = await axios.post("/users/register", payload);
      return res.data;
    },
  });

  const handleRegistration = async (data) => {
  console.log(data.name, data.email);

  await registerUser(data.email, data.password);  // ✅ correct order
  mutation.mutate(data);
};


  return (
    <div className="card bg-base-100 w-full max-w-sm shadow-2xl my-10 mx-auto">
      <div className="card-body">
        <form onSubmit={handleSubmit(handleRegistration)}>
          <fieldset className="fieldset">
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input"
              {...register("name", { required: true })}
              placeholder="Full Name"
            />
            {errors.name && <p className="text-red-600">name is required</p>}

            <label className="label">Company Name</label>
            <input
              type="text"
              className="input"
              {...register("companyName", { required: true })}
              placeholder="Company Name"
            />
            {errors.companyName && (
              <p className="text-red-600">company name is required</p>
            )}

            <label className="label">Company Logo</label>
            <input
              type="file"
              className="file-input"
              accept="image/*"
              {...register("companyLogo", { required: true })}
            />
            {errors.companyLogo && (
              <p className="text-red-600">company logo is required</p>
            )}

            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              {...register("email", { required: true })}
              placeholder="email@company.com"
            />
            {errors.email && <p className="text-red-600">email is required</p>}

            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              {...register("password", { required: true, minLength: 6 })}
              placeholder="min 6 characters"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-600">password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-600">
                password must be at least 6 characters
              </p>
            )}

            <label className="label">Date of Birth</label>
            <input
              type="date"
              className="input"
              {...register("dateOfBirth", { required: true })}
              placeholder="YYYY-MM-DD"
            />
            {errors.dateOfBirth && (
              <p className="text-red-600">date of birth is required</p>
            )}

            <button
              type="submit"
              className="btn btn-neutral mt-4"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Registering..." : `Join as ${role?.toUpperCase()}`}
            </button>

            {mutation.isError && (
              <p className="text-red-600 mt-2">
                {mutation.error?.message || "Something went wrong"}
              </p>
            )}

            {mutation.isSuccess && (
              <p className="text-green-600 mt-2">
                User registered successfully
              </p>
            )}
          </fieldset>
        </form>
      </div>
    </div>
  );
}
