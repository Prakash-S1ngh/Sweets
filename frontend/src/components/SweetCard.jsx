import React, { useContext, useState } from "react";
import SweetContext from "../Context/SweetContext";
import axios from "axios";
import url from "../Api";

const SweetCard = ({ sweet }) => {
  const { isAdmin, addToCart, showToast } = useContext(SweetContext);

  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // ============================================
  // 🔥 ADMIN Sweet format vs USER (Grouped) Format
  // ============================================

  const isGrouped = !!sweet.items; // user mode

  const baseSweet = isGrouped ? sweet.items[0] : sweet;

  // 🔥 aggregated quantity > individual quantity
  const stock = sweet.totalQuantity ?? baseSweet.quantity ?? 0;

  const sweetId = baseSweet._id;
  const sweetName = sweet._id || baseSweet.name;

  const img = sweet.imageUrl || baseSweet.imageUrl || "";
  const price = sweet.price ?? baseSweet.price ?? 0;
  const desc = sweet.description || baseSweet.description || "";
  const category = sweet.category || baseSweet.category || "";

  // ============================================
  // ADD TO CART
  // ============================================
  const handleAddToCart = async () => {
    if (adding || stock <= 0) return;
    setAdding(true);

    try {
      await addToCart({ name: sweetName, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setAdding(false);
    }
  };

  // ============================================
  // ADMIN: UPDATE SWEET
  // ============================================
  const [editData, setEditData] = useState({
    name: baseSweet.name,
    price,
    category,
    description: desc,
    imageUrl: img,
    quantity: stock,
  });

  const handleUpdateSweet = async () => {
    try {
      await axios.put(`${url}/api/sweets/${sweetId}`, editData, {
        withCredentials: true,
      });
      showToast("Sweet updated", "success");
      setShowEdit(false);
      window.location.reload();
    } catch (err) {
      console.error("Update error:", err);
      showToast("Update failed", "error");
    }
  };

  // ============================================
  // ADMIN: DELETE SWEET
  // ============================================
  const handleDeleteSweet = async () => {
    if (!confirm(`Delete sweet: ${sweetName}?`)) return;

    try {
      setDeleting(true);
      await axios.delete(`${url}/api/sweets/${sweetId}`, {
        withCredentials: true,
      });

      showToast("Sweet deleted", "success");
      window.location.reload();
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ============================================
  // EDIT MODAL
  // ============================================
  const EditModal = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Sweet</h2>

        <div className="space-y-3">
          {Object.keys(editData).map((key) => (
            <input
              key={key}
              type={["price", "quantity"].includes(key) ? "number" : "text"}
              className="w-full p-2 border rounded-lg"
              placeholder={key}
              value={editData[key]}
              onChange={(e) =>
                setEditData({ ...editData, [key]: e.target.value })
              }
            />
          ))}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={() => setShowEdit(false)}
            className="flex-1 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateSweet}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================
  // CARD RENDER
  // ============================================
  return (
    <>
      {showEdit && <EditModal />}

      <article className="p-4 rounded-xl bg-white shadow-sm flex flex-col">

        {/* IMAGE */}
        {img ? (
          <img
            src={img}
            alt={sweetName}
            className="w-full h-40 object-cover rounded-xl mb-3"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center">
            No Image
          </div>
        )}

        {/* NAME */}
        <h3 className="text-lg font-semibold">{sweetName}</h3>
        <p className="text-sm text-gray-600">{category}</p>

        {/* DESCRIPTION */}
        <p className="text-sm mt-2">
          {expanded
            ? desc
            : desc.slice(0, 120) + (desc.length > 120 ? "…" : "")}

          {desc.length > 120 && (
            <button
              className="ml-2 text-blue-600 underline text-xs"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>

        {/* PRICE + STOCK */}
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-lg">₹{price}</span>
          <span
            className={`text-sm ${
              stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {stock} in stock
          </span>
        </div>

        {/* BUTTONS */}
        <div className="mt-4 flex flex-col gap-2">

          <button
            onClick={handleAddToCart}
            disabled={adding || stock <= 0}
            className={`w-full px-4 py-2 rounded-lg text-white ${
              stock <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-600 hover:bg-pink-700"
            }`}
          >
            {adding ? "Adding..." : added ? "Added!" : "Add to cart"}
          </button>

          {isAdmin && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setShowEdit(true)}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={handleDeleteSweet}
                disabled={deleting}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default SweetCard;