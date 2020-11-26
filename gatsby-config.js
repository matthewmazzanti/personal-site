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
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-mermaid',
            options: {
              language: 'mermaid',
              theme: 'forest',
              viewport: {
                width: 200,
                height: 200
              },
              mermaidOptions: {
                fontFamily: "Times New Roman",
                flowchart: {
                  width: "100%",
                  curve: "basis",
                }
              }
            }
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              icon: false
            }
          },
          `gatsby-remark-tufte`,
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              inlineCodeMarker: '|>',
              aliases: {
                hs: "haskell"
              },
              languageExtensions: [
                {
                  language: "ghci",
                  extend: "haskell",
                  insertBefore: {
                    operator: {
                      prompt: /λ= /
                    }
                  }
                }
              ]
            }
          }
        ]
      }
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
