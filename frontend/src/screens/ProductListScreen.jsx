import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import Paginate from '../components/Paginate';
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import './admin-product-list.css';

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login');
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts('', pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <section
      className='burnsville-admin-products'
      aria-labelledby='admin-products-title'
    >
      <Meta
        title='Admin Products | Burnsville'
        description='Manage the Burnsville product catalogue.'
      />

      <div className='burnsville-admin-products__inner'>
        <header className='burnsville-admin-products__header'>
          <div>
            <p className='burnsville-admin-products__eyebrow'>Admin workspace</p>
            <h1 id='admin-products-title'>Products</h1>
            <p>Review and maintain the current product catalogue.</p>
          </div>

          <button
            className='burnsville-admin-products__create'
            onClick={createProductHandler}
            type='button'
          >
            Create product
          </button>
        </header>

        <div className='burnsville-admin-products__notices' aria-live='polite'>
          {loadingDelete && (
            <div className='burnsville-admin-products__inline-loader' aria-label='Deleting product'>
              <Loader />
            </div>
          )}
          {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
          {loadingCreate && (
            <div className='burnsville-admin-products__inline-loader' aria-label='Creating product'>
              <Loader />
            </div>
          )}
          {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
        </div>

        <section
          className='burnsville-admin-products__panel'
          aria-labelledby='admin-product-directory-title'
        >
          <div className='burnsville-admin-products__panel-heading'>
            <div>
              <p className='burnsville-admin-products__section-number'>01</p>
              <h2 id='admin-product-directory-title'>Product directory</h2>
            </div>
            {!loading && !error && (
              <span>
                {products.length} {products.length === 1 ? 'product' : 'products'}
                {pages > 1 ? ` · page ${page} of ${pages}` : ''}
              </span>
            )}
          </div>

          <div className='burnsville-admin-products__panel-body'>
            {loading ? (
              <div className='burnsville-admin-products__state' aria-label='Loading products'>
                <Loader />
              </div>
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : products.length === 0 ? (
              <div className='burnsville-admin-products__empty'>
                <p className='burnsville-admin-products__eyebrow'>Product directory</p>
                <h3>No products found</h3>
                <p>Products will appear here when available.</p>
              </div>
            ) : (
              <div className='burnsville-admin-products__table-wrap'>
                <table className='burnsville-admin-products__table'>
                  <thead>
                    <tr>
                      <th scope='col'>ID</th>
                      <th scope='col'>Name</th>
                      <th scope='col'>Price</th>
                      <th scope='col'>Category</th>
                      <th scope='col'>Brand</th>
                      <th scope='col'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td
                          className='burnsville-admin-products__id'
                          data-label='ID'
                          title={product._id}
                        >
                          {product._id}
                        </td>
                        <td data-label='Name'>{product.name}</td>
                        <td data-label='Price'>${product.price}</td>
                        <td data-label='Category'>{product.category}</td>
                        <td data-label='Brand'>{product.brand}</td>
                        <td
                          className='burnsville-admin-products__actions'
                          data-label='Actions'
                        >
                          <Link
                            className='burnsville-admin-products__action burnsville-admin-products__action--edit'
                            to={`/admin/product/${product._id}/edit`}
                            aria-label={`Edit ${product.name}`}
                          >
                            Edit
                          </Link>
                          <button
                            className='burnsville-admin-products__action burnsville-admin-products__action--delete'
                            onClick={() => deleteHandler(product._id)}
                            type='button'
                            aria-label={`Delete ${product.name}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {!loading && !error && (
          <nav className='burnsville-admin-products__pagination' aria-label='Product list pages'>
            <Paginate pages={pages} page={page} isAdmin={true} />
          </nav>
        )}
      </div>
    </section>
  );
};

export default ProductListScreen;
