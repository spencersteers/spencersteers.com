import React from 'react';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';
import Helmet from 'react-helmet';

import Page from '../components/Page';
import Layout from '../components/Layout';
import BlogPost from '../components/BlogPost';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Divider from '../components/Divider';

import { rhythm } from '../utils/typography';

class Index extends React.Component {
  render() {
    const title = get(this, 'props.data.site.siteMetadata.title');
    const siteUrl = get(this, 'props.data.site.siteMetadata.siteUrl');
    const description = get(this, 'props.data.site.siteMetadata.description');

    const posts = get(this, 'props.data.allMarkdownRemark.edges');
    return (
      <Page title={title} description={description} url={siteUrl} className="front">
        <Header />
        <Nav style={{ marginTop: `${rhythm(1.5)}` }} />
        <Divider width={rhythm(10)} style={{ margin: `${rhythm(0.5)} auto 0 auto` }} />
        <Layout>
          {posts.map(({ node }) => (
            <React.Fragment key={node.fields.slug}>
              <BlogPost post={node} />
              <Divider width={rhythm(10)} style={{ margin: `${rhythm(1.5)} auto` }} />
            </React.Fragment>
          ))}
        </Layout>
      </Page>
    );
  }
}

export default Index;

export const pageQuery = graphql`
  query {
    site {
      ...PageMetadata
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          ...BlogPost
        }
      }
    }
  }
`;
