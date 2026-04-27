import {createSlice} from '@reduxjs/toolkit';

export const getCartFromLocalStorage = () => {
    const cartJSON = localStorage.getItem('cart');

    return cartJSON
        ? JSON.parse(cartJSON)
        : {
              cartItems: [],
              shippingAddress: {},
              paymentMethod: 'PayPal',
          };
};

const saveCartToLocalStorage = (state) => {
    localStorage.setItem('cart', JSON.stringify(state));
};

const cartSlice = createSlice({
    name:'cart',
    initialState: {
        cartItems: [],
        shippingAddress: {},
         paymentMethod: 'PayPal',
    },
    reducers: {
        addToCart: (state, action) => {
         const { user, rating, numReviews, reviews, ...item } = action.payload;           
          const existItem = state.cartItems.find((x) => x._id === item._id);
            if (existItem) { 
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems.push(item);
            }
            saveCartToLocalStorage(state);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            saveCartToLocalStorage(state);
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            saveCartToLocalStorage(state);
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            saveCartToLocalStorage(state);
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cart');
        },
        resetCart: (state) => {
            state.cartItems = [];
        }
    },
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
