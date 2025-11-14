import { useContext, useState } from "react";
import "./index.css";
import Layout from "./components/Layout";
import SweetCard from "./components/SweetCard";
import SweetContext from "./Context/SweetContext";
import AddSweets from "./pages/AddSweets";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Route, Routes } from "react-router-dom";

function App() {
  const { sweets, loggedIn, isAdmin } = useContext(SweetContext);

  // Control Login/Register page
  const [authView, setAuthView] = useState("login"); // "login" OR "register"

  const handleBuy = (sweet) => {
    alert(`Buy ${sweet.name} — not wired yet`);
  };

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {/* Show Login/Register ONLY when NOT logged in */}
      {!loggedIn && (
        <div className="max-w-md mx-auto mb-8">

          {/* Toggle buttons */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setAuthView("login")}
              className={`px-4 py-2 rounded ${
                authView === "login" ? "bg-pink-500 text-white" : "bg-gray-200"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setAuthView("register")}
              className={`px-4 py-2 rounded ${
                authView === "register" ? "bg-pink-500 text-white" : "bg-gray-200"
              }`}
            >
              Register
            </button>
          </div>

          {/* Render only ONE */}
          {authView === "login" ? <Login /> : <Register />}
        </div>
      )}

      {/* If logged in → show sweets */}
      {loggedIn && (
        <div className="card p-4 rounded-xl bg-white/40 backdrop-blur-md shadow-lg">
          <h2 className="text-xl font-bold mb-3 text-center">🍬 Available Sweets</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sweets.map((s) => (
              <SweetCard key={s._id} sweet={s} onBuy={handleBuy} />
            ))}
          </div>

          {/* Admin Only */}
          {isAdmin && (
            <div className="mt-6">
              <AddSweets />
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

export default App;