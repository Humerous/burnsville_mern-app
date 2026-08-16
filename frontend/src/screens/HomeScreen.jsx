import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { listProducts } from '../actions/productActions';

// <---- HOME SCREEN FUNCTION - location, history, dispatch, setEmail, setPassword ---->
const HomeScreen = ({ match }) => {
  // <---- HOME - keyword by params---->
  const keyword = match.params.keyword;

  // <---- HOME - pageNumber by params---->
  const pageNumber = match.params.pageNumber || 1;

  // <---- HOME - dispatch state ---->
  const dispatch = useDispatch();

  // <---- HOME - productList state ---->
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  // <---- HOME EFFECT FOR USER INFO - keyword, pageNumber   ---->
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-warning'>
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

// <---- EXPORT ---->
export default HomeScreen;
