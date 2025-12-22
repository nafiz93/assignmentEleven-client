import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export default function Assetlist() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // edit states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    quantity: 1,
    image: "",
  });

  const fetchAssets = async () => {
    try {
      const res = await axiosSecure.get(`/assets?uid=${user.uid}`);
      setAssets(res.data);
    } catch (error) {
      console.error("Failed to load assets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.uid) return;
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const handleDelete = async (id) => {
    const ok = confirm("Are you sure you want to delete this asset?");
    if (!ok) return;

    try {
      await axiosSecure.delete(`/assets/${id}?uid=${user.uid}`);
      setAssets((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const handleStartEdit = (asset) => {
    setEditingId(asset._id);
    setEditForm({
      name: asset.name || "",
      type: asset.type || "",
      quantity: asset.quantity ?? 1,
      image: asset.image || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", type: "", quantity: 1, image: "" });
  };

  const handleUpdate = async () => {
    if (!editForm.name || !editForm.type) {
      alert("Name and Type are required");
      return;
    }

    const qty = Number(editForm.quantity);
    if (!qty || qty < 1) {
      alert("Quantity must be at least 1");
      return;
    }
    if (qty > 15) {
      alert("Quantity cannot be more than 15");
      return;
    }

    try {
      await axios.patch(`/assets/${editingId}?uid=${user.uid}`, {
        name: editForm.name,
        type: editForm.type,
        quantity: qty,
        image: editForm.image,
      });

      setAssets((prev) =>
        prev.map((a) =>
          a._id === editingId
            ? { ...a, ...editForm, quantity: qty }
            : a
        )
      );

      handleCancelEdit();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="text-center py-6">Loading assets...</p>;
  if (assets.length === 0) return <p className="text-center py-6">No assets found</p>;

  return (
    <div className="bg-base-100 shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Asset List</h2>

      {/* SIMPLE EDIT FORM */}
      {editingId && (
        <div className="mb-6 p-4 border rounded-lg bg-base-200">
          <h3 className="font-semibold mb-3">Edit Asset</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="label">Name</label>
              <input
                className="input input-bordered w-full"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Type</label>
              <input
                className="input input-bordered w-full"
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Quantity (max 15)</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={editForm.quantity}
                onChange={(e) =>
                  setEditForm({ ...editForm, quantity: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">Image URL</label>
              <input
                className="input input-bordered w-full"
                value={editForm.image}
                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="btn btn-neutral" onClick={handleUpdate}>
              Update
            </button>
            <button className="btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Asset Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset, index) => (
              <tr key={asset._id} className="hover">
                <td>{index + 1}</td>

                <td>
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="w-14 h-14 object-cover rounded-lg border"
                  />
                </td>

                <td className="font-semibold">{asset.name}</td>
                <td className="capitalize">{asset.type}</td>

                <td>
                  <span className="badge badge-outline">{asset.quantity}</span>
                </td>

                <td className="text-sm text-gray-500">
                  {new Date(asset.createdAt).toLocaleDateString()}
                </td>

                <td className="flex gap-2">
                  <button
                    className="btn btn-neutral"
                    onClick={() => handleStartEdit(asset)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-neutral"
                    onClick={() => handleDelete(asset._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
