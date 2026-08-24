import React from 'react';
import './shop-by-heat.css';

const HEAT_LEVELS = [
  {
    label: 'Mild',
    range: '1–3/10',
    accessibleRange: '1 to 3 out of 10',
    tone: 'mild',
  },
  {
    label: 'Medium',
    range: '4–6/10',
    accessibleRange: '4 to 6 out of 10',
    tone: 'medium',
  },
  {
    label: 'Hot',
    range: '7–8/10',
    accessibleRange: '7 to 8 out of 10',
    tone: 'hot',
  },
  {
    label: 'Very Hot',
    range: '9–10/10',
    accessibleRange: '9 to 10 out of 10',
    tone: 'very-hot',
  },
  {
    label: 'Extreme',
    range: '11+/10',
    accessibleRange: '11 plus out of 10',
    tone: 'extreme',
  },
];

const PepperMark = () => (
  <span aria-hidden='true' className='burnsville-heat-strip__pepper'>
    <span className='burnsville-heat-strip__pepper-body' />
    <span className='burnsville-heat-strip__pepper-stem' />
    <span className='burnsville-heat-strip__pepper-flare' />
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
                  <span>{level.range}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <a className='burnsville-heat-strip__guide-link' href='#'>
        View heat guide
        <span aria-hidden='true'>→</span>
      </a>
    </div>
  </section>
);

export default ShopByHeat;
