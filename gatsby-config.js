module.exports = {
  siteMetadata: {
    title: 'spencersteers.com',
    author: 'Spencer Steers',
    description: 'Young Professional.',
    siteUrl: 'https://spencersteers.com',
    twitter: '@spencersteers'
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog/`,
        name: 'blog',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog/`,
        name: 'blog',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `arcadeScreenImages`,
        path: `${__dirname}/src/components/ArcadeCabinet/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              showCaptions: true,
              quality: 80,
              backgroundColor: '#262931'
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          'gatsby-remark-autolink-headers',
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `spencersteers.com`,
        short_name: `Spencer Steers`,
        start_url: `/`,
        background_color: `#262931`,
        theme_color: `#262931`,
        display: `minimal-ui`,
        icon: `src/assets/icon.jpeg`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
        omitGoogleFont: true,
      },
    },
    `gatsby-plugin-netlify`
  ],
}
