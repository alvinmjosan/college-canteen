import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);

    const createOrder = async (userId, orderNumber, cartItems, total, paymentMethod, deliveryMethod, deliveryAddress) => {
        try {
          const response = await axios.post("https://bitebuddy-backend-6wwq.onrender.com/api/orders", {
            userId,
            orderNumber,
            items: cartItems,
            total,
            paymentMethod,
            deliveryMethod,
            deliveryAddress,
            isStatus: "processing", // Default order status
          });
    
          console.log("Order placed successfully:", response.data);
        } catch (error) {
          console.error("Error placing order:", error);
        }
    }

    useEffect(() => {
      const fetchOrders = async () => {
          try {
              const token = localStorage.getItem("token");
              if (!token) {
                  console.warn("No token found in localStorage, cannot fetch orders");
                  setOrders([]); // Set empty array if no token
                  return;
              }

              const response = await axios.get("https://bitebuddy-backend-6wwq.onrender.com/api/orders", {
                  headers: { Authorization: `Bearer ${token}` },
              });
              setOrders(response.data);
          } catch (error) {
              console.error("Error fetching orders:", error);
              if (error.response?.status === 401) {
                  console.warn("Unauthorized access, token may be invalid or expired");
                  setOrders([]); // Set empty array on 401 error
              } else {
                  setOrders([]); // Set empty array on other errors
              }
          }
      };

      fetchOrders();
  }, []);

    return (
        <OrderContext.Provider value={{ orders, setOrders, createOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
