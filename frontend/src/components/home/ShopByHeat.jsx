import React from 'react';
import './shop-by-heat.css';

const HEAT_LEVELS = [
  {
    label: 'Mild',
    range: '1–3/10',
    accessibleRange: '1 to 3 out of 10',
    tone: 'mild',
    intensity: 1,
  },
  {
    label: 'Medium',
    range: '4–6/10',
    accessibleRange: '4 to 6 out of 10',
    tone: 'medium',
    intensity: 2,
  },
  {
    label: 'Hot',
    range: '7–8/10',
    accessibleRange: '7 to 8 out of 10',
    tone: 'hot',
    intensity: 3,
  },
  {
    label: 'Very Hot',
    range: '9–10/10',
    accessibleRange: '9 to 10 out of 10',
    tone: 'very-hot',
    intensity: 4,
  },
  {
    label: 'Extreme',
    range: '11+/10',
    accessibleRange: '11 plus out of 10',
    tone: 'extreme',
    intensity: 6,
  },
];

const PepperMark = () => (
  <span aria-hidden='true' className='burnsville-heat-strip__pepper'>
    <svg viewBox='0 0 72 82' role='presentation'>
      <path
        className='burnsville-heat-strip__pepper-stem'
        d='M39 18c2-9 7-13 14-13 2 0 4 1 5 3-7 1-10 5-11 12z'
      />
      <path
        className='burnsville-heat-strip__pepper-body'
        d='M44 18c12 3 18 12 17 24-1 17-16 31-43 38 14-10 20-19 20-29 0-7-3-12-3-18 0-8 3-13 9-15z'
      />
      <path
        className='burnsville-heat-strip__pepper-highlight'
        d='M47 26c5 4 7 10 6 16-1 9-7 17-17 24 7-9 10-17 9-25 0-5-1-10 2-15z'
      />
      <path
        className='burnsville-heat-strip__pepper-flame burnsville-heat-strip__pepper-flame--one'
        d='M20 60c-7 5-10 10-9 17 2-3 5-5 9-6-2 4-2 7 0 10 2-5 6-8 11-10z'
      />
      <path
        className='burnsville-heat-strip__pepper-flame burnsville-heat-strip__pepper-flame--two'
        d='M28 55c-3 6-3 11 0 16 1-4 4-7 8-9z'
      />
    </svg>
  </span>
);

const IntensityDots = ({ intensity }) => (
  <span aria-hidden='true' className='burnsville-heat-strip__intensity'>
    {Array.from({ length: 6 }, (_, index) => (
      <span
        className={`burnsville-heat-strip__dot${
          index < intensity ? ' burnsville-heat-strip__dot--active' : ''
        }`}
        key={index}
      />
    ))}
  </span>
);

const ShopByHeat = () => (
  <section
    aria-labelledby='burnsville-heat-strip-title'
    className='burnsville-heat-strip'
    id='shop-by-heat'
  >
    <div className='burnsville-heat-strip__inner'>
      <div className='burnsville-heat-strip__heading'>
        <h2 id='burnsville-heat-strip-title'>
          <span>Shop</span>
          <span>by heat</span>
        </h2>
      </div>

      <nav
        aria-label='Shop by heat level'
        className='burnsville-heat-strip__nav'
      >
        <ul className='burnsville-heat-strip__levels'>
          {HEAT_LEVELS.map((level) => (
            <li className='burnsville-heat-strip__item' key={level.tone}>
              <a
                aria-label={`${level.label} sauces, heat level ${level.accessibleRange}`}
                className={`burnsville-heat-strip__level burnsville-heat-strip__level--${level.tone}`}
                href='#'
              >
                <PepperMark />
                <span className='burnsville-heat-strip__level-copy'>
                  <strong>{level.label}</strong>
                  <span className='burnsville-heat-strip__range'>{level.range}</span>
                  <IntensityDots intensity={level.intensity} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <a className='burnsville-heat-strip__guide-link' href='#'>
        <span className='burnsville-heat-strip__guide-copy'>View heat guide</span>
        <span aria-hidden='true' className='burnsville-heat-strip__guide-arrow'>→</span>
      </a>
    </div>
  </section>
);

export default ShopByHeat;
