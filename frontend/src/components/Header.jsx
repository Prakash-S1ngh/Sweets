import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SweetContext from "../Context/SweetContext";

export default function Header() {
  const { isAdmin, logoutUser, cart, selectedCategory, setSelectedCategory, categories } = useContext(SweetContext);
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between py-4">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <div
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Sweet Shop
          </div>
          <div className="muted">Classic Selection</div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <input
            placeholder="Search sweets..."
            className="p-2 border rounded-md"
            onChange={(e) => {
              /* keep small header search - update global searchTerm if available */
              const v = e.target.value;
              // naive approach: set in localStorage so main input will pick it up
              localStorage.setItem("headerSearch", v);
              // also dispatch CustomEvent for other components to pick up
              window.dispatchEvent(new CustomEvent("header:search", { detail: v }));
            }}
          />

          {/* CATEGORY (compact) */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-1 rounded border ml-2"
          >
            {(categories || []).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* NAVIGATION */}
          <nav className="space-x-4 text-sm">
            {isAdmin && (
              <Link to="/admin" className="muted hover:text-black">
                Admin
              </Link>
            )}
          </nav>

          {/* CART */}
          <button
            onClick={() => navigate("/cart")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
          >
            🛒 Cart ({cart?.items?.length || 0})
          </button>

          {/* LOGOUT */}
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