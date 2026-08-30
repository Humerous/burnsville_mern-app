import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Rating from '../components/Rating';
import Meta from '../components/Meta';
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions';
import { addToCart } from '../actions/cartActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';
import './product-screen.css';

const priceFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatPrice = (price) => {
  const numericPrice = Number(price);

  return Number.isFinite(numericPrice)
    ? priceFormatter.format(numericPrice)
    : 'Price unavailable';
};

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartNotice, setCartNotice] = useState(false);
  const [cartError, setCartError] = useState('');
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector(
    (state) => state.productReviewCreate
  );
  const {
    success: successProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      alert('Review Submitted!');
      setRating(0);
      setComment('');
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match, successProductReview]);

  const addToCartHandler = async () => {
    setAddingToCart(true);
    setCartError('');

    try {
      await dispatch(addToCart(match.params.id, Number(qty)));
      setCartNotice(true);
    } catch (addError) {
      setCartError(
        addError && addError.response && addError.response.data
          ? addError.response.data.message || 'Unable to add this sauce to your cart.'
          : addError && addError.message
          ? addError.message
          : 'Unable to add this sauce to your cart.'
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    );
  };

  const pageTitle = loading
    ? 'Loading Product | Burnsville'
    : error
    ? 'Product Unavailable | Burnsville'
    : `${product.name} | Burnsville`;

  const reviews = product && Array.isArray(product.reviews)
    ? product.reviews
    : [];
  const stockCount = product ? Number(product.countInStock) || 0 : 0;
  const productRating = product ? Number(product.rating) || 0 : 0;
  const reviewLabel = `${reviews.length} ${
    reviews.length === 1 ? 'review' : 'reviews'
  }`;

  return (
    <section className='burnsville-product-detail'>
      <Meta
        title={pageTitle}
        description={
          !loading && !error && product.description
            ? product.description
            : 'Burnsville product detail.'
        }
      />

      {loading ? (
        <div
          className='burnsville-product-detail__state'
          role='status'
          aria-live='polite'
        >
          <span
            className='burnsville-product-detail__loader'
            aria-hidden='true'
          />
          <p className='burnsville-product-detail__state-label'>Product detail</p>
          <h1>Loading product</h1>
        </div>
      ) : error ? (
        <div
          className='burnsville-product-detail__state burnsville-product-detail__state--error'
          role='alert'
        >
          <p className='burnsville-product-detail__state-label'>Product unavailable</p>
          <h1>Unable to load this sauce</h1>
          <p className='burnsville-product-detail__state-message'>{error}</p>
          <Link className='burnsville-product-detail__state-link' to='/shop'>
            Return to all sauces
          </Link>
        </div>
      ) : (
        <>
          <article
            className='burnsville-product-detail__product'
            aria-labelledby='burnsville-product-title'
          >
            <div className='burnsville-product-detail__product-inner'>
              <nav
                className='burnsville-product-detail__breadcrumb'
                aria-label='Breadcrumb'
              >
                <Link to='/'>Home</Link>
                <span aria-hidden='true'>/</span>
                <Link to='/shop'>All sauces</Link>
                <span aria-hidden='true'>/</span>
                <span aria-current='page'>{product.name}</span>
              </nav>

              <div className='burnsville-product-detail__grid'>
                <div className='burnsville-product-detail__media'>
                  <div className='burnsville-product-detail__media-accent' />
                  <img src={product.image} alt={product.name} />
                </div>

                <div className='burnsville-product-detail__information'>
                  {(product.brand || product.category) && (
                    <p className='burnsville-product-detail__eyebrow'>
                      {[product.brand, product.category]
                        .filter(Boolean)
                        .join(' / ')}
                    </p>
                  )}

                  <h1 id='burnsville-product-title'>{product.name}</h1>

                  <div
                    className='burnsville-product-detail__rating'
                    role='img'
                    aria-label={`${productRating} out of 5 stars, ${reviewLabel}`}
                  >
                    <Rating
                      value={productRating}
                      text={reviewLabel}
                      color='#b8231b'
                    />
                  </div>

                  <p className='burnsville-product-detail__price'>
                    {formatPrice(product.price)}
                  </p>

                  <div className='burnsville-product-detail__description'>
                    <h2>Product details</h2>
                    <p>{product.description}</p>
                  </div>

                  <div className='burnsville-product-detail__purchase'>
                    <div className='burnsville-product-detail__availability'>
                      <span>Availability</span>
                      <strong
                        className={
                          stockCount > 0
                            ? 'burnsville-product-detail__in-stock'
                            : 'burnsville-product-detail__out-of-stock'
                        }
                        id='burnsville-product-stock'
                      >
                        {stockCount > 0 ? 'In stock' : 'Out of stock'}
                      </strong>
                    </div>

                    {stockCount > 0 && (
                      <div className='burnsville-product-detail__quantity'>
                        <label htmlFor='burnsville-product-quantity'>
                          Quantity
                        </label>
                        <select
                          id='burnsville-product-quantity'
                          value={qty}
                          onChange={(event) => setQty(event.target.value)}
                          aria-describedby='burnsville-product-stock'
                        >
                          {[...Array(stockCount).keys()].map((value) => (
                            <option key={value + 1} value={value + 1}>
                              {value + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button
                      className='burnsville-product-detail__cart-button'
                      onClick={addToCartHandler}
                      type='button'
                      disabled={stockCount === 0 || addingToCart}
                    >
                      {addingToCart ? 'Adding…' : 'Add to cart'}
                    </button>

                    {cartError && (
                      <p
                        className='burnsville-product-detail__cart-error'
                        role='alert'
                      >
                        {cartError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>

          <section
            className='burnsville-product-detail__reviews'
            aria-labelledby='burnsville-reviews-title'
          >
            <div className='burnsville-product-detail__reviews-inner'>
              <div className='burnsville-product-detail__reviews-heading'>
                <p className='burnsville-product-detail__eyebrow'>Customer feedback</p>
                <h2 id='burnsville-reviews-title'>Reviews</h2>
                <p>{reviewLabel}</p>
              </div>

              <div className='burnsville-product-detail__review-list'>
                {reviews.length === 0 ? (
                  <div className='burnsville-product-detail__empty-review'>
                    <h3>No reviews yet</h3>
                    <p>Be the first to review this product.</p>
                  </div>
                ) : (
                  reviews.map((review) => {
                    const reviewRating = Number(review.rating) || 0;

                    return (
                      <article
                        className='burnsville-product-detail__review'
                        key={review._id}
                      >
                        <div className='burnsville-product-detail__review-meta'>
                          <h3>{review.name}</h3>
                          {review.createdAt && (
                            <time dateTime={review.createdAt}>
                              {review.createdAt.substring(0, 10)}
                            </time>
                          )}
                        </div>
                        <div
                          className='burnsville-product-detail__review-rating'
                          role='img'
                          aria-label={`${reviewRating} out of 5 stars`}
                        >
                          <Rating
                            value={reviewRating}
                            text=''
                            color='#d98b21'
                          />
                        </div>
                        <p>{review.comment}</p>
                      </article>
                    );
                  })
                )}
              </div>

              <div className='burnsville-product-detail__review-form-panel'>
                <p className='burnsville-product-detail__eyebrow'>Share your view</p>
                <h2>Write a customer review</h2>

                {errorProductReview && (
                  <div
                    className='burnsville-product-detail__form-error'
                    role='alert'
                  >
                    {errorProductReview}
                  </div>
                )}

                {userInfo ? (
                  <form onSubmit={submitHandler}>
                    <div className='burnsville-product-detail__field'>
                      <label htmlFor='rating'>Rating</label>
                      <select
                        id='rating'
                        value={rating}
                        onChange={(event) => setRating(event.target.value)}
                      >
                        <option value='0'>Select a rating</option>
                        <option value='1'>1 - Poor</option>
                        <option value='2'>2 - Fair</option>
                        <option value='3'>3 - Good</option>
                        <option value='4'>4 - Very good</option>
                        <option value='5'>5 - Excellent</option>
                      </select>
                    </div>

                    <div className='burnsville-product-detail__field'>
                      <label htmlFor='comment'>Comment</label>
                      <textarea
                        id='comment'
                        rows='5'
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                      />
                    </div>

                    <button type='submit'>Submit review</button>
                  </form>
                ) : (
                  <p className='burnsville-product-detail__signin-message'>
                    Please <Link to='/login'>sign in</Link> to write a review.
                  </p>
                )}
              </div>
            </div>
          </section>

          {cartNotice && (
            <div
              className='burnsville-cart-notice'
              role='dialog'
              aria-modal='true'
              aria-labelledby='burnsville-cart-notice-title'
            >
              <div className='burnsville-cart-notice__panel'>
                <button
                  className='burnsville-cart-notice__close'
                  type='button'
                  onClick={() => setCartNotice(false)}
                  aria-label='Close added-to-cart confirmation'
                >
                  ×
                </button>
                <p className='burnsville-cart-notice__eyebrow'>Added to cart</p>
                <h2 id='burnsville-cart-notice-title'>{product.name}</h2>
                <p className='burnsville-cart-notice__message'>
                  {Number(qty)} {Number(qty) === 1 ? 'item has' : 'items have'} been added to your cart.
                </p>
                <div className='burnsville-cart-notice__actions'>
                  <button
                    type='button'
                    onClick={() => history.push('/cart')}
                  >
                    View cart
                  </button>
                  <button
                    type='button'
                    className='burnsville-cart-notice__continue'
                    onClick={() => setCartNotice(false)}
                  >
                    Continue shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

ProductScreen.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ProductScreen;
