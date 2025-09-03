import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Authentication/Login";
import SignUp from "./Pages/Authentication/SignUp";
import ForgetPassword from "./Pages/Authentication/ForgetPassword";
import HomePage from "./Pages/Home/HomePage";
import FoodMenu from "./Pages/Home/FoodMenu";
import Cart from "./Pages/Home/Cart";
import SearchResult from "./Pages/Home/Search/SearchResult";
import { CartProvider } from "./Context/CartContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePage from "./Pages/Home/ProfilePage";
import AboutUs from "./Pages/Home/AboutUs";
import OrdersPage from "./Pages/Home/OrdersPage";
import { OrderProvider } from "./Context/OrderContext";
import NotificationPage from "./Pages/Home/NotificationPage";
import ProtectedRoute from "./JwtRoute/ProtectedRoute";
import AdminDashboard from "./Pages/Admin/AdminDashboard";

const App = () => {

  return (
    <BrowserRouter>
      <OrderProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/forgetpassword" element={<ForgetPassword />}></Route>
            <Route path="/admin" element={<AdminDashboard />}></Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />}></Route>
              <Route path="/menu" element={<FoodMenu />}></Route>
              <Route path="/cart" element={<Cart />}></Route>
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/search" element={<SearchResult />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationPage />} />
            </Route>
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

        </CartProvider>
      </OrderProvider>
    </BrowserRouter>
  )
}

export default App
