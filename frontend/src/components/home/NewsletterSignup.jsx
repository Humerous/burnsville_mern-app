import React from 'react';
import './newsletter-signup.css';

const NewsletterSignup = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section
      className='burnsville-newsletter'
      aria-labelledby='burnsville-newsletter-title'
    >
      <div className='burnsville-newsletter__inner'>
        <div className='burnsville-newsletter__mark' aria-hidden='true'>
          <span />
        </div>

        <div className='burnsville-newsletter__copy'>
          <p>Stay close to the heat</p>
          <h2 id='burnsville-newsletter-title'>Join the Burnsville crew</h2>
          <span>Occasional updates from the Burnsville range.</span>
        </div>

        <form className='burnsville-newsletter__form' onSubmit={handleSubmit}>
          <label htmlFor='burnsville-newsletter-email'>Email address</label>
          <div className='burnsville-newsletter__controls'>
            <input
              id='burnsville-newsletter-email'
              name='email'
              type='email'
              autoComplete='email'
              placeholder='Your email address'
              required
            />
            <button type='submit'>Sign me up</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;
