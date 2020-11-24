import React from "react";
import { Helmet } from "react-helmet";

const Layout = ({ children }) =>
  <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Matthew Mazzanti</title>
    </Helmet>

    <header>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <div style={{fontSize: "1.5em", fontStyle: "italic"}}>
          Matthew Mazzanti
        </div>

        <div style={{display: "flex", fontSize: "1.2em"}}>
          <a style={{margin: "0 .5em"}} href="/blog/my-first-post">Blog</a>
          <a style={{margin: "0 .5em"}} href="/">Resume</a>
        </div>
      </div>
    </header>

    <main>
      <article>
        {children}
      </article>
    </main>

    <footer style={{marginTop: `2rem`}}>
      © {new Date().getFullYear()}, Matthew Mazzanti
    </footer>
  </>;

export default Layout
