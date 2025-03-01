export const config = {
  BASEURL: "https://api.nithyaevent.com/api",
  IMAGEURL: "https://api.nithyaevent.com/",

  // BASEURL: "http://192.168.1.103:9000/api",
  // IMAGEURL: "http://192.168.1.103:9000/",

  // USER
  USER_REGISTER: "/user/user-register",
  USER_LOGIN: "/user/user-login",
  LOGIN_WITH_MOBILE: "/user/login-with-mobile-number",
  UPDATE_USER_PROFILE: "/user/update-profile/",
  GET_USER_PROFILE: "/user/get-user-profile/",
  USER_ORDER: "/user-order/get-a-order/",
  ADD_ADDRESS: "/user/save-delivery-address/",
  VENDOR_LOGOUT: "/user/delete-vendor-profile/",
  RESEND_OTP: "/user/re-sent-otp",
  VERIFY_OTP: "/user/verify-otp",

  // VENDOR
  GET_ALL_PRODUCT_VENDOR: "/vendor/get-product-vendor",
  GET_VENDOR_PROFILE: "/vendor/getprofile/",
  GET_SERVICES_BY_SERVICE_NAME: "/vendor/get-vendor-by-servicename",

  // Featured Products
  GET_FEATURED_PRODUCTS: "/product/getfeaturedproducts",

  // Product
  GET_RENTAL_PRODUCTS: "/product/getrentalproduct",
  GET_PARTICULAR_VENDOR_PRODUCTS: "/product/get-particular-vendor-products",
  GET_SINGLE_PRODUCT: "/product/getproduct/",
  GET_REVIEW: "/product/getreview/",
  WRITE_A_REVIEW: "/product/review/",

  // SERVICE
  GET_ALL_SERVICE: "/service/get-all-service",
  GET_SERVICE_BY_SERVICE_NAME: "/vendor/get-vendor-by-servicename/",
  GET_PARTICULAR_SERVICE: "/vendor/getprofile/",

  // SERVICE REVIEW
  GET_SERVICE_REVIEW: "/vendor/get-service-review/",
  WRITE_VENDORS_REVIEW: "/vendor/write-review/",

  // BOOKING
  CANCEL_ORDER: "/api/user-order/cancel-order/",

  //Wishlist
  ADD_WISHLIST: "/api/wishlist/add-wishlist/",

  // ORDER
  CREATE_ORDER: "/user-order/create-order",
  RESCHEDULE_ORDER: "/user-order/reschedule-order/",
  GET_ORDER: "/user-order/getallorder",
  GET_USER_ORDER: "/user-order/get-a-order/",
  GET_ORDER_BY_ORDER_ID: "/user-order/get-order-by-order-id/",
  CANCEL_ORDER: "/user-order/cancel-order/",
  RETURN_ORDER: "/user-order/return-order/",
  UPDATING_EVENT_STATUS: "/user-order/raise-ticket/",

  // BANNER
  GET_ALL_BANNERS: "/banners/get-all-banners",
  GET_YOUTUBE_VIDEO_LINK: "/youtube/get-active-youtube-links",
  GET_ALL_TECHNICIAN: "/technician/get-all-technician",

  // TICKET
  CREATE_TICKET: "/ticket/create-ticket",
  GET_TICKET_BY_ID: "/ticket/get-ticket-by-id/",

  // COMPANY DETAILS
  GET_PAYOUT_CONFIG: "/payout-config/get-payout-config-profile",
  GET_PROFILE: "/company-profile/get-profile",
  GET_COMPANY_PROFILE: "/user/get-user-profile/",

  // FAQ
  GET_ALL_FAQ: "/faq/get-all-faq",

  //Terms and condition
  TERMS_AND_CONDTION: "/user-tnc/get-all-tnc-user",
};
