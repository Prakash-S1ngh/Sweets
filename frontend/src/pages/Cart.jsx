import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SweetContext from "../Context/SweetContext";

const Cart = () => {
  const { cart, fetchCart, updateQuantity, placeOrder } =
    useContext(SweetContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  if (!cart || !cart.items) {
    return <p className="p-5 text-gray-500">Loading cart...</p>;
  }

  const items = cart.items;

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

      {/* EMPTY CART */}
      {items.length === 0 && (
        <div className="text-center mt-10">
          <p className="text-gray-500 mb-5 text-lg">Your cart is empty.</p>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      )}

      {/* CART LIST */}
      {items.map((item) => {
        const product = item.sweetId || item; // handle populated sweetId or fallback
        const img = product.imageUrl || product.image || item.imageUrl || null;
        const key = (product && product._id) || item._id || item.sweetId?._id;

        return (
          <div key={key} className="border p-4 rounded-lg mb-4 shadow flex gap-4 items-center">
            <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {img ? (
                <img src={img} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-lg font-semibold">{product.name}</h4>
              <p className="text-gray-600">₹{item.price}</p>

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(product._id, item.quantity - 1)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  -
                </button>

                <span className="font-semibold">{item.quantity}</span>

                <button
                  onClick={() => updateQuantity(product._id, item.quantity + 1)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  +
                </button>

                {/* REMOVE */}
                <button
                  onClick={() => updateQuantity(product._id, 0)}
                  className="ml-auto px-4 py-1 bg-red-500 text-white rounded-lg"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* PLACE ORDER */}
      {items.length > 0 && (
        <button
          onClick={placeOrder}
          className="mt-5 w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-green-700 transition"
        >
          Place Order
        </button>
      )}
    </div>
  );
};

export default Cart;