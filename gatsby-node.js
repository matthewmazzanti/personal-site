const { createFilePath } = require("gatsby-source-filesystem");

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({ node, getNode, basePath: "posts" })
    createNodeField({ node, name: "slug", value: `blog${slug}` });
  }
};

exports.onCreatePage = ({page, actions}) => {
  const { createPage, deletePage } = actions;

  if (page.path === "/blog/") {
    console.log(process.env.NODE_ENV);
    deletePage(page);
    createPage({
      ...page,
      context: {
        ...page.context,
      postStatus: process.env.NODE_ENV === "development"
        ? ["draft", "post"]
        : ["post"]
      }
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: require.resolve("./src/components/blogTemplate.tsx"),
      context: {
        slug: node.fields.slug,
      },
    })
  });
};
