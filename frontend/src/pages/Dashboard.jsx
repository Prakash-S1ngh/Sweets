import { useContext } from "react";
import SweetContext from "../Context/SweetContext";
import SweetCard from "../components/SweetCard";
import AddSweets from "../pages/AddSweets";

export default function Dashboard() {
  const { user, sweets, isAdmin, loggedIn } = useContext(SweetContext);

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

        <h2 className="text-xl font-bold mb-4">🍬 Available Sweets</h2>

        {sweets.length === 0 ? (
          <p className="text-center muted">No sweets available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sweets.map((sweet) => (
              <SweetCard key={sweet._id} sweet={sweet} />
            ))}
          </div>
        )}

        {/* ADMIN CAN ADD SWEETS */}
        {isAdmin && (
          <div className="mt-8">
            <AddSweets />
          </div>
        )}
      </div>

    </div>
  );
}