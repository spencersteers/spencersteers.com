import React from 'react';
import { Link, graphql } from 'gatsby';
import { rhythm, scale } from '../utils/typography';

class BlogPost extends React.Component {
  render() {
    let { post } = this.props;
    return (
      <article>
        <header>
          <h1>
            <Link style={{ boxShadow: 'none' }} to={post.fields.slug}>
              {post.frontmatter.title}
            </Link>
          </h1>
          <time
            dateTime={post.frontmatter.rawDate}
            pubdate="pubdate"
            style={{
              ...scale(-1 / 5),
              display: 'block',
              marginBottom: rhythm(1),
              marginTop: rhythm(-1),
            }}
          >
            {post.frontmatter.date}
          </time>
        </header>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    );
  }
}

export const blogPostFragment = graphql`
  fragment BlogPost on MarkdownRemark {
    id
    html
    excerpt
    fields {
      slug
    }
    frontmatter {
      title
      date(formatString: "MMMM DD, YYYY")
      rawDate: date
    }
  }
`;

export default BlogPost;
