import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAxios from "@/hooks/useAxios";
import useAuth from "@/hooks/useAuth";

export default function Login() {
  const { signin } = useAuth();
  const axios = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // 1️⃣ Firebase login
    const cred = await signin(data.email, data.password);
    const user = cred.user;

    // 2️⃣ Get role using UID
    const res = await axios.get("/users/me", {
      params: { uid: user.uid },
    });

    const me = res.data;

    // 3️⃣ Redirect by role
    if (me.role === "hr") {
      navigate("/dashboard/hr");
    } else {
      navigate("/dashboard/employee");
    }
  };

  return (
    <div className="min-h-[calc(100vh-0rem)] flex items-center justify-center px-4 py-10 ">
      <div className="relative w-full max-w-sm">
        {/* glow */}
        <div className="absolute -inset-1 rounded-3xl" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-7"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-1 text-sm">
              Sign in to continue to your dashboard.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <div className="rounded-2xl border border-white/10 bg-white/5 focus-within:border-white/20 focus-within:bg-white/10 transition">
              <input
                {...register("email", { required: true })}
                placeholder="name@company.com"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-500 rounded-xl"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-300">Email required</p>
            )}
          </div>

          {/* Password */}
          <div className="mt-4 space-y-1.5">
            <label className="text-sm font-medium">
              Password
            </label>
            <div className="rounded-2xl border border-white/10 bg-white/5 focus-within:border-white/20 focus-within:bg-white/10 transition">
              <input
                type="password"
                {...register("password", { required: true })}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-transparent px-4 py-3 border border-gray-500 rounded-xl "
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-300">Password required</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-2xl bg-black text-white py-3 font-semibold tracking-wide shadow-lg shadow-black/30 hover:bg-black/90 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="mt-5 text-center text-xs">
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}
