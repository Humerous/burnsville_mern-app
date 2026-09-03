import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ShopScreen from './screens/ShopScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';

const DIALOG_SELECTOR = '.burnsville-cart-notice[role="dialog"]';
const DIALOG_FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const DialogAccessibilityManager = () => {
  useEffect(() => {
    let activeDialog = null;
    let returnFocusElement = null;
    let previousOverflow = '';
    let focusFrame = null;

    const deactivateDialog = () => {
      if (!activeDialog) {
        return;
      }

      if (focusFrame !== null) {
        window.cancelAnimationFrame(focusFrame);
        focusFrame = null;
      }

      document.body.style.overflow = previousOverflow;
      activeDialog = null;

      if (
        returnFocusElement &&
        document.contains(returnFocusElement) &&
        typeof returnFocusElement.focus === 'function'
      ) {
        returnFocusElement.focus();
      }

      returnFocusElement = null;
    };

    const activateDialog = (dialog) => {
      if (!dialog || dialog === activeDialog) {
        return;
      }

      if (activeDialog) {
        deactivateDialog();
      }

      activeDialog = dialog;
      returnFocusElement = document.activeElement;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      focusFrame = window.requestAnimationFrame(() => {
        focusFrame = null;
        const firstFocusable = activeDialog?.querySelector(
          DIALOG_FOCUSABLE_SELECTOR
        );
        firstFocusable?.focus();
      });
    };

    const syncDialog = () => {
      const dialog = document.querySelector(DIALOG_SELECTOR);

      if (dialog) {
        activateDialog(dialog);
      } else {
        deactivateDialog();
      }
    };

    const handleKeyDown = (event) => {
      if (!activeDialog || !document.contains(activeDialog)) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        activeDialog
          .querySelector('.burnsville-cart-notice__close')
          ?.click();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = Array.from(
        activeDialog.querySelectorAll(DIALOG_FOCUSABLE_SELECTOR)
      ).filter((element) => element.getClientRects().length > 0);

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!activeDialog.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const observer = new MutationObserver(syncDialog);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('keydown', handleKeyDown);
    syncDialog();

    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', handleKeyDown);
      deactivateDialog();
    };
  }, []);

  return null;
};

// <---- APP LINKS - BrowserRouter , Router ,Route ---->
const App = () => {
  return (
    <Router>
      <DialogAccessibilityManager />
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/order/:id' component={OrderScreen} />
          <Route path='/shipping' component={ShippingScreen} />
          <Route path='/payment' component={PaymentScreen} />
          <Route path='/placeorder' component={PlaceOrderScreen} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/profile' component={ProfileScreen} />
          <Route path='/product/:id' component={ProductScreen} />
          <Route path='/cart/:id?' component={CartScreen} />
          <Route path='/admin/userlist' component={UserListScreen} />
          <Route path='/admin/user/:id/edit' component={UserEditScreen} />
          <Route
            path='/admin/productlist'
            component={ProductListScreen}
            exact
          />
          <Route
            path='/admin/productlist/:pageNumber'
            component={ProductListScreen}
            exact
          />
          <Route path='/admin/product/:id/edit' component={ProductEditScreen} />
          <Route path='/admin/orderlist' component={OrderListScreen} />
          <Route path='/shop' component={ShopScreen} exact />
          <Route path='/search/:keyword' component={ShopScreen} exact />
          <Route path='/page/:pageNumber' component={ShopScreen} exact />
          <Route
            path='/search/:keyword/page/:pageNumber'
            component={ShopScreen}
            exact
          />
          <Route path='/' component={HomeScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};
// <---- EXPORT ---->
export default App;
