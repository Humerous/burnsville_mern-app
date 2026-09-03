import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Rating from './Rating';
import { addToCart } from '../actions/cartActions';

const priceFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') {
    return 'Price unavailable';
  }

  const numericPrice = Number(price);

  return Number.isFinite(numericPrice)
    ? priceFormatter.format(numericPrice)
    : 'Price unavailable';
};

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [quickAddStatus, setQuickAddStatus] = useState('idle');
  const productPath = `/product/${product._id}`;
  const titleId = `product-${product._id}-title`;
  const numericRating = Number(product.rating);
  const rating = Number.isFinite(numericRating) ? numericRating : 0;
  const numericReviewCount = Number(product.numReviews);
  const reviewCount = Number.isFinite(numericReviewCount)
    ? numericReviewCount
    : 0;
  const reviewLabel = `${reviewCount} ${
    reviewCount === 1 ? 'review' : 'reviews'
  }`;
  const stockCount = Number(product.countInStock);
  const isInStock = !Number.isFinite(stockCount) || stockCount > 0;

  const quickAddHandler = async () => {
    setQuickAddStatus('adding');

    try {
      await dispatch(addToCart(product._id, 1));
      setQuickAddStatus('added');
    } catch (quickAddError) {
      setQuickAddStatus('error');
    }
  };

  return (
    <>
      <article className='shop-product-card' aria-labelledby={titleId}>
        <Link className='shop-product-card__media' to={productPath}>
          <img
            className='shop-product-card__image'
            src={product.image}
            alt={product.name}
            loading='lazy'
          />
        </Link>

        <div className='shop-product-card__body'>
          {product.brand && (
            <p className='shop-product-card__brand'>{product.brand}</p>
          )}

          <h2 className='shop-product-card__title' id={titleId}>
            <Link className='shop-product-card__title-link' to={productPath}>
              {product.name}
            </Link>
          </h2>

          <div
            className='shop-product-card__rating'
            role='img'
            aria-label={`${rating} out of 5 stars, ${reviewLabel}`}
          >
            <Rating
              value={rating}
              text={reviewLabel}
              color='#b8231b'
            />
          </div>

          <div className='shop-product-card__footer'>
            <p className='shop-product-card__price'>{formatPrice(product.price)}</p>
            <div className='shop-product-card__actions'>
              <Link
                className='shop-product-card__link'
                to={productPath}
                aria-label={`View ${product.name}`}
              >
                View sauce
              </Link>
              <button
                className='shop-product-card__quick-add'
                type='button'
                onClick={quickAddHandler}
                disabled={!isInStock || quickAddStatus === 'adding'}
                aria-label={`Quick add ${product.name} to cart`}
              >
                {!isInStock
                  ? 'Sold out'
                  : quickAddStatus === 'adding'
                  ? 'Adding…'
                  : 'Quick add'}
              </button>
            </div>
            {quickAddStatus === 'error' && (
              <p
                className='shop-product-card__quick-status shop-product-card__quick-status--error'
                role='alert'
              >
                Could not add. Try again.
              </p>
            )}
          </div>
        </div>
      </article>

      {quickAddStatus === 'added' && (
        <aside
          className='burnsville-cart-toast'
          role='status'
          aria-live='polite'
          aria-label='Added to cart'
        >
          <button
            className='burnsville-cart-toast__close'
            type='button'
            onClick={() => setQuickAddStatus('idle')}
            aria-label='Close added-to-cart message'
          >
            ×
          </button>
          <p className='burnsville-cart-toast__eyebrow'>Added to cart</p>
          <strong>{product.name}</strong>
          <div className='burnsville-cart-toast__actions'>
            <Link to='/cart'>View cart</Link>
            <button type='button' onClick={() => setQuickAddStatus('idle')}>
              Continue shopping
            </button>
          </div>
        </aside>
      )}
    </>
  );
};

Product.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    brand: PropTypes.string,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    numReviews: PropTypes.number,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number,
    countInStock: PropTypes.number,
  }).isRequired,
};

export default Product;
