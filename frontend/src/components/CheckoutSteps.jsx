import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './checkout/checkout-flow.css';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { label: 'Sign in', path: '/login', enabled: step1 },
    { label: 'Shipping', path: '/shipping', enabled: step2 },
    { label: 'Payment', path: '/payment', enabled: step3 },
    { label: 'Place order', path: '/placeorder', enabled: step4 },
  ];
  const currentStep = steps.reduce(
    (current, step, index) => (step.enabled ? index : current),
    0
  );

  return (
    <nav className='burnsville-checkout-steps' aria-label='Checkout progress'>
      <ol>
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;
          const className = [
            'burnsville-checkout-steps__item',
            step.enabled ? 'is-enabled' : 'is-disabled',
            isCurrent ? 'is-current' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <li className={className} key={step.label}>
              <span className='burnsville-checkout-steps__number'>
                {String(index + 1).padStart(2, '0')}
              </span>
              {step.enabled ? (
                <Link to={step.path} aria-current={isCurrent ? 'step' : undefined}>
                  {step.label}
                </Link>
              ) : (
                <span aria-disabled='true'>{step.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

CheckoutSteps.defaultProps = {
  step1: false,
  step2: false,
  step3: false,
  step4: false,
};

CheckoutSteps.propTypes = {
  step1: PropTypes.bool,
  step2: PropTypes.bool,
  step3: PropTypes.bool,
  step4: PropTypes.bool,
};

export default CheckoutSteps;
