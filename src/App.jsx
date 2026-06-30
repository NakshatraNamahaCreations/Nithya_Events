import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

import LandingPage from "./pages/LandingPage/pages/LandingPage";

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
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

// PrivateRoute Component
const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// PublicRoute Component
const PublicRoute = ({ isAuthenticated, children }) => {
  return !isAuthenticated ? children : <Navigate to="/signup" />;
};

import FaqPage from "./pages/FaqPage";
import Mood from "./pages/Mood";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResentPassword";
import GoogleAuth from "./pages/GoogleAuth";
import RaiseTicket from "./pages/RaiseTicket";
import MoodDetail from "./pages/Mood/MoodDetail";
import GetTickets from "./pages/RaiseTicket/GetTickets";
import Phonepe from "./components/Phonepe";
import TicketDetails from "./pages/RaiseTicket/GetTickets/Components/TicketDetails";
import ContactUs from "./pages/About/ContactUs";
import HelpCenter from "./pages/About/HelpCenter";
import PaymentStatus from "./pages/PaymentStatus";

import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import OrderConfirmed from "./pages/OrderConfirmed";

// Main App component wrapper
const AppContent = () => {
  const location = useLocation();
  const loading = useSelector((state) => state.loader.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  // Check if current route is landing-page
  const isLandingPage = location.pathname === "/landing-page";
  
  return (
    <>
      <Loading loading={loading} />
      <ScrollToTop />

      <Box style={{ paddingTop: isLandingPage ? "0" : "4rem" }}>
        <Suspense fallback={<Loading />}>
          {!isLandingPage && <PageHeader />}
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
              path="/forgotPassword"
              element={
                // <PublicRoute isAuthenticated={isAuthenticated}>
                <ForgotPassword />
                // </PublicRoute>
              }
            />
            <Route
              path="/verify-otp"
              element={
                // <PublicRoute isAuthenticated={isAuthenticated}>
                <OtpVerification />
                // </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                // <PublicRoute isAuthenticated={isAuthenticated}>
                <ResetPassword />
                // </PublicRoute>
              }
            />
            <Route
              path="/sign-google"
              element={
                // <PublicRoute isAuthenticated={isAuthenticated}>
                <GoogleAuth />
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
            <Route
              path="/raise-ticket/:bookingId"
              element={
                // <PublicRoute isAuthenticated={isAuthenticated}>
                <RaiseTicket />
                //  </PublicRoute>
              }
            />
            <Route
              path="/ticket-details"
              element={
                // <PublicRoute isAuthenticated={isAuthenticated}>
                <TicketDetails />
                //  </PublicRoute>
              }
            />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/help-center" element={<HelpCenter />} />
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
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Wishlist />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/help-center"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                <HelpCentre />
                // </PrivateRoute>
              }
            /> */}
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
            {/* <Route
              path="/products/:id"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                <SingleProduct />
                // </PrivateRoute>
              }
            /> */}
            <Route
              path="/products/:category/:productSlug"
              element={<SingleProduct />}
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
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                <Cart />
                // </PrivateRoute>
              }
            />
            <Route
              path="/moodDetails/:id"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <MoodDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/phonepe"
              element={
                // <PrivateRoute isAuthenticated={isAuthenticated}>
                <Phonepe />
                //  </PrivateRoute>
              }
            />
            <Route
              path="/mood-board"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Mood />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <GetTickets />
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

            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
            <Route path="/order-confirmed" element={<OrderConfirmed />} />

            <Route path="/payment-status" element={<PaymentStatus />} />

            <Route path="/landing-page" element={<LandingPage />} />
            {/* <Route path="/Sound" element={<SoundHome />} /> */}
            {/* <Route path="/projectpage" element={<ProjectPage />} /> */}
            {/* <Route path="/about-us" element={<LandingAboutUs />} /> */}
            {/* <Route path="/blog" element={<Blogs />} /> */}
            {/* <Route path="/bangalore" element={<VendorBng />} /> */}
            {/* <Route path="/how-to-choose-perfect-shamiana" element={<Blog1 />} /> */}
            {/* <Route path="/how-to-book-fabric-rentals" element={<Blog2 />} /> */}
            {/* <Route path="/how-task-management" element={<Blog3 />} /> */}
            {/* <Route path="/power-up-your-big-day" element={<Blog4 />} /> */}
            {/* <Route path="/best-event-photography" element={<Blog5 />} /> */}
            {/* <Route path="/how-to-choose-perfect-lighting" element={<Blog6 />} /> */}
            {/* <Route path="/partner-with-us" element={<PartnerWithUs />} /> */}
            {/* <Route path="/privacy-policy" element={<LandingPrivacyPolicy />} /> */}
            {/* <Route path="/terms-and-conditions" element={<TermsConditions />} /> */}
            {/* <Route path="/refund-policy" element={<LandingRefundPolicy />} /> */}
            {/* <Route
              path="/help-center-landing"
              element={<LandingHelpCenter />}
            /> */}
            {/* <Route path="/user-help-center" element={<UserHelpCenter />} /> */}
            {/* <Route
              path="/user-privacy-policy"
              element={<UserPrivacyPolicy />}
            /> */}
            {/* <Route path="/user-refund-policy" element={<UserRefundPolicy />} /> */}
            {/* <Route
              path="/user-terms-and-conditions"
              element={<UserTermsConditions />}
            /> */}
          </Routes>
          {!isLandingPage && <Footer />}
        </Suspense>
      </Box>
    </>
  );
};

