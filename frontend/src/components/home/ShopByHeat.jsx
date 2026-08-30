import React from 'react';
import mildPepper from '../../assets/heat/mild.webp';
import mediumPepper from '../../assets/heat/medium.webp';
import hotPepper from '../../assets/heat/hot.webp';
import veryHotPepper from '../../assets/heat/very-hot.webp';
import extremePepper from '../../assets/heat/extreme.webp';
import './shop-by-heat.css';
import './heat-illustration-assets.css';

const HEAT_LEVELS = [
  {
    label: 'Mild',
    range: '1–3/10',
    accessibleRange: '1 to 3 out of 10',
    tone: 'mild',
    intensity: 1,
    image: mildPepper,
  },
  {
    label: 'Medium',
    range: '4–6/10',
    accessibleRange: '4 to 6 out of 10',
    tone: 'medium',
    intensity: 2,
    image: mediumPepper,
  },
  {
    label: 'Hot',
    range: '7–8/10',
    accessibleRange: '7 to 8 out of 10',
    tone: 'hot',
    intensity: 3,
    image: hotPepper,
  },
  {
    label: 'Very Hot',
    range: '9–10/10',
    accessibleRange: '9 to 10 out of 10',
    tone: 'very-hot',
    intensity: 4,
    image: veryHotPepper,
  },
  {
    label: 'Extreme',
    range: '11+/10',
    accessibleRange: '11 plus out of 10',
    tone: 'extreme',
    intensity: 6,
    image: extremePepper,
  },
];

const PepperMark = ({ image }) => (
  <span aria-hidden='true' className='burnsville-heat-strip__pepper'>
    <img
      alt=''
      className='burnsville-heat-strip__pepper-image'
      decoding='async'
      height='240'
      loading='eager'
      src={image}
      width='240'
    />
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
                <PepperMark image={level.image} />
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
