const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve('./src/templates/BlogPostTemplate.js')
  let result = await graphql(
    `
      {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    console.log(result.errors)
    throw new Error(result.errors);
  }

  const posts = result.data.allMarkdownRemark.edges;

  _.each(posts, (post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  });
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
}

exports.onCreateWebpackConfig = ({ stage, getConfig, rules, loaders, actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.glsl$/,
          loader: 'webpack-glsl-loader'
        }
      ]
    }
  });

  if (stage === "build-html") {
    // modules depending on browser apis
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: [
              /three-full.*\Detector.js$/
            ],
            use: [
              loaders.null()
            ],
          },
        ]
      }
    });
  }
};
