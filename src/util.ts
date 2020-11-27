import { FunctionComponent } from "react"
import { PageProps } from "gatsby";
import Layout from "./components/layout";

export type Component<P> = FunctionComponent<PageProps<P>>;

export {
  Layout
};
