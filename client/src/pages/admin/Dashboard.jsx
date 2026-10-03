import React from 'react';
import { useQuery } from 'react-query';
import api from '../../utils/api';

function Dashboard() {
  const { data, isLoading } = useQuery('adminStats', api.getAdminStats, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-container-high rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-surface-container-high rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const bestSellers = data?.bestSellers || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Dashboard</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Welcome to Oxegene Admin Portal
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary-container/30 text-tertiary">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label-sm text-label-sm">Live Updates</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-lg glass-effect space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-lg text-label-lg text-on-surface-variant">Today's Orders</span>
            <span className="material-symbols-outlined text-primary text-[24px]">receipt_long</span>
          </div>
          <p className="font-headline-xl text-headline-xl text-on-surface">{stats.todayOrders || 0}</p>
        </div>

        <div className="p-6 rounded-lg glass-effect space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-lg text-label-lg text-on-surface-variant">Today's Revenue</span>
            <span className="material-symbols-outlined text-secondary text-[24px]">payments</span>
          </div>
          <p className="font-headline-xl text-headline-xl text-on-surface">
            {(stats.todayRevenue || 0).toFixed(3)} <span className="font-label-md text-label-md">TND</span>
          </p>
        </div>

        <div className="p-6 rounded-lg glass-effect space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-lg text-label-lg text-on-surface-variant">Pending Orders</span>
            <span className="material-symbols-outlined text-tertiary text-[24px]">pending_actions</span>
          </div>
          <p className="font-headline-xl text-headline-xl text-on-surface">{stats.pendingOrders || 0}</p>
        </div>

        <div className="p-6 rounded-lg glass-effect space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-lg text-label-lg text-on-surface-variant">Menu Items</span>
            <span className="material-symbols-outlined text-primary text-[24px]">local_cafe</span>
          </div>
          <p className="font-headline-xl text-headline-xl text-on-surface">{stats.totalProducts || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best sellers */}
        <div className="p-6 rounded-lg glass-effect space-y-4">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Top Sellers (30 Days)
          </h3>
          <div className="space-y-2">
            {bestSellers.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md font-bold">
                    {index + 1}
                  </span>
                  <span className="font-label-lg text-label-lg text-on-surface">{item.productName}</span>
                </div>
                <span className="font-label-md text-label-md text-secondary font-mono">
                  {item._sum.quantity} sold
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="p-6 rounded-lg glass-effect space-y-4">
          <h3 className="font-headline-md text-headline-md text-on-surface">Recent Orders</h3>
          <div className="space-y-2">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-3 rounded-lg bg-surface-container-high space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">
                    {order.orderNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
                    order.status === 'PENDING' ? 'bg-tertiary-container/30 text-tertiary' :
                    order.status === 'PREPARING' ? 'bg-secondary-container/30 text-secondary' :
                    order.status === 'READY' ? 'bg-primary-container/30 text-primary' :
                    'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                  <span>{order.customerName}</span>
                  <span>{order.total.toFixed(3)} TND</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
