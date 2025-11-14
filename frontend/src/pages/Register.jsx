import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import url from "../Api"; // backend base URL

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post(
            `${url}/api/auth/register`,
            { email, password },
            { withCredentials: true }
        );
        console.log(res)

      if (res.status === 201) {
        alert("Registration successful! Please login.");
        navigate("/login");
      }

    } catch (error) {
      console.error(error);
      alert("Registration failed: " + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="container">
      <div className="card max-w-md mx-auto">
        <h3 className="text-lg font-bold mb-4 text-center">Register</h3>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full p-2 border rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all duration-200">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}