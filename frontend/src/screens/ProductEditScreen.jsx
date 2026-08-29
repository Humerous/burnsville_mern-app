import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import './admin-product-edit.css';

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push('/admin/productlist');
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, history, productId, product, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!userInfo || !userInfo.token) {
      setUploadError('Admin authentication is required to upload images');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    setUploadError('');
    setUploading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);

      setImage(data);
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      setUploadError(message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    );
  };

  return (
    <section
      className='burnsville-admin-product-edit'
      aria-labelledby='admin-product-edit-title'
    >
      <Meta
        title='Edit Product | Burnsville'
        description='Update a product in the Burnsville catalogue.'
      />

      <div className='burnsville-admin-product-edit__inner'>
        <Link
          className='burnsville-admin-product-edit__back-link'
          to='/admin/productlist'
        >
          Back to products
        </Link>

        <header className='burnsville-admin-product-edit__header'>
          <div>
            <p className='burnsville-admin-product-edit__eyebrow'>
              Admin workspace
            </p>
            <h1 id='admin-product-edit-title'>Edit product</h1>
            <p>Update catalogue information and product imagery.</p>
          </div>
          <span className='burnsville-admin-product-edit__reference'>
            ID {productId}
          </span>
        </header>

        <section
          className='burnsville-admin-product-edit__panel'
          aria-labelledby='admin-product-details-title'
        >
          <div className='burnsville-admin-product-edit__panel-heading'>
            <div>
              <p className='burnsville-admin-product-edit__section-number'>
                01
              </p>
              <h2 id='admin-product-details-title'>Product details</h2>
            </div>
            <span>Catalogue administration</span>
          </div>

          <div className='burnsville-admin-product-edit__panel-body'>
            {loadingUpdate && (
              <div
                className='burnsville-admin-product-edit__inline-loader'
                aria-label='Updating product'
              >
                <Loader />
              </div>
            )}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

            {loading ? (
              <div
                className='burnsville-admin-product-edit__state'
                aria-label='Loading product'
              >
                <Loader />
              </div>
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : (
              <form
                className='burnsville-admin-product-edit__form'
                onSubmit={submitHandler}
              >
                <fieldset className='burnsville-admin-product-edit__group'>
                  <legend>
                    <span>01</span>
                    Product information
                  </legend>

                  <div className='burnsville-admin-product-edit__field burnsville-admin-product-edit__field--wide'>
                    <label htmlFor='admin-product-name'>Name</label>
                    <input
                      id='admin-product-name'
                      type='name'
                      placeholder='Enter name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className='burnsville-admin-product-edit__field'>
                    <label htmlFor='admin-product-brand'>Brand</label>
                    <input
                      id='admin-product-brand'
                      type='text'
                      placeholder='Enter brand'
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>

                  <div className='burnsville-admin-product-edit__field'>
                    <label htmlFor='admin-product-category'>Category</label>
                    <input
                      id='admin-product-category'
                      type='text'
                      placeholder='Enter category'
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>

                  <div className='burnsville-admin-product-edit__field'>
                    <label htmlFor='admin-product-price'>Price</label>
                    <input
                      id='admin-product-price'
                      type='number'
                      placeholder='Enter price'
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className='burnsville-admin-product-edit__field'>
                    <label htmlFor='admin-product-stock'>Count in stock</label>
                    <input
                      id='admin-product-stock'
                      type='number'
                      placeholder='Enter countInStock'
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    />
                  </div>

                  <div className='burnsville-admin-product-edit__field burnsville-admin-product-edit__field--wide'>
                    <label htmlFor='admin-product-description'>Description</label>
                    <input
                      id='admin-product-description'
                      type='text'
                      placeholder='Enter description'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </fieldset>

                <fieldset className='burnsville-admin-product-edit__group'>
                  <legend>
                    <span>02</span>
                    Product image
                  </legend>

                  <div className='burnsville-admin-product-edit__field burnsville-admin-product-edit__field--wide'>
                    <label htmlFor='admin-product-image'>Image</label>
                    <input
                      id='admin-product-image'
                      type='text'
                      placeholder='Enter image url'
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </div>

                  <div className='burnsville-admin-product-edit__upload burnsville-admin-product-edit__field--wide'>
                    <label htmlFor='image-file'>Choose file</label>
                    <input
                      id='image-file'
                      type='file'
                      accept='image/jpeg,image/png'
                      onChange={uploadFileHandler}
                    />
                    <span>Upload a JPEG or PNG image up to 5 MB.</span>
                  </div>

                  {uploading && (
                    <div
                      className='burnsville-admin-product-edit__upload-loader burnsville-admin-product-edit__field--wide'
                      aria-label='Uploading image'
                    >
                      <Loader />
                    </div>
                  )}
                  {uploadError && (
                    <div className='burnsville-admin-product-edit__field--wide'>
                      <Message variant='danger'>{uploadError}</Message>
                    </div>
                  )}
                </fieldset>

                <div className='burnsville-admin-product-edit__actions'>
                  <button type='submit'>Update product</button>
                  <Link to='/admin/productlist'>Cancel</Link>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default ProductEditScreen;
