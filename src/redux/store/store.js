import { configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";
import loaderReducer from "../slice/LoaderSlice";
import locationReducer from "../slice/locationSlice";
import {
  persistedCartReducer,
  persistedAuthReducer,
  persistedDateReducer,
  persistedTechReducer,
  persistedServiceReducer,
} from "../persists/persistsReducer";

const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    loader: loaderReducer,
    auth: persistedAuthReducer,
    location: locationReducer,
    date: persistedDateReducer,
    services: persistedServiceReducer,
    technicians: persistedTechReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
