import React,{useContext, useEffect,useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductContext, ProductProvider } from './context/ProductContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './page/Home';
import Login from './page/Login';
import ADLogin from './page/ADLogin';

import Register from './page/Register';
import Cart from './page/Cart';
import Favarate from './page/Favarate';
import ProductList from './page/ProductList';
import ProductDetails from './page/ProductDetails';
import LoginSeller from './components/LoginSeller';
import RegisterSeller from './page/RegisterSeller';
import { Outlet } from 'react-router-dom';
import GiftList from './page/GiftList';
import ForgetPass from './page/ForgetPass';
import VerifyCode from './page/VerifyCode';
import SetPass from './page/SetPass';
import SellerLogin from './page/SellerLogin';
// import SellerDash from './page/SellerDash';
import FavoriteSection from './page/FavoriteSection';
import JournalDetails from './page/JournalDetails';
import GiftDetails from './page/GiftDetails';
import ScrollToTopButton from './components/ScrollToTopButton';
import SellerProduct from './page/SellerProduct';
import SellerProductDetails from './page/SellerProductDetails';
// import Profile from './page/Profile';
import Pots from './page/Pots'
import MyProfile from './page/MyProfile';
import MyAccount from './page/MyAccount';
import Orders from './page/Orders';
import Storage from './page/Storage';
import Care from './page/Care';
import Accessories from './page/Accessories';

import Notifications from './page/Notifications';
import Dashboard from './Admin/Dashboard';
import AdminDash from './Admin/AdminDash';
import AdminOrder from './Admin/AdminOrder';
import AdminArticle from './Admin/AdminArticle';
// import AdminCoupons from './Admin/AdminCoupons';
import AdminCategory from './Admin/AdminCategory';
import AdminTransaction from './Admin/AdminTransaction';
import AdminAdd from './Admin/AdminAdd';
import AdminListProduct from './Admin/AdminListProduct';
import AdminReview from './Admin/AdminReview';
import AdminRole from './Admin/AdminRole';
import SellerDashboard from './Seller/SellerDashboard';
import SellerDash from './Seller/SellerDash';
import DeliveryDashboard from './Delivery/DeliveryDashboard';
import DeliveryDash from './Delivery/DeliveryDash';
import DeliveryActiveOrder from './Delivery/DeliveryActiveOrder';
import Archeived from './Delivery/Archeived';
import DMessage from './Delivery/DMessage';
import DProfile from './Delivery/DProfile';
import SOrder from './Seller/SOrder';
import SCustomer from './Seller/SCustomer';
import STransaction from './Seller/STransaction';
import SAdd from './Seller/SAdd';
import SProductList from './Seller/SProductList';
import SReview from './Seller/SReview';
import SProfile from './Seller/SProfile';
import Customer from './Admin/Customer';
import Seller from './Admin/Seller';
import Delivery from './Admin/Delivery';
import Terms from './page/Terma';
import Privacy from './page/Privacy';
import Cookies from './page/Cookies';
import Chat from './page/Chat';
import TrackOrder from './page/TrackOrder';
import OrderDetails from './page/OrderDetails';
import AddNewArticle from './Admin/AddNewArticle';
import JournalList from './page/JournalList';
import Payment from './page/Payment';
// import ScrollRevealWrapper from './assets/ScrollRevealWrapper'; // مكون لتفعيل scrollReveal
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from 'axios'; // تأكد من استيراد axios

const stripePromise = loadStripe("pk_test_51RiFVWRRBaAXkxC7o48Q4UQwMwY8ZMpYBBVWdG8V2sggNjz7gLVgU9ebLAsQQtREtP2WZND9WsBCxGsx2ZOQ814200hzPxDzxH");
axios.defaults.withCredentials = true;

const Layout = () => (

  <>
    <Navbar />
    <ScrollToTopButton />

    <Outlet />
    <Footer />
  </>
);

