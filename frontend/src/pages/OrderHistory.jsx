import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import url from '../Api';
import SweetContext from '../Context/SweetContext';
import Spinner from '../components/Spinner';

export default function OrderHistory() {
  const { isAdmin } = useContext(SweetContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const path = isAdmin ? `${url}/api/orders/all` : `${url}/api/orders`;
      const res = await axios.get(path, { withCredentials: true, params });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Fetch orders error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Order History</h2>
        <div className="flex gap-2 items-center">
          <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="border px-3 py-2 rounded" />
          <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="border px-3 py-2 rounded" />
          <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 text-white rounded">Filter</button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><Spinner size={36} /></div>
      ) : orders.length === 0 ? (
        <p className="text-center muted">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="p-4 rounded-lg shadow bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Order ID: {order._id}</div>
                  <div className="text-lg font-semibold">₹{order.totalAmount} • <span className="text-sm muted">{new Date(order.createdAt).toLocaleString()}</span></div>
                </div>
                <div className="text-sm px-3 py-1 rounded bg-gray-100">{order.orderStatus}</div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.items.map((it) => {
                  const p = it.sweetId || {};
                  const img = p.imageUrl || p.image || null;
                  return (
                    <div key={it._id || p._id} className="flex gap-3 items-center">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-gray-400">No Image</div>}
                      </div>
                      <div>
                        <div className="font-semibold">{p.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-600">Qty: {it.quantity} • ₹{it.price}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
