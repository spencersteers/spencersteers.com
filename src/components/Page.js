import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

const defaultDescription = 'Young Professional';

class Page extends React.Component {
  render() {
    const { children, title, description, url, className } = this.props;
    return (
      <div className={`page ${className}`}>
        <Helmet title={title} htmlAttributes={{ lang: 'en' }}>
          <meta property="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:url" content={url} />
          <meta property="og:type" content="website" />
        </Helmet>
        {children}
      </div>
    );
  }
}

Page.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  className: PropTypes.string,
};

export const pageMetadataFragment = graphql`
  fragment PageMetadata on Site {
    siteMetadata {
      title
      author
      description
      siteUrl
      twitter
    }
  }
`;

export default Page;
