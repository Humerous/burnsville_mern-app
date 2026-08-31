import axios from 'axios';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstants';

const writeCartItem = async (id, qty, increment, dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);
  const requestedQty = Number(qty);

  if (!Number.isInteger(requestedQty) || requestedQty <= 0) {
    throw new Error('Cart quantity must be a positive whole number');
  }

  const existingItem = getState().cart.cartItems.find(
    (item) => item.product === data._id
  );
  const existingQty = existingItem ? Number(existingItem.qty) || 0 : 0;
  const nextQty = increment ? existingQty + requestedQty : requestedQty;
  const stockCount = Number(data.countInStock);

  if (Number.isFinite(stockCount) && nextQty > stockCount) {
    throw new Error(`Only ${stockCount} item${stockCount === 1 ? '' : 's'} available`);
  }

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty: nextQty,
    },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
  return nextQty;
};

// Add from product cards/details: repeated adds increase the existing quantity.
export const addToCart = (id, qty) => async (dispatch, getState) =>
  writeCartItem(id, qty, true, dispatch, getState);

// Set an absolute quantity from the cart quantity selector / legacy cart route.
export const setCartQuantity = (id, qty) => async (dispatch, getState) =>
  writeCartItem(id, qty, false, dispatch, getState);

// <---- CART FUNCTION  _ removeFromCart ---->
export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// <---- CART FUNCTION _ saveShippingAddress ---->
export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

// <---- CART FUNCTION _ savePaymentMethod ---->
export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem('paymentMethod', JSON.stringify(data));
};