const App = () => {

  return (
    <ProductProvider>
      <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Routes>

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/trackOrder/:orderId" element={<TrackOrder />} />

                            <Route path="/orderDetails/:id" element={<OrderDetails />} />

            <Route path="/favarate" element={<Favarate />} />
            <Route path="/Pots" element={<Pots />} />

            <Route path="/productList/:id" element={<ProductList />} />
            <Route path="/giftList" element={<GiftList />} />
            <Route path="/SellerLogin" element={<SellerLogin />} />
            {/* <Route path="/SellerDash" element={<SellerDash />} /> */}
            <Route path="/product/:id" element={<ProductDetails />} />

                        <Route path="/SellerProduct/:id" element={<SellerProductDetails />} />

             <Route path="/gift/:id" element={<GiftDetails />} />
            <Route path="/pots/:id" element={<GiftDetails />} />
            <Route path="/storage/:id" element={<GiftDetails />} />
            <Route path="/care/:id" element={<GiftDetails />} />
            <Route path="/Accessories/:id" element={<GiftDetails />} />

<Route path="/Accessories" element={<Accessories />} />
<Route path="/care" element={<Care />} />
<Route path="/Storage" element={<Storage />} />
<Route path="/terms" element={<Terms />} />
<Route path="/privecy" element={<Privacy />} />
<Route path="/cookies" element={<Cookies />} />
<Route path="/Payment" element={<Payment />} />

<Route path="/journalList" element={<JournalList />} />

            <Route path="/favorites" element={<FavoriteSection />} />
            <Route path="/JournalDetails/:id" element={<JournalDetails />} />
            <Route path="/SellerProduct" element={<SellerProduct />} />
            <Route path="/profile" element={<MyProfile />}>
              <Route index element={<MyAccount />} />
              <Route path="orders" element={<Orders />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="chat" element={<Chat />} />
            </Route>

           </Route>
           <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

           <Route path="/ForgetPass" element={<ForgetPass />} />
            <Route path="/VerifyCode?" element={<VerifyCode />} />

           <Route path="/SetPass" element={<SetPass />} />

           <Route path="login-seller" element={<LoginSeller />} />
            <Route path="register-seller" element={<RegisterSeller />} />

          {/* admin route  */}
          <Route path="/admin" element={<Dashboard />}>

          <Route index element={<AdminDash />} />
          {/* <Route path="login" element={<Login />} /> */}
         <Route path="Order" element={<AdminOrder />} />
         <Route path="Article" element={<AdminArticle />} />
         <Route path="Article/addNewArticle" element={<AddNewArticle />} />

         {/* <Route path="coupons" element={<AdminCoupons />} /> */}
         <Route path="category" element={<AdminCategory />} />
         <Route path="transaction" element={<AdminTransaction />} />
         <Route path="addProduct" element={<AdminAdd />} />
         <Route path="productList" element={<AdminListProduct />} />
         <Route path="productReview" element={<AdminReview />} />
         <Route path="role" element={<AdminRole />} />
         <Route path="users/customers" element= {<Customer />} />
         <Route path="users/sellers" element= {<Seller />} />
         <Route path="users/delivery" element= {<Delivery />} />




        </Route>
                <Route path="admin/login" element={<ADLogin />}  />

        {/* end admin route  */}
        {/* seller route  */}
        <Route path="/seller" element={<SellerDashboard />}>
          <Route index element={<SellerDash />} />
         <Route path="Order" element={<SOrder />} />
         <Route path="customer" element={<SCustomer />} />
         <Route path="transaction" element={<STransaction />} />
         <Route path="addProduct" element={<SAdd />} />
         <Route path="productList" element={<SProductList />} />
         <Route path="productReview" element={<SReview />} />
         <Route path="profile" element={<SProfile />} />



        </Route>
        {/* end seller route  */}

        {/* delivery route  */}
        <Route path="/delivery" element={<DeliveryDashboard />}>

          <Route index element={<DeliveryDash />} />
         <Route path="Order" element={<DeliveryActiveOrder />} />
         <Route path="archeived" element={<Archeived />} />
         <Route path="message" element={<DMessage />} />
         <Route path="setting" element={<DProfile />} />


        </Route>
                <Route path="delivery/login" element={<ADLogin />}  />

         {/* end delivery route  */}


        </Routes>
</Elements>

      </BrowserRouter>
    </ProductProvider>
  );
};

export default App;
