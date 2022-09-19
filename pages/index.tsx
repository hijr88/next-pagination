import Pagination from "../components/pagination";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>pagination</title>
      </Head>

      <main>
        <div className="mt-12">
          <Pagination maxNumber={23} />
        </div>
      </main>
    </div>
  );
};

export default Home;
