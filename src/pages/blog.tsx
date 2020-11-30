import React from "react";
import { graphql } from "gatsby";

import { Page } from "../util";
import Layout from "../components/layout";

export type Query = {
  allMarkdownRemark: {
    edges: {
      node: {
        frontmatter: {
          title: string;
          subtitle: string;
          date: string;
          status: "draft" | "post";
        },
        fields: {
          slug: string;
        }
      };
    }[];
  };
};

export const pageQuery = graphql`
  query allPosts($postStatus: [String]) {
    allMarkdownRemark(filter: {frontmatter: {status: {in: $postStatus}}}) {
      edges {
        node {
          frontmatter {
            title
            subtitle
            date(formatString: "MMM DD, YYYY")
            status
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

const BlogList: Page<Query> = ({ data }) => {
  const pages = data.allMarkdownRemark.edges.map(({ node }) => ({
    ...node.frontmatter,
    url: `/${node.fields.slug}`,
  }));

  return (
    <Layout title="Blog Posts">
      <section>
        {pages.map((page: any) =>
          <div key={page.url} style={{textAlign: "center"}}>
            <a href={page.url} className="h2" style={{display: "inline-block"}}>
              {page.title} {page.status === "draft" ? "(Draft)" : null}
            </a>

            <p className="subtitle2">
              {page.subtitle} - {page.date}
            </p>
          </div>
        )}
      </section>
    </Layout>
  )
};

export default BlogList;
