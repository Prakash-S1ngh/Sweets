import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SweetContext from "../Context/SweetContext";

export default function Header() {
  const { isAdmin, logoutUser, cart, selectedCategory, setSelectedCategory, categories, loggedIn } =
    useContext(SweetContext);
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between py-4">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4 pl-6"> {/* 👈 Added padding to shift logo right */}
          <div
            className="text-2xl font-bold cursor-pointer tracking-wide"
            onClick={() => navigate("/dashboard")}
          >
            Sweet Shop
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">

          {/* SEARCH */}
          <input
            placeholder="Search sweets..."
            className="p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
            onChange={(e) => {
              const v = e.target.value;
              localStorage.setItem("headerSearch", v);
              window.dispatchEvent(new CustomEvent("header:search", { detail: v }));
            }}
          />

          {/* CATEGORY DROPDOWN */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-md border shadow-sm bg-white"
          >
            {(categories || []).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* NAVIGATION LINKS */}
          <nav className="space-x-4 text-sm">
            {isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-black font-medium">
                Admin
              </Link>
            )}
            {loggedIn && (
              <Link to="/orders" className="text-gray-600 hover:text-black font-medium">
                Orders
              </Link>
            )}
          </nav>

          {/* CART BUTTON */}
          <button
            onClick={() => navigate("/cart")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          >
            🛒 Cart ({cart?.items?.length || 0})
          </button>

          {/* LOGOUT BUTTON */}
          <button
            onClick={() => {
              logoutUser();
              navigate("/");
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}