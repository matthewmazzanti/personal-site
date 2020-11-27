import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout.tsx"

const BlogTemplate = ({ data }) => {
  const { markdownRemark } = data
  const { html, frontmatter } = markdownRemark

  return (
    <Layout title={frontmatter.title}>
      <header>
        <h1 className="underline" style={{display: "inline-block"}}>
          {frontmatter.title}
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

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
        subtitle
        date(formatString: "MMM DD, YYYY")
      }
    }
  }
`
