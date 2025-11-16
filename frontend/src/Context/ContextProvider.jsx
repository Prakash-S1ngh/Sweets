import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import SweetContext from "./SweetContext";
import url from "../Api";
import Toasts from "../components/Toast";

const SweetProvider = ({ children }) => {
  const [sweets, setSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("loggedIn") === "true");

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const [toasts, setToasts] = useState([]);
  const [sweetsLoading, setSweetsLoading] = useState(false);

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
  // define fetch helpers before effects so they are stable when used
  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/api/auth/getcart`, {
        withCredentials: true,
      });

      setCart(res.data.cart);
    } catch (err) {
      if (err?.response?.status !== 401) console.error("Cart fetch error:", err);
      setCart(null);
    }
  }, []);

  const fetchUserDetails = useCallback(async () => {
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
  }, [fetchCart]);

  const fetchSweets = useCallback(async () => {
    setSweetsLoading(true);
    try {
      const response = await axios.get(`${url}/api/sweets/`, { withCredentials: true });
      setSweets(response.data.sweets);
      // initialize filters
      setFilteredSweets(response.data.sweets || []);
    } catch (error) {
      console.error("Error fetching sweets:", error);
    } finally {
      setSweetsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchSweets();
  }, [fetchUserDetails, fetchSweets]);

  // If user logs in later (without full refresh), ensure sweets are fetched
  useEffect(() => {
    if (loggedIn) {
      fetchSweets();
    }
  }, [loggedIn, fetchSweets]);

  // listen to header search events and sweets refresh requests
  useEffect(() => {
    const onHeaderSearch = (e) => {
      setSearchTerm(e.detail || "");
    };

    const onRefresh = () => {
      fetchSweets();
    };

    window.addEventListener("header:search", onHeaderSearch);
    window.addEventListener("sweets:refresh", onRefresh);

    return () => {
      window.removeEventListener("header:search", onHeaderSearch);
      window.removeEventListener("sweets:refresh", onRefresh);
    };
  }, [fetchSweets]);

  

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
  // SEARCH & FILTERING
  // ===============================
  // derive categories from sweets
  const categories = React.useMemo(() => {
    const set = new Set((sweets || []).map((s) => s.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [sweets]);

  // update filteredSweets when sweets, searchTerm, or selectedCategory change
  React.useEffect(() => {
    let list = (sweets || []).slice();
    const q = (searchTerm || '').trim().toLowerCase();
    if (q) {
      list = list.filter((s) => (s.name || '').toLowerCase().includes(q) || (s.category || '').toLowerCase().includes(q));
    }
    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter((s) => s.category === selectedCategory);
    }
    setFilteredSweets(list);
  }, [sweets, searchTerm, selectedCategory]);

  // ===============================
  // PLACE ORDER
  // ===============================
  const placeOrder = async () => {
    try {
      const res = await axios.post(`${url}/api/orders/place`, {}, { withCredentials: true });

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
        filteredSweets,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        categories,
        sweetsLoading,

        // User
        user,
        setUser,
        userId,
        setUserId,
        fetchUserDetails,
        fetchSweets,
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