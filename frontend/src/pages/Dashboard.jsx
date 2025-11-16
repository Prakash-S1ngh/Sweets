import { useContext, useEffect, useState } from "react";
import SweetContext from "../Context/SweetContext";
import SweetCard from "../components/SweetCard";
import Spinner from "../components/Spinner";
import AddSweets from "../pages/AddSweets";
import Modal from "../components/Modal";

export default function Dashboard() {
  const {
    user,
    sweets,
    filteredSweets,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    isAdmin,
    loggedIn,
    sweetsLoading,
  } = useContext(SweetContext);

  const [q, setQ] = useState(searchTerm || "");
  const [showAddModal, setShowAddModal] = useState(false);

  // sync initial searchTerm into local input
  useEffect(() => {
    setQ(searchTerm || "");
  }, [searchTerm]);

  // debounce updating context searchTerm
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(q), 300);
    return () => clearTimeout(t);
  }, [q, setSearchTerm]);

  if (!loggedIn) {
    return (
      <div className="container py-10">
        <div className="card max-w-md mx-auto text-center p-6">
          <h2 className="text-xl font-bold">Please Login First</h2>
          <p className="muted">Access to dashboard requires authentication.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">

      {/* === USER HEADER === */}
      <div className="card mb-6 p-6 backdrop-blur-md bg-white/40 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold">Welcome, {user?.email} 👋</h2>
        <p className="muted mt-1">
          Manage sweets, purchase items, and enjoy a smooth dashboard experience.
        </p>

        <div className="flex gap-4 mt-6">

          {/* Sweet Count */}
          <div className="p-3 rounded-lg bg-pink-100 shadow text-center flex-1">
            <h3 className="text-lg font-bold">{sweets.length}</h3>
            <p className="text-sm opacity-70">Total Sweets</p>
          </div>

          {/* Admin Badge */}
          <div className="p-3 rounded-lg bg-yellow-100 shadow text-center flex-1">
            <h3 className="text-lg font-bold">{isAdmin ? "YES" : "NO"}</h3>
            <p className="text-sm opacity-70">Admin Access</p>
          </div>

        </div>
      </div>

      {/* === SWEETS GRID === */}
      <div className="card p-6 rounded-xl bg-white/40 backdrop-blur-md shadow-lg">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">🍬 Available Sweets</h2>
          <div className="flex gap-2 items-center">
            

            {/* Admin + button to open AddSweets modal */}
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="ml-4 px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                title="Add New Sweet"
              >
                + Add Sweet
              </button>
            )}
          </div>
        </div>

        {sweetsLoading ? (
          <div className="py-16 flex justify-center">
            <Spinner size={36} />
          </div>
        ) : ( (filteredSweets || []).length === 0 ? (
          <p className="text-center muted">No sweets match your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSweets.map((sweet) => (
              <SweetCard key={sweet._id} sweet={sweet} />
            ))}
          </div>
        ))}

        {/* ADMIN: modal for adding sweets */}
        {showAddModal && (
          <Modal title="Add New Sweet" onClose={() => setShowAddModal(false)}>
            <AddSweets onSuccess={() => {
              setShowAddModal(false);
              // trigger refresh by updating search or calling fetchSweets via event
              window.dispatchEvent(new CustomEvent('sweets:refresh'));
            }} />
          </Modal>
        )}
      </div>

    </div>
  );
}