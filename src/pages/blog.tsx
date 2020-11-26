import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";

const basename = (path) => {
  const last = path.match(/\/([^.\/]*)[^\/]*$/);
  if (!last) {
    throw Error("no path matched");
  }

  return last[1];
}

const BlogList = ({ data }: { data: any}) => {
  return (
    <Layout title="Blog Posts">
      <div>Hello</div>
    </Layout>
  )
};

export default BlogList;

export const pageQuery = graphql`
  query($abspath: String!) {
    markdownRemark(fileAbsolutePath: { eq: $abspath }) {
      html
      headings {
        id
        value
        depth
      }
    }
  }
`
