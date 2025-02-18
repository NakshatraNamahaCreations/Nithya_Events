import api from "./api.js";
import { config } from "./config.js";

const authService = {
  // User Authentication & Profile
  registerUser: (payload) => api.post(config.USER_REGISTER, payload),
  loginUser: (payload) => api.post(config.USER_LOGIN, payload),
  getUserProfile: (userId) => api.get(`${config.GET_USER_PROFILE}${userId}`),
  addAddress: (userId, data) => api.put(`${config.ADD_ADDRESS}${userId}`, data),
  loginWithMobile: (payload) => api.post(config.LOGIN_WITH_MOBILE, payload),

  // Company Details
  updateUserProfile: (userId, data) =>
    api.put(`${config.UPDATE_USER_PROFILE}${userId}`, data),
  getCompanyDetail: (userId) =>
    api.get(`${config.GET_COMPANY_PROFILE}${userId}`),

  // updateUserProfile:(userId) => api.put(`${config.UPDATE_USER_PROFILE}`,userId),

  // Order Management
  createOrder: (data) => api.post(config.CREATE_ORDER, data),
  getOrder: (orderId) => api.get(`${config.GET_ORDER_BY_ORDER_ID}${orderId}`),
  cancelOrder: (orderId) => api.put(`${config.CANCEL_ORDER}${orderId}`),
  rescheduleOrder: (orderId, data) =>
    api.put(`${config.RESCHEDULE_ORDER}${orderId}`, data),

  // My booking Section
  getUserOrder: (userId) => api.get(`${config.USER_ORDER}${userId}`),

  // Services
  getAllServices: () => api.get(config.GET_ALL_SERVICE),
  getService: (service) =>
    api.get(`${config.GET_SERVICES_BY_SERVICE_NAME}/${service}`),

  // Product Section
  rentalProduct: () => api.get(`${config.GET_RENTAL_PRODUCTS}`),
  relatedRentalProduct: (category) =>
    api.get(`${config.GET_RENTAL_PRODUCTS}?category=${category}?limit=4`),
  singleProduct: (id) => api.get(`${config.GET_SINGLE_PRODUCT}${id}`),

  // Services
  getServices: () => api.get(`${config.GET_ALL_SERVICE}`),
  getParticularService: (serviceId) =>
    api.get(`${config.GET_PARTICULAR_SERVICE}${serviceId}`),
  writeServiceReview: (payload, serviceId) =>
    api.put(`${config.WRITE_VENDORS_REVIEW}${serviceId}`, payload),
  getServiceReview: (serviceId) =>
    api.get(`${config.GET_SERVICE_REVIEW}${serviceId}`),

  // Featured section
  featuredProducts: () => api.get(`${config.GET_FEATURED_PRODUCTS}?limit=4`),
  allFeaturedProducts: () => api.get(`${config.GET_FEATURED_PRODUCTS}`),

  // Faq section
  getFaq: () => api.get(`${config.GET_ALL_FAQ}`),

  //Terms and condition
  getToc: () => api.get(`${config.TERMS_AND_CONDTION}`),
  //  Review section
  reviewProduct: (payload, productId) =>
    api.put(`${config.WRITE_A_REVIEW}${productId}`, payload),
  getReview: (productId) => api.get(`${config.GET_REVIEW}${productId}`),

  // Vendor Section
  vendorLists: () => api.get(`${config.GET_ALL_PRODUCT_VENDOR}`),
  getVendorProfile: (vendorId) =>
    api.get(`${config.GET_VENDOR_PROFILE}${vendorId}`),
  getParticularVendorProduct: (vendorId) =>
    api.get(`${config.GET_PARTICULAR_VENDOR_PRODUCTS}/${vendorId}`),
  writeVendorReview: (payload, vendorId) =>
    api.put(`${config.WRITE_VENDORS_REVIEW}${vendorId}`, payload),

  // Banner
  getYoutube: () => api.get(`${config.GET_YOUTUBE_VIDEO_LINK}`),
  getAllBanner: () => api.get(`${config.GET_ALL_BANNERS}`),
  getAllTechnicians: () => api.get(`${config.GET_ALL_TECHNICIAN}`),
};

export default authService;
