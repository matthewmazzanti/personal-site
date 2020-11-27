import React, { FunctionComponent as Component } from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";

type Props = {
  data: Query;
};

const BlogList: Component<Props> = ({ data }) => {
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
              {page.title}
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

export type Query = {
  allMarkdownRemark: {
    edges: {
      node: {
        frontmatter: {
          title: string,
          subtitle: string,
          date: string
        },
        fields: {
          slug: string
        }
      },
    }[]
  }
};

export const pageQuery = graphql`
  {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
            subtitle
            date(formatString: "MMM DD, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
