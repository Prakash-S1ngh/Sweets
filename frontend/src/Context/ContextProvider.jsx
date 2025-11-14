import React, { useEffect, useState } from "react";
import axios from "axios";
import SweetContext from "./SweetContext";
import url from "../Api";

const SweetProvider = ({ children }) => {
  const [sweets, setSweets] = useState([]);

  // NEW STATES
  const [user, setUser] = useState(null);               // whole user object
  const [loggedIn, setLoggedIn] = useState(false);      // true when user logs in
  const [isAdmin, setIsAdmin] = useState(false);        // false by default

  // Fetch sweets on mount
  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const response = await axios.get(`${url}/api/sweets`);
        setSweets(response.data.sweets);
      } catch (error) {
        console.error("Error fetching sweets:", error);
      }
    };
    fetchSweets();
  }, []);

  // FUNCTION TO LOGIN USER
  const loginUser = async (userData) => {
    // userData should contain: { userId, name, email, role }
    const res = await axios.post(`${url}/api/auth/login`, userData, { withCredentials: true });
    console.log("User ka data",res);
    setUser(userData);
    setLoggedIn(true);
    setIsAdmin(userData.role === "admin");  // backend should return role
  };

  // FUNCTION TO LOGOUT
  const logoutUser = () => {
    setUser(null);
    setLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <SweetContext.Provider
      value={{
        sweets,
        setSweets,

        user,
        setUser,

        loggedIn,
        setLoggedIn,

        isAdmin,
        setIsAdmin,

        loginUser,
        logoutUser,
      }}
    >
      {children}
    </SweetContext.Provider>
  );
};

export default SweetProvider;