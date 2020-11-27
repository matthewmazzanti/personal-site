import { FunctionComponent } from "react"
import { PageProps } from "gatsby";
import Layout from "./components/layout";

export type Page<P> = FunctionComponent<PageProps<P>>;

export {
  Layout
};
