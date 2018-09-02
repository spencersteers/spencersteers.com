import React from 'react';
import Helmet from 'react-helmet';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';

import { rhythm, scale } from '../utils/typography';

import Page from '../components/Page';
import Layout from '../components/Layout';
import BlogPost from '../components/BlogPost';
import Header from '../components/Header';

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
        <header
          style={{
            height: 230,
            paddingTop: rhythm(1),
            background: '#1f2228',
            borderBottom: '1px solid #17191d',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: '#262931',
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 20,
              paddingBottom: 0,
              display: 'inline-block',
              margin: '2 auto',
              borderLeft: '1px solid rgb(23, 25, 29)',
              borderTop: '1px solid rgb(23, 25, 29)',
              borderRight: '1px solid rgb(23, 25, 29)',
              borderRadius: '5px 5px 0 0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <video src="/screen_cropped.mp4" muted autoPlay loop playsInline width="300" />
            <div style={{
              position: 'absolute',
              width: '100%',
              height: 0,
              boxShadow: '0 -4px 4px 4px rgba(0, 0, 0, 0.75)',
              left: 0,
              right: 0
            }} />
          </div>
        </header>
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
    arcadeCabinet: file(relativePath: { eq: "ArcadeCabinet_RoundedRoughSmall.png" }) {
      childImageSharp {
        fluid(maxWidth: 300) {
          base64
          aspectRatio
          src
          srcSet
          sizes
        }
      }
    }
  }
`;
