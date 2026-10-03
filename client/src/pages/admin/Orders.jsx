import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';

const STATUS_COLORS = {
  PENDING: 'bg-tertiary-container/30 text-tertiary',
  PREPARING: 'bg-secondary-container/30 text-secondary',
  READY: 'bg-primary-container/30 text-primary',
  COMPLETED: 'bg-surface-container-highest text-on-surface-variant',
  CANCELLED: 'bg-error-container/30 text-error',
};

function Orders() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ status: '', search: '', page: 1 });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data, isLoading } = useQuery(
    ['adminOrders', filters],
    () => api.getAdminOrders(filters),
    { refetchInterval: 15000 }
  );

  const updateStatusMutation = useMutation(
    ({ id, status }) => api.updateOrderStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminOrders');
        queryClient.invalidateQueries('adminStats');
      },
    }
  );

  const orders = data?.orders || [];

  const handleStatusChange = (orderId, newStatus) => {
    if (confirm(`Change order status to ${newStatus}?`)) {
      updateStatusMutation.mutate({ id: orderId, status: newStatus });
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-xl text-headline-xl text-on-surface">Orders Management</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by order number, name, or phone..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="flex-1 min-w-[300px] h-11 px-4 rounded-full bg-surface-container-high text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          className="h-11 px-4 rounded-full bg-surface-container-high text-on-surface font-body-md text-body-md focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PREPARING">Preparing</option>
          <option value="READY">Ready</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders table */}
      <div className="rounded-lg glass-effect overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-high">
              <tr>
                <th className="px-6 py-4 text-left font-label-lg text-label-lg text-on-surface">Order #</th>
                <th className="px-6 py-4 text-left font-label-lg text-label-lg text-on-surface">Customer</th>
                <th className="px-6 py-4 text-left font-label-lg text-label-lg text-on-surface">Type</th>
                <th className="px-6 py-4 text-left font-label-lg text-label-lg text-on-surface">Items</th>
                <th className="px-6 py-4 text-left font-label-lg text-label-lg text-on-surface">Total</th>
                <th className="px-6 py-4 text-left font-label-lg text-label-lg text-on-surface">Status</th>
                <th className="px-6 py-4 text-left font-label-lg text-label-lg text-on-surface">Time</th>
                <th className="px-6 py-4 text-left font-label-lg text-label-lg text-on-surface">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-on-surface-variant">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-t border-outline-variant hover:bg-surface-container-high/50">
                    <td className="px-6 py-4 font-label-md text-label-md text-primary font-mono">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">{order.customerName}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body-md text-body-md text-on-surface">
                      {order.orderType === 'DINE_IN' ? '🪑 Dine-in' : '📦 Takeaway'}
                    </td>
                    <td className="px-6 py-4 font-body-md text-body-md text-on-surface">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 font-label-md text-label-md text-secondary font-mono">
                      {order.total.toFixed(3)} TND
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm focus:outline-none"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="READY">Ready</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
