import React from 'react';
import './brand-proof-strip.css';

const proofPoints = [
  {
    marker: '01',
    title: '5 heat levels',
    copy: 'Mild through extreme.',
  },
  {
    marker: '02',
    title: 'Flavour led',
    copy: 'Heat with flavour in focus.',
  },
  {
    marker: '03',
    title: 'Easy to explore',
    copy: 'Clear routes into the range.',
  },
  {
    marker: '04',
    title: 'Burnsville style',
    copy: 'Bold, tactile and direct.',
  },
];

const BrandProofStrip = () => (
  <section className='brand-proof-strip' aria-label='Burnsville range overview'>
    <div className='brand-proof-strip__inner'>
      {proofPoints.map((point) => (
        <article className='brand-proof-strip__item' key={point.marker}>
          <span className='brand-proof-strip__marker' aria-hidden='true'>
            {point.marker}
          </span>
          <div>
            <h2>{point.title}</h2>
            <p>{point.copy}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default BrandProofStrip;
