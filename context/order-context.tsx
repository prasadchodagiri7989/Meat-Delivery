import { orderService, profileService } from '@/services';
import { DeliveryStats, Order } from '@/types';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface OrderContextType {
  // State
  pendingOrders: Order[];
  assignedOrders: Order[];
  selectedOrder: Order | null;
  stats: DeliveryStats | null;
  isLoading: boolean;
  error: string | null;

  // Order actions
  fetchPendingOrders: () => Promise<void>;
  fetchAssignedOrders: () => Promise<void>;
  selectOrder: (order: Order | null) => void;
  acceptOrder: (orderId: string) => Promise<boolean>;
  markOutForDelivery: (orderId: string, notes?: string) => Promise<boolean>;
  markDelivered: (orderId: string, notes?: string, otp?: string) => Promise<boolean>;

  // Stats
  fetchStats: () => Promise<void>;

  // Utility
  clearError: () => void;
  refreshAll: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingOrders = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('[OrderContext] Fetching pending orders...');

      const response = await orderService.getPendingOrders();
      console.log('[OrderContext] Pending orders response:', JSON.stringify(response, null, 2));
      
      if (response.success && Array.isArray(response.data)) {
        console.log('[OrderContext] Pending orders received:', response.data.length, 'orders');
        // Ensure all items are valid objects
        const validOrders = response.data.filter(order => 
          order && typeof order === 'object' && order._id
        );
        setPendingOrders(validOrders);
      } else if (response.success && response.data && typeof response.data === 'object') {
        // If data is a single object, wrap it in an array
        console.warn('[OrderContext] Received single order object, wrapping in array');
        setPendingOrders([response.data]);
      } else {
        console.warn('[OrderContext] Failed to fetch pending orders:', response.message);
        setError(response.message || 'Failed to fetch pending orders');
        setPendingOrders([]);
      }
    } catch (err: any) {
      console.error('[OrderContext] Error fetching pending orders:', err);
      setError(err.message || 'Failed to fetch pending orders');
      setPendingOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAssignedOrders = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('[OrderContext] Fetching assigned orders...');

      const response = await orderService.getAssignedOrders();
      console.log('[OrderContext] Assigned orders response:', JSON.stringify(response, null, 2));
      
      if (response.success && Array.isArray(response.data)) {
        console.log('[OrderContext] Assigned orders received:', response.data.length, 'orders');
        // Ensure all items are valid objects
        const validOrders = response.data.filter(order => 
          order && typeof order === 'object' && order._id
        );
        setAssignedOrders(validOrders);
      } else if (response.success && response.data && typeof response.data === 'object') {
        // If data is a single object, wrap it in an array
        console.warn('[OrderContext] Received single order object, wrapping in array');
        setAssignedOrders([response.data]);
      } else {
        console.warn('[OrderContext] Failed to fetch assigned orders:', response.message);
        setError(response.message || 'Failed to fetch assigned orders');
        setAssignedOrders([]);
      }
    } catch (err: any) {
      console.error('[OrderContext] Error fetching assigned orders:', err);
      setError(err.message || 'Failed to fetch assigned orders');
      setAssignedOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptOrder = useCallback(async (orderId: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await orderService.acceptOrder(orderId);
      if (response.success && response.data) {
        // Remove from pending orders
        setPendingOrders((prev) => prev.filter((o) => o._id !== orderId));
        // Add to assigned orders
        setAssignedOrders((prev) => [...prev, response.data as Order]);
        return true;
      } else {
        setError(response.message || 'Failed to accept order');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to accept order');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markOutForDelivery = useCallback(
    async (orderId: string, notes?: string): Promise<boolean> => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await orderService.markOutForDelivery(orderId, notes);
        if (response.success && response.data) {
          const updatedOrder = response.data as Order;

          // Update in assigned orders
          setAssignedOrders((prev) =>
            prev.map((o) => (o._id === orderId ? updatedOrder : o))
          );

          // Update selected order if it's the same
          if (selectedOrder?._id === orderId) {
            setSelectedOrder(updatedOrder);
          }

          return true;
        } else {
          setError(response.message || 'Failed to mark order as out for delivery');
          return false;
        }
      } catch (err: any) {
        setError(err.message || 'Failed to mark order as out for delivery');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedOrder]
  );

  const markDelivered = useCallback(
    async (orderId: string, notes?: string, otp?: string): Promise<boolean> => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await orderService.markDelivered(orderId, notes, otp);
        if (response.success && response.data) {
          const updatedOrder = response.data as Order;

          // Remove from assigned orders
          setAssignedOrders((prev) => prev.filter((o) => o._id !== orderId));

          // Clear selected order if it's the same
          if (selectedOrder?._id === orderId) {
            setSelectedOrder(null);
          }

          // Refresh stats since delivery count changed
          await fetchStats();

          return true;
        } else {
          setError(response.message || 'Failed to mark order as delivered');
          return false;
        }
      } catch (err: any) {
        setError(err.message || 'Failed to mark order as delivered');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedOrder]
  );

  const fetchStats = useCallback(async () => {
    try {
      console.log('[OrderContext] Fetching stats...');
      const response = await profileService.getStats();
      console.log('[OrderContext] Stats response:', JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        console.log('[OrderContext] Stats data received:', response.data);
        setStats(response.data);
      } else {
        console.warn('[OrderContext] Failed to fetch stats:', response.message);
        console.warn('[OrderContext] Full response:', response);
      }
    } catch (err) {
      console.error('[OrderContext] Failed to fetch stats:', err);
    }
  }, []);

  const clearError = () => setError(null);

  const refreshAll = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchPendingOrders(), fetchAssignedOrders(), fetchStats()]);
    } catch (err) {
      console.error('Failed to refresh orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPendingOrders, fetchAssignedOrders, fetchStats]);

  const value: OrderContextType = {
    pendingOrders,
    assignedOrders,
    selectedOrder,
    stats,
    isLoading,
    error,
    fetchPendingOrders,
    fetchAssignedOrders,
    selectOrder: setSelectedOrder,
    acceptOrder,
    markOutForDelivery,
    markDelivered,
    fetchStats,
    clearError,
    refreshAll,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
