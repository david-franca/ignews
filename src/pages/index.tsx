import type { NextPage } from "next";
import { Fragment } from "react";

import { Head } from "../components/Head";

const Home: NextPage = () => {
  return (
    <Fragment>
      <Head />
      <h1>Hello World</h1>
    </Fragment>
  );
};

export default Home;
