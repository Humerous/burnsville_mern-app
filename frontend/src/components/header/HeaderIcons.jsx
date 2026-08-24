import React from 'react';

const Icon = ({ children, className = '', size = 22, viewBox = '0 0 24 24' }) => (
  <svg
    aria-hidden='true'
    className={className}
    fill='none'
    height={size}
    viewBox={viewBox}
    width={size}
    xmlns='http://www.w3.org/2000/svg'
  >
    {children}
  </svg>
);

export const MenuIcon = (props) => (
  <Icon {...props}>
    <path d='M4 7h16M4 12h16M4 17h16' stroke='currentColor' strokeLinecap='round' strokeWidth='1.8' />
  </Icon>
);

export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d='m6 6 12 12M18 6 6 18' stroke='currentColor' strokeLinecap='round' strokeWidth='1.8' />
  </Icon>
);

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx='10.8' cy='10.8' r='6.3' stroke='currentColor' strokeWidth='1.8' />
    <path d='m15.5 15.5 4 4' stroke='currentColor' strokeLinecap='round' strokeWidth='1.8' />
  </Icon>
);

export const UserIcon = (props) => (
  <Icon {...props}>
    <circle cx='12' cy='8' r='3.5' stroke='currentColor' strokeWidth='1.8' />
    <path d='M5.5 20c.4-4 2.6-6 6.5-6s6.1 2 6.5 6' stroke='currentColor' strokeLinecap='round' strokeWidth='1.8' />
  </Icon>
);

export const CartIcon = (props) => (
  <Icon {...props}>
    <path d='M3.5 5h2l1.7 9.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.5L20.2 8H6.1' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' />
    <circle cx='9.4' cy='19.2' fill='currentColor' r='1.2' />
    <circle cx='17.2' cy='19.2' fill='currentColor' r='1.2' />
  </Icon>
);

export const ChevronDownIcon = (props) => (
  <Icon size={12} {...props}>
    <path
      d='m7 9.5 5 5 5-5'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.8'
    />
  </Icon>
);
