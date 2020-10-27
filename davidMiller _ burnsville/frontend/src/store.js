import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  productListReducer,
  producDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
} from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from './reducers/userReducers';
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListMyReducer,
  orderListReducer,
  orderDeliverReducer,
} from './reducers/orderReducers';

// <---- IMPORT REDUCERS - imports products, orders , cart , reviews , users, ---->
const reducer = combineReducers({
  productList: productListReducer,
  productDetails: producDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
  orderDeliver: orderDeliverReducer,
});

// <---- CART ITEMS REDUCERS - cart ---->
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? // <----  ITEMS - items in cart - saved to local storage ---->
    JSON.parse(localStorage.getItem('cartItems'))
  : [];

// <---- USER INFO REDUCERS - cart ---->
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? // <----  ITEMS - items in cart - saved to local storage ---->
    JSON.parse(localStorage.getItem('userInfo'))
  : null;
// <---- SHIPPING INFO REDUCERS - cart ---->
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? // <----  ITEMS - items in cart - saved to local storage ---->
    JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

// <---- USER INFO REDUCERS - initialState ---->
const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
};

// <---- USER INFO REDUCERS - REDUX THUNK ---->
const middleware = [thunk];

// <---- USER INFO REDUCERS - REDUX STORE ---->
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// <----EXPORT ---->
export default store;
