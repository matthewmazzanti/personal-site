module.exports = {
  siteMetadata: {
    title: `Matthew Mazzanti Personal Site`,
    description: ``,
    author: `Matthew Mazzanti`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Matthew Mazzanti`,
        short_name: `Matthew Mazzanti`, start_url: `/`,
        icon: `src/images/empty-favicon.png`,
      },
    },
  ],
}
