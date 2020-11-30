import React from "react";
import { graphql } from "gatsby";
import { Layout, Page } from "../util";

type Query = {
  markdownRemark: {
    html: string;
    frontmatter: {
      title: string;
      subtitle: string;
      date: string;
      status: string;
    }
  }
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
        subtitle
        date(formatString: "MMM DD, YYYY")
        status
      }
    }
  }
`


const BlogTemplate: Page<Query> = ({ data }) => {
  const { html, frontmatter } = data.markdownRemark

  return (
    <Layout title={frontmatter.title}>
      <header>
        <h1 className="underline" style={{display: "inline-block"}}>
          {frontmatter.title}
          {frontmatter.status === "draft" ? "(Draft)" : null}
        </h1>
        <p className="subtitle">
          {frontmatter.subtitle} - {frontmatter.date}
        </p>
      </header>
      <div dangerouslySetInnerHTML={{ __html: html }}/>
    </Layout>
  )

}

export default BlogTemplate;
