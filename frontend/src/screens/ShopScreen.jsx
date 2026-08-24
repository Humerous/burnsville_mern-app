import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Meta from '../components/Meta';
import Paginate from '../components/Paginate';
import Product from '../components/Product';
import { listProducts } from '../actions/productActions';
import './shop-screen.css';

const ShopScreen = ({ match }) => {
  const keyword = match.params.keyword || '';
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const {
    loading,
    error,
    products = [],
    page = Number(pageNumber),
    pages = 0,
  } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  const retryProducts = () => {
    dispatch(listProducts(keyword, pageNumber));
  };

  const hasSearch = Boolean(keyword);
  const pageTitle = hasSearch
    ? `Search results for ${keyword} | Burnsville`
    : 'All Sauces | Burnsville';
  const pageDescription = hasSearch
    ? `Browse Burnsville catalogue results for ${keyword}.`
    : 'Browse the current Burnsville hot sauce catalogue.';

  return (
    <>
      <Meta
        title={pageTitle}
        description={pageDescription}
        keywords='Burnsville, hot sauce, sauce catalogue'
      />

      <section className='burnsville-shop' aria-labelledby='burnsville-shop-title'>
        <div className='burnsville-shop__masthead'>
          <div className='burnsville-shop__masthead-inner'>
            <nav className='burnsville-shop__breadcrumb' aria-label='Breadcrumb'>
              <Link to='/'>Home</Link>
              <span aria-hidden='true'>/</span>
              <span aria-current='page'>{hasSearch ? 'Search' : 'Shop'}</span>
            </nav>

            <p className='burnsville-shop__eyebrow'>Burnsville collection</p>
            <h1 id='burnsville-shop-title'>
              {hasSearch ? 'Search results' : 'All sauces'}
            </h1>
            <p className='burnsville-shop__summary'>
              {hasSearch
                ? `Showing catalogue matches for “${keyword}”.`
                : 'Explore the current range by name, rating and price.'}
            </p>
          </div>
        </div>

        <div className='burnsville-shop__inner'>
          <div className='burnsville-shop__toolbar'>
            <p aria-live='polite'>
              {!loading && !error
                ? `${products.length} ${
                    products.length === 1 ? 'sauce' : 'sauces'
                  } on this page`
                : 'Catalogue listing'}
            </p>
            <p>
              Page {page || 1}
              {pages > 0 ? ` of ${pages}` : ''}
            </p>
            {hasSearch && (
              <Link className='burnsville-shop__clear-link' to='/shop'>
                Clear search <span aria-hidden='true'>→</span>
              </Link>
            )}
          </div>

          <div className='burnsville-shop__content'>
            {loading ? (
              <div className='burnsville-shop__state' role='status'>
                <span className='burnsville-shop__loader' aria-hidden='true' />
                <p className='burnsville-shop__state-label'>Loading collection</p>
                <h2>Bringing the sauces into view</h2>
              </div>
            ) : error ? (
              <div
                className='burnsville-shop__state burnsville-shop__state--error'
                role='alert'
              >
                <p className='burnsville-shop__state-label'>Collection unavailable</p>
                <h2>Unable to load sauces</h2>
                <p className='burnsville-shop__state-message'>{error}</p>
                <button onClick={retryProducts} type='button'>
                  Try again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className='burnsville-shop__state'>
                <p className='burnsville-shop__state-label'>Nothing to show</p>
                <h2>
                  {hasSearch ? 'No sauces found' : 'The collection is currently empty'}
                </h2>
                <p className='burnsville-shop__state-message'>
                  {hasSearch
                    ? 'Try another search or return to the complete catalogue.'
                    : 'Please check the catalogue again later.'}
                </p>
                {hasSearch && (
                  <Link className='burnsville-shop__state-link' to='/shop'>
                    View all sauces
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className='burnsville-shop__grid'>
                  {products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>

                {pages > 1 && (
                  <nav
                    className='burnsville-shop__pagination'
                    aria-label='Product pages'
                  >
                    <Paginate
                      pages={pages}
                      page={page}
                      keyword={keyword}
                    />
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

ShopScreen.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      keyword: PropTypes.string,
      pageNumber: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default ShopScreen;
