import React, { useState } from "react";
import axios from "axios";

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const categories = [
  "Chocolate",
  "Cakes",
  "Candy",
  "Cookies",
  "Cupcakes",
  "Ice Cream",
  "Indian Sweets"
];

const AddSweets = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) return setError("Name is required.");
    if (!category) return setError("Category is required.");
    if (!price || Number.isNaN(Number(price)))
      return setError("Valid price is required.");
    if (imageUrl && !isValidUrl(imageUrl))
      return setError("Image URL is not valid.");

    const payload = {
      name: name.trim(),
      category,
      price: Number(price),
      imageUrl: imageUrl.trim(),
      description: description.trim(),
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/api/sweets",
        payload,
        { withCredentials: true }
      );

      if (res.status !== 201 && res.status !== 200) {
        throw new Error("Failed to add sweet.");
      }

      setSuccess("Sweet added successfully!");

      // Reset fields
      setName("");
      setCategory("");
      setPrice("");
      setImageUrl("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 12 }}>
      <h2 className="text-xl font-bold mb-4">Add Sweet</h2>

      <form onSubmit={handleSubmit}>
        
        {/* NAME */}
        <div className="mb-4">
          <label>Name</label>
          <input
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* CATEGORY */}
        <div className="mb-4">
          <label>Category</label>
          <select
            className="w-full border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* PRICE */}
        <div className="mb-4">
          <label>Price</label>
          <input
            className="w-full border p-2 rounded"
            value={price}
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* IMAGE URL */}
        <div className="mb-4">
          <label>Image URL</label>
          <input
            className="w-full border p-2 rounded"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {/* IMAGE PREVIEW */}
        {imageUrl && isValidUrl(imageUrl) && (
          <div className="mb-4">
            <img
              src={imageUrl}
              alt="preview"
              className="w-full h-48 object-cover rounded border"
            />
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label>Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* SUBMIT */}
        <button className="bg-pink-500 text-white px-4 py-2 rounded">
          Add Sweet
        </button>

        {/* STATUS MESSAGES */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default AddSweets;