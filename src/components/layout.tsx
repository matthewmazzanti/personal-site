import React from "react";
import { Helmet } from "react-helmet";

const Layout = ({ children }) =>
  <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Matthew Mazzanti</title>
    </Helmet>
    <div>
      <main>
        <article>
          <h1>Matthew Mazzanti</h1>
          {children}
        </article>
      </main>
      <footer style={{marginTop: `2rem`}}>
        © {new Date().getFullYear()}, Matthew Mazzanti
      </footer>
    </div>
  </>;

export default Layout
