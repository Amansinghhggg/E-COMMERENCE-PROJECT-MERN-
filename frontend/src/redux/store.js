import{configureStore} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import favoriteSlice from "./features/favorites/favoritesSlice";
import authReducer from "./features/auth/authSlice";
import { getFavoritesFromLocalStorage } from "../Utils/saveFavroitesLocalstorage";
import cartReducer, { getCartFromLocalStorage } from "./features/Cart/cartSlice";
import shopReducer from "./features/shop/shopSlice";
const initialFavorites = getFavoritesFromLocalStorage();
const initialCart = getCartFromLocalStorage();

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
     favorites: favoriteSlice,
     cart: cartReducer,
     shop: shopReducer,
    },
     preloadedState: {
    favorites: initialFavorites,
    cart: initialCart
  },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
        devTools:true
})

setupListeners(store.dispatch)

export default store;