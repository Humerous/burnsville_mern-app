import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Rating from './Rating';

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

  return (
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
          <Link
            className='shop-product-card__link'
            to={productPath}
            aria-label={`View ${product.name}`}
          >
            View sauce
          </Link>
        </div>
      </div>
    </article>
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
  }).isRequired,
};

export default Product;
