import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";

export default function Addasset() {
  const axios = useAxios();
  const { user } = useAuth();
  const hruid = user?.uid;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const imageFile = data.image?.[0];
      if (!imageFile) throw new Error("Image is required");

      const formData = new FormData();
      formData.append("image", imageFile);

      const imageApiUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_host_key
      }`;

      const imgRes = await fetch(imageApiUrl, {
        method: "POST",
        body: formData,
      });
      const imgJson = await imgRes.json();

      const imageUrl = imgJson?.data?.url;
      if (!imageUrl) throw new Error("Image upload failed");

      const payload = {
        name: data.name,
        type: data.type,
        quantity: data.quantity,
        image: imageUrl,
        hruid,
      };

      const res = await axios.post("/assets", payload);
      return res.data;
    },

    onSuccess: () => {
      reset();
    },
  });

  /* =========================
     UPDATED HERE (LIMIT CHECK)
  ========================== */
  const handleAddAsset = (data) => {
    if (data.quantity > 1) {
      alert("Quantity cannot be more than 15");
      return; // ⛔ stop, backend not called
    }

    mutation.mutate(data);
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl my-10 mx-auto">
      <div className="card-body">
        <form onSubmit={handleSubmit(handleAddAsset)}>
          <fieldset className="fieldset">
            <label className="label">Name</label>
            <input
              type="text"
              className="input"
              {...register("name", { required: true })}
              placeholder="Name"
            />
            {errors.name && (
              <p className="text-red-600">name is required</p>
            )}

            <label className="label">Type</label>
            <input
              type="text"
              className="input"
              {...register("type", { required: true })}
              placeholder="type"
            />
            {errors.type && (
              <p className="text-red-600">type is required</p>
            )}

            <label className="label">Quantity</label>
            <input
              type="number"
              className="input"
              {...register("quantity", {
                required: true,
                valueAsNumber: true,
                min: 1,
              })}
              placeholder="quantity"
            />
            {errors.quantity && (
              <p className="text-red-600">quantity is required</p>
            )}

            <label className="label">Image</label>
            <input
              type="file"
              className="file-input"
              accept="image/*"
              {...register("image", { required: true })}
            />
            {errors.image && (
              <p className="text-red-600">image is required</p>
            )}

            <button
              className="btn btn-neutral mt-4"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Adding..." : "Add Asset"}
            </button>

            {mutation.isError && (
              <p className="text-red-600 mt-2">
                {mutation.error?.message || "Something went wrong"}
              </p>
            )}

            {mutation.isSuccess && (
              <p className="text-green-600 mt-2">
                Asset added successfully
              </p>
            )}
          </fieldset>
        </form>
      </div>
    </div>
  );
}