function App() {
  useReactFontLoader({
    url: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  });

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
// import React, { Suspense, lazy } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import PageHeader from "./components/PageHeader";
// import Home from "./pages/Home";
// import AllCategory from "./pages/AllCategory";
// import Products from "./pages/Products";
// import Vendors from "./pages/Vendors";
// import Cart from "./pages/Cart";
// import Footer from "./components/Footer";
// import Loading from "./components/Loading";
// import { Box } from "@mui/material";
// import ScrollToTop from "./utils/ScrollToTop";
// import { useSelector } from "react-redux";
// import useReactFontLoader from "react-font-loader";
// import FeaturedProduct from "./pages/Products/FeaturedProduct";
// import Account from "./pages/Account";
// import LoginWithMobile from "./pages/Login/component/LoginWithMobile";
// import Profile from "./pages/Account/components/Profile";
// import CompanyDetails from "./pages/CompanyDetails";
// import BookingDetails from "./pages/Bookings/components/BookingDetails";
// import ServicePage from "./pages/ServicePage";
// import ServiceDetails from "./pages/ServicePage/components/ServiceDetails";
// import SingleService from "./pages/ServicePage/components/SingleService";
// import ReturnPolicy from "./pages/ReturnPolicy";
// import CalendarModal from "./pages/Calender";
// import Calendar from "./pages/Calender";
// import Toc from "./pages/Toc";
// import Terms from "./pages/Cart/components/Terms";
// import PrivacyPolicy from "./pages/PrivacyPolicy";
// import HelpCentre from "./pages/HelpCenter";

// import LandingPage from "./pages/LandingPage/pages/LandingPage";

// // commented by sonali all landing page routes
// // import SoundHome from "./pages/LandingPage/Sound/SoundHome";
// // import ProjectPage from "./pages/LandingPage/ProjectPage/Project";
// // import Blogs from "./pages/LandingPage/blogs/Blog";
// // import LandingAboutUs from "./pages/LandingPage/about-us/LandingAboutUs";
// // import VendorBng from "./pages/LandingPage/Vendor/Vendor";
// // import Blog1 from "./pages/LandingPage/blogs/Blog1";
// // import Blog2 from "./pages/LandingPage/blogs/Blog2";
// // import Blog3 from "./pages/LandingPage/blogs/Blog3";
// // import Blog4 from "./pages/LandingPage/blogs/Blog4";
// // import Blog5 from "./pages/LandingPage/blogs/Blog5";
// // import Blog6 from "./pages/LandingPage/blogs/Blog6";
// // import PartnerWithUs from "./pages/LandingPage/PartnerWithUs/PartnerWithUs";
// // import LandingPrivacyPolicy from "./pages/LandingPage/Policies/LandingPrivacyPolicy";
// // import TermsConditions from "./pages/LandingPage/Policies/Terms&Conditions";
// // import LandingRefundPolicy from "./pages/LandingPage/Policies/LandingRefundPolicy";
// // import LandingHelpCenter from "./pages/LandingPage/Policies/LandingHelpCenter";
// // import UserHelpCenter from "./pages/LandingPage/UserPolicies/UserHelpcenter";
// // import UserPrivacyPolicy from "./pages/LandingPage/UserPolicies/UserPrivacyPolicy";
// // import UserRefundPolicy from "./pages/LandingPage/UserPolicies/UserRefundpolicy";
// // import UserTermsConditions from "./pages/LandingPage/UserPolicies/UserTermsConditions";

// // import LoginMobile from "./pages/LoginMobile";

// // Lazy-loaded components
// const Category = lazy(() => import("./pages/Category"));
// const SingleCategory = lazy(() =>
//   import("./pages/Category/components/SingleCategory")
// );
// const SingleProduct = lazy(() => import("./pages/Products/SingleProducts"));
// const SingleVendor = lazy(() =>
//   import("./pages/Vendors/components/SingleVendor")
// );
// const Signup = lazy(() => import("./pages/Signup"));
// const Login = lazy(() => import("./pages/Login"));
// const Bookings = lazy(() => import("./pages/Bookings"));
// const AboutUs = lazy(() => import("./pages/About"));
// const Wishlist = lazy(() => import("./pages/Wishlist"));
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

// // PrivateRoute Component
// const PrivateRoute = ({ isAuthenticated, children }) => {
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// // PublicRoute Component
// const PublicRoute = ({ isAuthenticated, children }) => {
//   return !isAuthenticated ? children : <Navigate to="/signup" />;
// };

// import FaqPage from "./pages/FaqPage";
// import Mood from "./pages/Mood";
// import OtpVerification from "./pages/OtpVerification";
// import ResetPassword from "./pages/ResentPassword";
// import GoogleAuth from "./pages/GoogleAuth";
// import RaiseTicket from "./pages/RaiseTicket";
// import MoodDetail from "./pages/Mood/MoodDetail";
// import GetTickets from "./pages/RaiseTicket/GetTickets";
// import Phonepe from "./components/Phonepe";
// import TicketDetails from "./pages/RaiseTicket/GetTickets/Components/TicketDetails";
// import ContactUs from "./pages/About/ContactUs";
// import HelpCenter from "./pages/About/HelpCenter";
// import PaymentStatus from "./pages/PaymentStatus";

// import PaymentSuccess from "./pages/PaymentSuccess";
// import PaymentFailed from "./pages/PaymentFailed";
// import OrderConfirmed from "./pages/OrderConfirmed";

// function App() {
//   const loading = useSelector((state) => state.loader.loading);
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

//   useReactFontLoader({
//     url: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
//   });

//   return (
//     <BrowserRouter>
//       <Loading loading={loading} />
//       <ScrollToTop />

//       <Box style={{ paddingTop: "4rem" }}>
//         <Suspense fallback={<Loading />}>
//           <PageHeader />
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home />} />
//             <Route
//               path="/signup"
//               element={
//                 // <PublicRoute isAuthenticated={isAuthenticated}>
//                 <Signup />
//                 // </PublicRoute>
//               }
//             />
//             <Route
//               path="/login"
//               element={
//                 // <PublicRoute isAuthenticated={isAuthenticated}>
//                 <Login />
//                 // </PublicRoute>
//               }
//             />
//             <Route
//               path="/forgotPassword"
//               element={
//                 // <PublicRoute isAuthenticated={isAuthenticated}>
//                 <ForgotPassword />
//                 // </PublicRoute>
//               }
//             />
//             <Route
//               path="/verify-otp"
//               element={
//                 // <PublicRoute isAuthenticated={isAuthenticated}>
//                 <OtpVerification />
//                 // </PublicRoute>
//               }
//             />
//             <Route
//               path="/reset-password"
//               element={
//                 // <PublicRoute isAuthenticated={isAuthenticated}>
//                 <ResetPassword />
//                 // </PublicRoute>
//               }
//             />
//             <Route
//               path="/sign-google"
//               element={
//                 // <PublicRoute isAuthenticated={isAuthenticated}>
//                 <GoogleAuth />
//                 // </PublicRoute>
//               }
//             />
//             <Route
//               path="/loginMobile"
//               element={
//                 // <PublicRoute isAuthenticated={isAuthenticated}>
//                 <LoginWithMobile />
//                 // </PublicRoute>
//               }
//             />
//             <Route
//               path="/raise-ticket/:bookingId"
//               element={
//                 // <PublicRoute isAuthenticated={isAuthenticated}>
//                 <RaiseTicket />
//                 //  </PublicRoute>
//               }
//             />
//             <Route
//               path="/ticket-details"
//               element={
//                 // <PublicRoute isAuthenticated={isAuthenticated}>
//                 <TicketDetails />
//                 //  </PublicRoute>
//               }
//             />
//             <Route path="/aboutUs" element={<AboutUs />} />
//             <Route path="/contact-us" element={<ContactUs />} />
//             <Route path="/help-center" element={<HelpCenter />} />
//             {/* Protected Routes */}
//             <Route
//               path="/category/:category"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <Category />
//                 // </PrivateRoute>
//               }
//             />
//             <Route
//               path="/calenders"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <Calendar />
//                 // </PrivateRoute>
//               }
//             />
//             <Route
//               path="/services"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <ServicePage />
//                 // </PrivateRoute>
//               }
//             />
//             <Route
//               path="/service/:serviceName"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <ServiceDetails />
//                 // </PrivateRoute>
//               }
//             />
//             <Route
//               path="/service/:serviceName/:id"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <SingleService />
//                 // </PrivateRoute>
//               }
//             />
//             <Route
//               path="/wishlist"
//               element={
//                 <PrivateRoute isAuthenticated={isAuthenticated}>
//                   <Wishlist />
//                 </PrivateRoute>
//               }
//             />
//             {/* <Route
//               path="/help-center"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <HelpCentre />
//                 // </PrivateRoute>
//               }
//             /> */}
//             <Route
//               path="/company"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <CompanyDetails />
//                 // </PrivateRoute>
//               }
//             />
//             <Route
//               path="/category/:category/:id"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <SingleCategory />
//                 // </PrivateRoute>
//               }
//             />
//             <Route
//               path="/categories"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <AllCategory />
//                 // </PrivateRoute>
//               }
//             />
//             <Route
//               path="/booking"
//               element={
//                 <PrivateRoute isAuthenticated={isAuthenticated}>
//                   <Bookings />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/booking/:id"
//               element={
//                 <PrivateRoute isAuthenticated={isAuthenticated}>
//                   <BookingDetails />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/products"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <Products />
//                 // </PrivateRoute>
//               }
//             />
//             <Route
//               path="/Featuredproducts"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <FeaturedProduct />
//                 // </PrivateRoute>
//               }
//             />
//             {/* <Route
//               path="/products/:id"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <SingleProduct />
//                 // </PrivateRoute>
//               }
//             /> */}
//             <Route
//               path="/products/:category/:productSlug"
//               element={<SingleProduct />}
//             />
//             <Route
//               path="/vendors"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <Vendors />
//                 // </PrivateRoute>
//               }
//             />
//             <Route
//               path="/cart"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <Cart />
//                 // </PrivateRoute>
//               }
//             />
//             <Route
//               path="/moodDetails/:id"
//               element={
//                 <PrivateRoute isAuthenticated={isAuthenticated}>
//                   <MoodDetail />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/phonepe"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <Phonepe />
//                 //  </PrivateRoute>
//               }
//             />
//             <Route
//               path="/mood-board"
//               element={
//                 <PrivateRoute isAuthenticated={isAuthenticated}>
//                   <Mood />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/my-tickets"
//               element={
//                 <PrivateRoute isAuthenticated={isAuthenticated}>
//                   <GetTickets />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/vendors/:id"
//               element={
//                 // <PrivateRoute isAuthenticated={isAuthenticated}>
//                 <SingleVendor />
//                 // </PrivateRoute>
//               }
//             />
//             <Route
//               path="/account"
//               element={
//                 <PrivateRoute isAuthenticated={isAuthenticated}>
//                   <Account />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/profile"
//               element={
//                 <PrivateRoute isAuthenticated={isAuthenticated}>
//                   <Profile />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/faq"
//               element={
//                 // <PublicRoute isAuthenticated={isAuthenticated}>
//                 <FaqPage />
//                 // </PublicRoute>
//               }
//             />
//             <Route path="/TermsAndCondition" element={<Toc />} />
//             <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
//             <Route path="/returnPolicy" element={<ReturnPolicy />} />

