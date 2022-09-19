import Pagination from "../components/v1/pagination";
import type { NextPage } from "next";
import Head from "next/head";
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>pagination-1</title>
      </Head>

      <main>
        <Link href="/">
          <a className="text-2xl ml-96">홈</a>
        </Link>
        <div className="mt-12">
          <Pagination maxNumber={23} />
        </div>
      </main>
    </div>
  );
};

export default Home;
