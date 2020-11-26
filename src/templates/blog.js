import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout.tsx"

export default function Template({ data }) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { html, headings } = markdownRemark

  return (
    <Layout title={headings[0].value}>
      <div dangerouslySetInnerHTML={{ __html: html }}/>
    </Layout>
  )
}

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
