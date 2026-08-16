import React from 'react';
import { Helmet } from 'react-helmet';

// <---- META FUNCTION - title, description, keywords ---->
const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

// <---- META FUNCTION - tdefaultProps ---->
Meta.defaultProps = {
  title: 'Welcome To Burnsville',
  description:
    'We have the biggest selection of craft hot sauces in the southern hemisphere',
  keywords: 'Food products and more...',
};

// <---- EXPORT ---->
export default Meta;
