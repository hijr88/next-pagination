import Pagination from "../components/v2/pagination";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>pagination-2</title>
      </Head>

      <main>
        <Link href="/">
          <a className="ml-96 text-2xl">홈</a>
        </Link>
        <div className="mt-12">
          <Pagination maxNumber={28} range={5} />
        </div>
      </main>
    </div>
  );
};

export default Home;
