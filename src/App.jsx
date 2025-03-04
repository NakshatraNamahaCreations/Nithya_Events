import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageHeader from "./components/PageHeader";
import Home from "./pages/Home";
import AllCategory from "./pages/AllCategory";
import Products from "./pages/Products";
import Vendors from "./pages/Vendors";
import Cart from "./pages/Cart";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import { Box } from "@mui/material";
import ScrollToTop from "./utils/ScrollToTop";
import { useSelector } from "react-redux";
import useReactFontLoader from "react-font-loader";
import FeaturedProduct from "./pages/Products/FeaturedProduct";
import Account from "./pages/Account";
import LoginWithMobile from "./pages/Login/component/LoginWithMobile";
import Profile from "./pages/Account/components/Profile";
import CompanyDetails from "./pages/CompanyDetails";
import BookingDetails from "./pages/Bookings/components/BookingDetails";
import ServicePage from "./pages/ServicePage";
import ServiceDetails from "./pages/ServicePage/components/ServiceDetails";
import SingleService from "./pages/ServicePage/components/SingleService";
import ReturnPolicy from "./pages/ReturnPolicy";
import CalendarModal from "./pages/Calender";
import Calendar from "./pages/Calender";
import Toc from "./pages/Toc";
import Terms from "./pages/Cart/components/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HelpCentre from "./pages/HelpCenter";
// import LoginMobile from "./pages/LoginMobile";

// Lazy-loaded components
const Category = lazy(() => import("./pages/Category"));
const SingleCategory = lazy(() =>
  import("./pages/Category/components/SingleCategory")
);
const SingleProduct = lazy(() => import("./pages/Products/SingleProducts"));
const SingleVendor = lazy(() =>
  import("./pages/Vendors/components/SingleVendor")
);
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Bookings = lazy(() => import("./pages/Bookings"));
const AboutUs = lazy(() => import("./pages/About"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

// PrivateRoute Component
const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// PublicRoute Component
const PublicRoute = ({ isAuthenticated, children }) => {
  return !isAuthenticated ? children : <Navigate to="/signup" />;
};

import "./App.css";
import FaqPage from "./pages/FaqPage";

function App() {
  const loading = useSelector((state) => state.loader.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useReactFontLoader({
    url: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  });

  return (
    <BrowserRouter>
      <Loading loading={loading} />
      <ScrollToTop />

      <Box style={{ paddingTop: "4rem" }}>
        <Suspense fallback={<Loading />}>
          <PageHeader />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/signup"
              element={
                // <PublicRoute isAuthenticated={isAuthenticated}>
                <Signup />
                // </PublicRoute>
              }
            />

            <Route
              path="/login"
              element={
                // <PublicRoute isAuthenticated={isAuthenticated}>
                <Login />
                // </PublicRoute>
              }
            />
            <Route
              path="/loginMobile"
              element={
                // <PublicRoute isAuthenticated={isAuthenticated}>
                <LoginWithMobile />
                // </PublicRoute>
              }
            />
            <Route path="/aboutUs" element={<AboutUs />} />
            {/* Protected Routes */}
            <Route
              path="/category/:category"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Category />
                // </PrivateRoute>
              }
            />
            <Route
              path="/calenders"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Calendar />
                // </PrivateRoute>
              }
            />
            <Route
              path="/services"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <ServicePage />
                // </PrivateRoute>
              }
            />
            <Route
              path="/service/:serviceName"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <ServiceDetails />
                // </PrivateRoute>
              }
            />
            <Route
              path="/service/:serviceName/:id"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <SingleService />
                // </PrivateRoute>
              }
            />
                  <Route
              path="/wishlist"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Wishlist />
                // </PrivateRoute>
              }
            />
                  <Route
              path="/help-center"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <HelpCentre />
                // </PrivateRoute>
              }
            />
            <Route
              path="/company"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <CompanyDetails />
                // </PrivateRoute>
              }
            />
            <Route
              path="/category/:category/:id"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <SingleCategory />
                // </PrivateRoute>
              }
            />
            <Route
              path="/categories"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <AllCategory />
                // </PrivateRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Bookings />
                 </PrivateRoute>
              }
            />
            <Route
              path="/booking/:id"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <BookingDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Products />
                // </PrivateRoute>
              }
            />
            <Route
              path="/Featuredproducts"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <FeaturedProduct />
                // </PrivateRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <SingleProduct />
                // </PrivateRoute>
              }
            />
            <Route
              path="/vendors"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Vendors />
                // </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendors/:id"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                  <SingleVendor />
                // </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Account />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Profile />
                </PrivateRoute>
              }
            />
                <Route
              path="/faq"
              element={
                // <PublicRoute isAuthenticated={isAuthenticated}>
                <FaqPage />
                // </PublicRoute>
              }
            />
            <Route path="/TermsAndCondition" element={<Toc />} />
            <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/returnPolicy" element={<ReturnPolicy />} />
          </Routes>
          <Footer />
        </Suspense>
      </Box>
    </BrowserRouter>
  );
}

export default App;
