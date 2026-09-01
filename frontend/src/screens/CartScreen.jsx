import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Meta from '../components/Meta';
import { removeFromCart, setCartQuantity } from '../actions/cartActions';
import './cart-screen.css';

const formatPrice = (price) => `R${Number(price).toFixed(2)}`;
const roundCurrency = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;
  const dispatch = useDispatch();
  const [pendingRemoval, setPendingRemoval] = useState(null);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(setCartQuantity(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const confirmRemoveFromCart = () => {
    if (!pendingRemoval) {
      return;
    }

    dispatch(removeFromCart(pendingRemoval.product));
    setPendingRemoval(null);
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  const itemCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const subtotal = roundCurrency(
    cartItems.reduce((total, item) => total + item.qty * item.price, 0)
  );
  const shippingPrice = subtotal > 100 || subtotal === 0 ? 0 : 100;
  const vatPrice = roundCurrency(subtotal * 0.15);
  const estimatedTotal = roundCurrency(subtotal + shippingPrice + vatPrice);

  return (
    <section className='burnsville-cart' aria-labelledby='burnsville-cart-title'>
      <Meta
        title='Shopping Cart | Burnsville'
        description='Review the items in your Burnsville shopping cart.'
      />

      <header className='burnsville-cart__header'>
        <div className='burnsville-cart__header-inner'>
          <nav className='burnsville-cart__breadcrumb' aria-label='Breadcrumb'>
            <Link to='/'>Home</Link>
            <span aria-hidden='true'>/</span>
            <span aria-current='page'>Cart</span>
          </nav>
          <p className='burnsville-cart__eyebrow'>Your selection</p>
          <h1 id='burnsville-cart-title'>Shopping cart</h1>
          <p className='burnsville-cart__intro'>
            Review your items and quantities before checkout.
          </p>
        </div>
      </header>

      <div className='burnsville-cart__inner'>
        <div className='burnsville-cart__layout'>
          <div className='burnsville-cart__items-panel'>
            <div className='burnsville-cart__items-heading'>
              <h2>Cart items</h2>
              <span aria-live='polite'>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {cartItems.length === 0 ? (
              <div className='burnsville-cart__empty' role='status'>
                <p className='burnsville-cart__eyebrow'>Cart empty</p>
                <h2>Your cart is empty</h2>
                <p>Choose a sauce to begin your order.</p>
                <Link to='/'>Continue shopping</Link>
              </div>
            ) : (
              <ul className='burnsville-cart__items'>
                {cartItems.map((item) => (
                  <li className='burnsville-cart__item' key={item.product}>
                    <Link
                      className='burnsville-cart__item-image'
                      to={`/product/${item.product}`}
                    >
                      <img src={item.image} alt={item.name} />
                    </Link>

                    <div className='burnsville-cart__item-details'>
                      <p className='burnsville-cart__item-label'>Burnsville cart item</p>
                      <h2>
                        <Link to={`/product/${item.product}`}>
                          {item.name}
                        </Link>
                      </h2>
                      <p className='burnsville-cart__unit-price'>
                        {formatPrice(item.price)} each
                      </p>
                    </div>

                    <div className='burnsville-cart__quantity'>
                      <label htmlFor={`cart-quantity-${item.product}`}>
                        Quantity
                      </label>
                      <select
                        id={`cart-quantity-${item.product}`}
                        value={item.qty}
                        onChange={(event) =>
                          dispatch(
                            setCartQuantity(
                              item.product,
                              Number(event.target.value)
                            )
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((value) => (
                          <option key={value + 1} value={value + 1}>
                            {value + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='burnsville-cart__item-total'>
                      <span>Item total</span>
                      <strong>{formatPrice(item.qty * item.price)}</strong>
                    </div>

                    <button
                      className='burnsville-cart__remove'
                      type='button'
                      onClick={() => setPendingRemoval(item)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className='burnsville-cart__summary' aria-labelledby='cart-summary-title'>
            <p className='burnsville-cart__eyebrow'>Order total</p>
            <h2 id='cart-summary-title'>Summary</h2>

            <dl>
              <div>
                <dt>Items</dt>
                <dd>{itemCount}</dd>
              </div>
              <div>
                <dt>Items subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>{formatPrice(shippingPrice)}</dd>
              </div>
              <div>
                <dt>VAT (15%)</dt>
                <dd>{formatPrice(vatPrice)}</dd>
              </div>
              <div className='burnsville-cart__subtotal'>
                <dt>Estimated total</dt>
                <dd>{formatPrice(estimatedTotal)}</dd>
              </div>
            </dl>

            <button
              type='button'
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed to checkout
            </button>
          </aside>
        </div>
      </div>

      {pendingRemoval && (
        <div
          className='burnsville-cart-notice burnsville-cart-notice--remove'
          role='dialog'
          aria-modal='true'
          aria-labelledby='burnsville-remove-title'
        >
          <div className='burnsville-cart-notice__panel'>
            <button
              className='burnsville-cart-notice__close'
              type='button'
              onClick={() => setPendingRemoval(null)}
              aria-label='Close remove-item confirmation'
            >
              ×
            </button>
            <p className='burnsville-cart-notice__eyebrow'>Remove from cart</p>
            <h2 id='burnsville-remove-title'>Remove this sauce?</h2>
            <p className='burnsville-cart-notice__message'>
              {pendingRemoval.name} will be removed from your cart.
            </p>
            <div className='burnsville-cart-notice__actions'>
              <button type='button' onClick={confirmRemoveFromCart}>
                Remove item
              </button>
              <button
                type='button'
                className='burnsville-cart-notice__continue'
                onClick={() => setPendingRemoval(null)}
              >
                Keep item
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

CartScreen.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default CartScreen;