//             <Route path="/payment-success" element={<PaymentSuccess />} />
//             <Route path="/payment-failed" element={<PaymentFailed />} />
//             <Route path="/order-confirmed" element={<OrderConfirmed />} />

//             <Route path="/payment-status" element={<PaymentStatus />} />

//             <Route path="/landing-page" element={<LandingPage />} />
//             {/* <Route path="/Sound" element={<SoundHome />} /> */}
//             {/* <Route path="/projectpage" element={<ProjectPage />} /> */}
//             {/* <Route path="/about-us" element={<LandingAboutUs />} /> */}
//             {/* <Route path="/blog" element={<Blogs />} /> */}
//             {/* <Route path="/bangalore" element={<VendorBng />} /> */}
//             {/* <Route path="/how-to-choose-perfect-shamiana" element={<Blog1 />} /> */}
//             {/* <Route path="/how-to-book-fabric-rentals" element={<Blog2 />} /> */}
//             {/* <Route path="/how-task-management" element={<Blog3 />} /> */}
//             {/* <Route path="/power-up-your-big-day" element={<Blog4 />} /> */}
//             {/* <Route path="/best-event-photography" element={<Blog5 />} /> */}
//             {/* <Route path="/how-to-choose-perfect-lighting" element={<Blog6 />} /> */}
//             {/* <Route path="/partner-with-us" element={<PartnerWithUs />} /> */}
//             {/* <Route path="/privacy-policy" element={<LandingPrivacyPolicy />} /> */}
//             {/* <Route path="/terms-and-conditions" element={<TermsConditions />} /> */}
//             {/* <Route path="/refund-policy" element={<LandingRefundPolicy />} /> */}
//             {/* <Route
//               path="/help-center-landing"
//               element={<LandingHelpCenter />}
//             /> */}
//             {/* <Route path="/user-help-center" element={<UserHelpCenter />} /> */}
//             {/* <Route
//               path="/user-privacy-policy"
//               element={<UserPrivacyPolicy />}
//             /> */}
//             {/* <Route path="/user-refund-policy" element={<UserRefundPolicy />} /> */}
//             {/* <Route
//               path="/user-terms-and-conditions"
//               element={<UserTermsConditions />}
//             /> */}
//           </Routes>
//           <Footer />
//         </Suspense>
//       </Box>
//     </BrowserRouter>
//   );
// }

// export default App;
