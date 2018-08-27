import React from 'react';
import Helmet from 'react-helmet';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';

import { rhythm, scale } from '../utils/typography';

import Page from '../components/Page';
import Layout from '../components/Layout';
import BlogPost from '../components/BlogPost';
import { CompactHeader } from '../components/Header';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteUrl = get(this.props, 'data.site.siteMetadata.siteUrl');

    const { previous, next } = this.props.pageContext;
    return (
      <Page
        title={post.frontmatter.title}
        description={post.excerpt}
        url={`${siteUrl}${post.fields.slug}`}
      >
        <CompactHeader />
        <Layout location={this.props.location}>
          <BlogPost post={post} />
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none',
              padding: 0,
              marginTop: rhythm(2),
            }}
          >
            {previous && (
              <li>
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              </li>
            )}
            {next && (
              <li>
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              </li>
            )}
          </ul>
        </Layout>
      </Page>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      ...PageMetadata
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      ...BlogPost
    }
  }
`;
