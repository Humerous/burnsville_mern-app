import React from 'react';
import { Link } from 'react-router-dom';
import './home-hero.css';

const HomeHero = () => (
  <section
    aria-labelledby='burnsville-home-hero-title'
    className='burnsville-home-hero'
  >
    <div className='burnsville-home-hero__content'>
      <div className='burnsville-home-hero__copy'>
        <p className='burnsville-home-hero__eyebrow'>Burnsville Hot Sauce</p>
        <h1
          className='burnsville-home-hero__title'
          id='burnsville-home-hero-title'
        >
          <span>Turn up the heat.</span>
          <span className='burnsville-home-hero__title-accent'>
            Keep the flavour.
          </span>
        </h1>
        <p className='burnsville-home-hero__summary'>
          Explore Burnsville hot sauces and find the heat level that suits your
          taste.
        </p>
        <div className='burnsville-home-hero__actions'>
          <Link
            className='burnsville-home-hero__cta burnsville-home-hero__cta--primary'
            to='/'
          >
            Shop all sauces
          </Link>
          <a
            className='burnsville-home-hero__cta burnsville-home-hero__cta--secondary'
            href='#'
          >
            Explore heat guide
            <span aria-hidden='true'>→</span>
          </a>
        </div>
      </div>
    </div>

    <div aria-hidden='true' className='burnsville-home-hero__visual'>
      <div className='burnsville-home-hero__visual-orbit' />
      <div className='burnsville-home-hero__visual-type'>
        <span className='burnsville-home-hero__visual-brand'>Burnsville</span>
        <span className='burnsville-home-hero__visual-heat'>Heat</span>
        <span className='burnsville-home-hero__visual-flavour'>Flavour</span>
      </div>
      <span className='burnsville-home-hero__ember burnsville-home-hero__ember--one' />
      <span className='burnsville-home-hero__ember burnsville-home-hero__ember--two' />
      <span className='burnsville-home-hero__ember burnsville-home-hero__ember--three' />
      <span className='burnsville-home-hero__ember burnsville-home-hero__ember--four' />
      <div className='burnsville-home-hero__visual-ground' />
    </div>
  </section>
);

export default HomeHero;
