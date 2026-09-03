import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { CloseIcon, UserIcon } from './HeaderIcons';
import SearchBox from '../SearchBox';

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const ShopDrawer = ({
  history,
  isOpen,
  navItems,
  onClose,
  onLogout,
  userInfo,
}) => {
  const closeButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    returnFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const header = drawerRef.current?.closest('.burnsville-header');
    const backgroundElements = [
      header?.querySelector('.burnsville-header__bar'),
      header?.querySelector('.burnsville-header__search-panel'),
      document.querySelector('main'),
      document.querySelector('footer'),
    ].filter(Boolean);
    const previousInertStates = backgroundElements.map((element) => ({
      element,
      wasInert: element.hasAttribute('inert'),
    }));

    document.body.style.overflow = 'hidden';
    backgroundElements.forEach((element) => element.setAttribute('inert', ''));

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 80);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) {
        return;
      }

      const focusableElements = Array.from(
        drawerRef.current.querySelectorAll(FOCUSABLE_ELEMENTS)
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!drawerRef.current.contains(document.activeElement)) {
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

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousInertStates.forEach(({ element, wasInert }) => {
        if (!wasInert) {
          element.removeAttribute('inert');
        }
      });
      returnFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  const logoutFromDrawer = () => {
    onLogout();
    onClose();
  };

  return (
    <div
      aria-hidden={!isOpen}
      className={`burnsville-drawer${isOpen ? ' burnsville-drawer--open' : ''}`}
    >
      <div
        className='burnsville-drawer__backdrop'
        onClick={onClose}
        role='presentation'
      />
      <aside
        aria-label='Shop menu'
        aria-modal='true'
        className='burnsville-drawer__panel'
        id='burnsville-shop-drawer'
        ref={drawerRef}
        role='dialog'
      >
        <div className='burnsville-drawer__header'>
          <BrandLogo compact onNavigate={onClose} />
          <button
            aria-label='Close shop menu'
            className='burnsville-header__icon-button burnsville-drawer__close'
            onClick={onClose}
            ref={closeButtonRef}
            type='button'
          >
            <CloseIcon />
          </button>
        </div>

        <div className='burnsville-drawer__body'>
          <SearchBox
            className='burnsville-search--drawer'
            history={history}
            id='drawer-product-search'
            onNavigate={onClose}
          />

          <nav aria-label='Mobile primary navigation' className='burnsville-drawer__nav'>
            {navItems.map((item, index) => (
              <a
                className='burnsville-drawer__nav-link'
                href={item.href}
                key={item.label}
                onClick={onClose}
                style={{ '--drawer-index': index }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className='burnsville-drawer__account'>
            <div className='burnsville-drawer__account-heading'>
              <UserIcon size={20} />
              <span>{userInfo ? userInfo.name : 'Account'}</span>
            </div>

            {userInfo ? (
              <>
                <Link onClick={onClose} to='/profile'>
                  Profile
                </Link>
                {userInfo.isAdmin && (
                  <div className='burnsville-drawer__admin-links'>
                    <span>Admin</span>
                    <Link onClick={onClose} to='/admin/userlist'>Users</Link>
                    <Link onClick={onClose} to='/admin/productlist'>Products</Link>
                    <Link onClick={onClose} to='/admin/orderlist'>Orders</Link>
                  </div>
                )}
                <button onClick={logoutFromDrawer} type='button'>
                  Sign out
                </button>
              </>
            ) : (
              <Link onClick={onClose} to='/login'>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ShopDrawer;
