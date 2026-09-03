import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './header/BrandLogo';
import './footer.css';

const footerGroups = [
  {
    title: 'Shop',
    links: [
      { label: 'All sauces', to: '/' },
      { label: 'Packs', to: '/' },
      { label: 'Heat guide', to: '#' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Journal', to: '#' },
      { label: 'Contact', to: '#' },
      { label: 'About Burnsville', to: '#' },
    ],
  },
  {
    title: 'Your account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Cart', to: '/cart' },
    ],
  },
];

// <---- FOOTER FUNCTION  ---->
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='burnsville-footer'>
      <div className='burnsville-footer__inner'>
        <div className='burnsville-footer__brand'>
          <BrandLogo />
          <p>Heat-forward flavour with a bold Burnsville point of view.</p>
        </div>

        <nav className='burnsville-footer__nav' aria-label='Footer navigation'>
          {footerGroups.map((group) => (
            <section className='burnsville-footer__group' key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>

        <div className='burnsville-footer__statement' aria-hidden='true'>
          <span>Burnsville</span>
          <strong>Heat. Flavour. Character.</strong>
        </div>
      </div>

      <div className='burnsville-footer__legal'>
        <p>&copy; {currentYear} Burnsville Hot Sauce.</p>
        <p>Made for heat. Built for flavour.</p>
      </div>
    </footer>
  );
};

// <---- EXPORT ---->
export default Footer;
