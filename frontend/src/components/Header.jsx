import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import SearchBox from './SearchBox';
import BrandLogo from './header/BrandLogo';
import {
  CartIcon,
  ChevronDownIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from './header/HeaderIcons';
import ShopDrawer from './header/ShopDrawer';
import { logout } from '../actions/userActions';
import './header/header.css';

const NAV_ITEMS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Sauces', href: '/shop' },
  { label: 'Packs', href: '/' },
  { label: 'About', href: '#' },
  { label: 'Heat Guide', href: '#' },
  { label: 'Journal', href: '#' },
  { label: 'Contact', href: '#' },
];

const DESKTOP_NAV_ITEMS = NAV_ITEMS.filter((item) => item.label !== 'About');

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const accountButtonRef = useRef(null);
  const accountMenuRef = useRef(null);
  const searchButtonRef = useRef(null);
  const searchInputRef = useRef(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.userLogin);
  const { cartItems = [] } = useSelector((state) => state.cart);
  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.qty || 0),
    0
  );

  useEffect(() => {
    setAccountOpen(false);
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!accountOpen) {
      return undefined;
    }

    const closeAccountMenu = (event) => {
      if (event.key === 'Escape') {
        setAccountOpen(false);
        accountButtonRef.current?.focus();
      }

      if (
        event.type === 'mousedown' &&
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener('keydown', closeAccountMenu);
    document.addEventListener('mousedown', closeAccountMenu);

    return () => {
      document.removeEventListener('keydown', closeAccountMenu);
      document.removeEventListener('mousedown', closeAccountMenu);
    };
  }, [accountOpen]);

  useEffect(() => {
    if (!searchOpen) {
      return undefined;
    }

    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 80);

    const closeSearch = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        searchButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', closeSearch);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', closeSearch);
    };
  }, [searchOpen]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    setAccountOpen(false);
  };

  const toggleSearch = () => {
    setAccountOpen(false);
    setSearchOpen((isOpen) => !isOpen);
  };

  const toggleAccount = () => {
    setSearchOpen(false);
    setAccountOpen((isOpen) => !isOpen);
  };

  return (
    <header className='burnsville-header'>
      <div className='burnsville-header__bar'>
        <button
          aria-controls='burnsville-shop-drawer'
          aria-expanded={drawerOpen}
          aria-label='Open shop menu'
          className='burnsville-header__icon-button burnsville-header__menu-button'
          onClick={() => setDrawerOpen(true)}
          type='button'
        >
          <MenuIcon />
        </button>

        <BrandLogo />

        <nav aria-label='Primary navigation' className='burnsville-header__nav'>
          {DESKTOP_NAV_ITEMS.map((item) => (
            <a href={item.href} key={item.label}>
              {item.label}
              {item.label === 'Shop' && <ChevronDownIcon />}
            </a>
          ))}
        </nav>

        <div className='burnsville-header__utilities'>
          <button
            aria-controls='burnsville-header-search'
            aria-expanded={searchOpen}
            aria-label={searchOpen ? 'Close product search' : 'Search products'}
            className='burnsville-header__icon-button'
            onClick={toggleSearch}
            ref={searchButtonRef}
            type='button'
          >
            <SearchIcon />
          </button>

          {userInfo ? (
            <div className='burnsville-header__account-menu' ref={accountMenuRef}>
              <button
                aria-controls='burnsville-account-menu'
                aria-expanded={accountOpen}
                aria-label={`Open account menu for ${userInfo.name}`}
                className='burnsville-header__icon-button burnsville-header__account-button'
                onClick={toggleAccount}
                ref={accountButtonRef}
                type='button'
              >
                <UserIcon />
                <span className='burnsville-header__account-name'>{userInfo.name}</span>
              </button>
              <div
                className={`burnsville-header__account-dropdown${
                  accountOpen ? ' burnsville-header__account-dropdown--open' : ''
                }`}
                id='burnsville-account-menu'
              >
                <Link to='/profile'>Profile</Link>
                {userInfo.isAdmin && (
                  <>
                    <span className='burnsville-header__dropdown-label'>Admin</span>
                    <Link to='/admin/userlist'>Users</Link>
                    <Link to='/admin/productlist'>Products</Link>
                    <Link to='/admin/orderlist'>Orders</Link>
                  </>
                )}
                <button onClick={logoutHandler} type='button'>
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              aria-label='Sign in'
              className='burnsville-header__icon-button burnsville-header__account-link'
              to='/login'
            >
              <UserIcon />
            </Link>
          )}

          <Link
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
            className='burnsville-header__icon-button burnsville-header__cart-link'
            to='/cart'
          >
            <CartIcon />
            {cartCount > 0 && (
              <span aria-hidden='true' className='burnsville-header__cart-count'>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div
        aria-hidden={!searchOpen}
        className={`burnsville-header__search-panel${
          searchOpen ? ' burnsville-header__search-panel--open' : ''
        }`}
        id='burnsville-header-search'
      >
        {searchOpen && (
          <SearchBox
            autoFocus
            history={history}
            id='header-product-search'
            onNavigate={() => setSearchOpen(false)}
            ref={searchInputRef}
          />
        )}
      </div>

      <ShopDrawer
        history={history}
        isOpen={drawerOpen}
        navItems={NAV_ITEMS}
        onClose={closeDrawer}
        onLogout={logoutHandler}
        userInfo={userInfo}
      />
    </header>
  );
};

export default Header;
