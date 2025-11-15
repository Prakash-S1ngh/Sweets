import React, { useEffect, useState } from "react";
import axios from "axios";
import SweetContext from "./SweetContext";
import url from "../Api";
import Toasts from "../components/Toast";

const SweetProvider = ({ children }) => {
  const [sweets, setSweets] = useState([]);
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("loggedIn") === "true");

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).slice(2, 9);
    setToasts((t) => [...t, { id, message, type }]);
    return id;
  };

  const removeToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  useEffect(() => {
    if (userId) localStorage.setItem("userId", userId);
    else localStorage.removeItem("userId");

    localStorage.setItem("loggedIn", loggedIn);
  }, [userId, loggedIn]);

  // Fetch sweets & user
  useEffect(() => {
    fetchUserDetails();
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const response = await axios.get(`${url}/api/sweets/`, { withCredentials: true });
      setSweets(response.data.sweets);
    } catch (error) {
      console.error("Error fetching sweets:", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`${url}/api/auth/users`, { withCredentials: true });

      setUser(res.data.user);
      setUserId(res.data.user._id);
      setLoggedIn(true);
      setIsAdmin(res.data.user.role === "admin");

      fetchCart();
    } catch (error) {
      console.log("User details fetch failed:", error);
      setCart(null);
    }
  };

  // LOGOUT
  const logoutUser = async () => {
    try {
      await axios.post(`${url}/api/auth/logout`, {}, { withCredentials: true });
    } catch {}

    setUser(null);
    setLoggedIn(false);
    setUserId(null);
    setIsAdmin(false);
    setCart(null);

    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
  };

  // ===============================
  // CART: FETCH
  // ===============================
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${url}/api/auth/getcart`, {
        withCredentials: true,
      });

      setCart(res.data.cart); // store full cart object
    } catch (err) {
      if (err?.response?.status !== 401) console.error("Cart fetch error:", err);
      setCart(null);
    }
  };

  // ===============================
  // CART: UPDATE QUANTITY
  // ===============================
  const updateQuantity = async (sweetId, newQuantity) => {
    try {
      await axios.put(
        `${url}/api/auth/updatecart`,
        { sweetId, newQuantity },
        { withCredentials: true }
      );

      await fetchCart();
      showToast("Cart updated", "success");
    } catch (err) {
      console.error("Update cart error:", err);
      showToast("Failed to update cart", "error");
    }
  };

  // ===============================
  // CART: ADD ITEM
  // ===============================
  const addToCart = async (sweet) => {
    try {
      setLoading(true);

      await axios.post(
        `${url}/api/auth/addcart`,
        { name: sweet.name, quantity: 1 },
        { withCredentials: true }
      );

      await fetchCart();
      showToast(`${sweet.name} added to cart`, "success");

      return true;
    } catch (err) {
      console.error("Add to cart error:", err);
      showToast("Add to cart failed", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // PLACE ORDER
  // ===============================
  const placeOrder = async () => {
    try {
      const res = await axios.post(
        `${url}/api/auth/placeorder`,
        {},
        { withCredentials: true }
      );

      showToast("Order placed!", "success");
      await fetchCart();
      return res.data.order;
    } catch (err) {
      console.error("Order failed:", err);
      showToast("Failed to place order", "error");
    }
  };

  return (
    <SweetContext.Provider
      value={{
        // Sweet
        sweets,
        setSweets,

        // User
        user,
        setUser,
        userId,
        setUserId,
        fetchUserDetails,
        loggedIn,
        setLoggedIn,
        isAdmin,
        setIsAdmin,
        logoutUser,

        // Cart
        cart,
        setCart,
        updateQuantity,
        fetchCart,
        addToCart,
        placeOrder,

        // UI
        loading,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
      <Toasts toasts={toasts} remove={removeToast} />
    </SweetContext.Provider>
  );
};

export default SweetProvider;