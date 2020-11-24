import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout.tsx"

export default function Template({ data }) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { html } = markdownRemark

  return (
    <Layout>
      <div dangerouslySetInnerHTML={{ __html: html }}/>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`
