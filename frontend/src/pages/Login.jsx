import { useState, useContext } from "react";
import axios from "axios";
import SweetContext from "../Context/SweetContext";
import url from "../Api"; // your backend base URL

export default function Login() {
    const { loginUser } = useContext(SweetContext); 

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const response = await axios.post(`${url}/api/auth/login`, {
                email,
                password,
            },
        {withCredentials: true});

            // Backend should return:
            // { token, user: { _id, name, email, role } }

            const { user, token } = response.data;

            // Save token (optional)
            localStorage.setItem("token", token);

            // Update Context
            loginUser({
                name: user.name,
                email: user.email
            });

            alert("Login successful!");

        } catch (error) {
            console.error("Login error:", error);
            setErrorMsg("Invalid email or password");
        }
    };

    return (
        <div className="container">
            <div className="card max-w-md mx-auto">
                <h3 className="text-lg font-bold mb-2">Login</h3>

                {errorMsg && (
                    <p className="text-red-600 text-sm mb-2">{errorMsg}</p>
                )}

                <form onSubmit={submit} className="space-y-3">
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
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}