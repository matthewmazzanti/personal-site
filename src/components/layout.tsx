import React, { FunctionComponent as Component } from "react";
import { Helmet } from "react-helmet";

export type Props = {
  title?: string,
}

const Layout: Component<Props> = ({ title, children }) =>
  <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title ? `${title} -` : ""} Matthew Mazzanti</title>
    </Helmet>

    <header className="root">
      <div className="title">
        Matthew Mazzanti
      </div>

      <div className="pages">
        <a href="/blog">Blog</a>
        <a href="/">Resume</a>
      </div>
    </header>

    <main>
      <article>
        {children}
      </article>
    </main>

    <footer>
      © {new Date().getFullYear()}, Matthew Mazzanti
    </footer>
  </>;

export default Layout
