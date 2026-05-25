import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import themeSlice from "./themeSlice.js";
import blogSlice from "./blogSlice.js"
import commentSlice from "./commentSlice.js"
import {
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
  persistStore, persistReducer,
} from "redux-persist";
import storage from "redux-persist/es/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],   // ✅ only persist auth, not theme
};

const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  blog:blogSlice,
  comment:commentSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;