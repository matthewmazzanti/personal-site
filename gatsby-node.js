const pathRegex = (path) => {
  const combined = `^${__dirname}/${path}`.replace(/\//g, "\\/");
  return `/${combined}/`;
};

const basename = (path) => {
  const last = path.match(/\/([^.\/]*)[^\/]*$/);
  if (!last) {
    throw Error("no path matched");
  }

  return last[1];
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const blogPostTemplate = require.resolve(`./src/templates/blog.js`);

  const result = await graphql(`
    query Posts($path: String) {
      allMarkdownRemark(
        limit: 1000,
        filter: { fileAbsolutePath: { regex: $path } },
      ) {
        edges {
          node {
            fileAbsolutePath
          }
        }
      }
    }
  `, { path: pathRegex("src/posts") });

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: `blog/${basename(node.fileAbsolutePath)}`,
      component: blogPostTemplate,
      context: {
        abspath: node.fileAbsolutePath,
      },
    })
  })
}
