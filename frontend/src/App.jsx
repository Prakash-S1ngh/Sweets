import { useContext, useState, useEffect } from "react";
import "./index.css";
import Layout from "./components/Layout";
import SweetContext from "./Context/SweetContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";       // You created this
import { Route, Routes, useNavigate } from "react-router-dom";
import Cart from "./pages/Cart";

function App() {
  const { loggedIn } = useContext(SweetContext);
  const navigate = useNavigate();

  // Control Login/Register view
  const [authView, setAuthView] = useState("login");

  // Redirect when logged in
  useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard");
    }
  }, [loggedIn]);

  return (
    <Layout>
      <Routes>
        {/* Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Login and Register Routes (Optional Navigation) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/cart' element={<Cart/>}/>

        {/* Default Route: Show login/register screen */}
        <Route
          path="/"
          element={
            !loggedIn ? (
              <div className="max-w-md mx-auto mb-8">

                {/* Toggle buttons */}
                <div className="flex justify-center gap-4 mb-4 mt-6">
                  <button
                    onClick={() => setAuthView("login")}
                    className={`px-4 py-2 rounded ${
                      authView === "login"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Login
                  </button>

                  <button
                    onClick={() => setAuthView("register")}
                    className={`px-4 py-2 rounded ${
                      authView === "register"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Register
                  </button>
                </div>

                {/* Show only one */}
                {authView === "login" ? <Login /> : <Register />}
              </div>
            ) : (
              <Dashboard />
            )
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;