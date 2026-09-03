import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Loader from '../Loader';
import Message from '../Message';
import { addToCart } from '../../actions/cartActions';
import './home-product-showcase.css';

const formatPrice = (price) => `R${Number(price || 0).toFixed(2)}`;

const ProductRating = ({ value, count }) => {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));

  return (
    <div
      className='home-product-card__rating'
      aria-label={`${rating} out of 5 stars${
        count ? ` from ${count} reviews` : ''
      }`}
    >
      <span aria-hidden='true'>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            className={star <= Math.round(rating) ? 'is-filled' : ''}
            key={star}
          >
            ★
          </span>
        ))}
      </span>
      {count > 0 && <span className='home-product-card__review-count'>({count})</span>}
    </div>
  );
};

ProductRating.propTypes = {
  value: PropTypes.number,
  count: PropTypes.number,
};

const HomeProductCard = ({ product, featured, quickAddStatus, onQuickAdd }) => {
  const stockCount = Number(product.countInStock);
  const isInStock = !Number.isFinite(stockCount) || stockCount > 0;
  const isAdding = quickAddStatus === 'adding';
  const hasError = quickAddStatus === 'error';

  return (
    <article
      className={`home-product-card${featured ? ' home-product-card--featured' : ''}`}
    >
      <Link
        className='home-product-card__image-link'
        to={`/product/${product._id}`}
        aria-label={`View ${product.name}`}
      >
        <img
          className='home-product-card__image'
          src={product.image}
          alt={product.name}
          loading='lazy'
        />
      </Link>
      <div className='home-product-card__body'>
        {product.brand && (
          <p className='home-product-card__brand'>{product.brand}</p>
        )}
        <h3 className='home-product-card__name'>
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        <ProductRating value={product.rating} count={product.numReviews} />
        <div className='home-product-card__footer'>
          <p className='home-product-card__price'>{formatPrice(product.price)}</p>
          <div className='home-product-card__actions'>
            <Link
              className='home-product-card__cta'
              to={`/product/${product._id}`}
              aria-label={`View ${product.name}`}
            >
              View sauce
            </Link>
            <button
              className='home-product-card__quick-add'
              type='button'
              onClick={() => onQuickAdd(product)}
              disabled={!isInStock || isAdding}
              aria-label={`Quick add ${product.name} to cart`}
            >
              {!isInStock ? 'Sold out' : isAdding ? 'Adding…' : 'Quick add'}
            </button>
          </div>
          {hasError && (
            <p
              className='home-product-card__quick-status home-product-card__quick-status--error'
              role='alert'
            >
              Could not add. Try again.
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

HomeProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    brand: PropTypes.string,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number,
    numReviews: PropTypes.number,
    countInStock: PropTypes.number,
  }).isRequired,
  featured: PropTypes.bool,
  quickAddStatus: PropTypes.oneOf(['idle', 'adding', 'added', 'error']),
  onQuickAdd: PropTypes.func.isRequired,
};

HomeProductCard.defaultProps = {
  quickAddStatus: 'idle',
};

const HomeProductShowcase = ({ loading, error, products }) => {
  const dispatch = useDispatch();
  const [quickAdd, setQuickAdd] = useState({
    productId: '',
    productName: '',
    status: 'idle',
  });
  const showcaseProducts = products.slice(0, 4);

  useEffect(() => {
    if (quickAdd.status !== 'added') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setQuickAdd({ productId: '', productName: '', status: 'idle' });
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [quickAdd.status]);

  const quickAddHandler = async (product) => {
    setQuickAdd({
      productId: product._id,
      productName: product.name,
      status: 'adding',
    });

    try {
      await dispatch(addToCart(product._id, 1));
      setQuickAdd({
        productId: product._id,
        productName: product.name,
        status: 'added',
      });
    } catch (quickAddError) {
      setQuickAdd({
        productId: product._id,
        productName: product.name,
        status: 'error',
      });
    }
  };

  const closeQuickAdd = () => {
    setQuickAdd({ productId: '', productName: '', status: 'idle' });
  };

  return (
    <section
      className='home-product-showcase'
      aria-labelledby='home-product-showcase-title'
    >
      <div className='home-product-showcase__inner'>
        <header className='home-product-showcase__intro'>
          <p className='home-product-showcase__eyebrow'>The sauce line-up</p>
          <h2 id='home-product-showcase-title'>Find your next heat</h2>
          <p className='home-product-showcase__summary'>
            Browse the current catalogue by name, rating and price.
          </p>
          <Link className='home-product-showcase__all-link' to='/shop'>
            View all sauces <span aria-hidden='true'>→</span>
          </Link>
        </header>

        <div className='home-product-showcase__content' aria-live='polite'>
          {loading ? (
            <div className='home-product-showcase__status'>
              <Loader />
            </div>
          ) : error ? (
            <div className='home-product-showcase__status'>
              <Message variant='danger'>{error}</Message>
            </div>
          ) : showcaseProducts.length ? (
            <div className='home-product-showcase__grid'>
              {showcaseProducts.map((product, index) => (
                <HomeProductCard
                  key={product._id}
                  product={product}
                  featured={index === 3}
                  quickAddStatus={
                    quickAdd.productId === product._id ? quickAdd.status : 'idle'
                  }
                  onQuickAdd={quickAddHandler}
                />
              ))}
            </div>
          ) : (
            <p className='home-product-showcase__empty'>
              The sauce catalogue is currently empty.
            </p>
          )}
        </div>
      </div>

      {quickAdd.status === 'added' && (
        <aside
          className='burnsville-cart-toast'
          role='status'
          aria-live='polite'
          aria-label='Added to cart'
        >
          <button
            className='burnsville-cart-toast__close'
            type='button'
            onClick={closeQuickAdd}
            aria-label='Close added-to-cart message'
          >
            ×
          </button>
          <p className='burnsville-cart-toast__eyebrow'>Added to cart</p>
          <strong>{quickAdd.productName}</strong>
          <div className='burnsville-cart-toast__actions'>
            <Link to='/cart'>View cart</Link>
            <button type='button' onClick={closeQuickAdd}>
              Continue shopping
            </button>
          </div>
        </aside>
      )}
    </section>
  );
};

HomeProductShowcase.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.object),
};

HomeProductShowcase.defaultProps = {
  loading: false,
  error: '',
  products: [],
};

export default HomeProductShowcase;
