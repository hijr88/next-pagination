import type { NextPage } from "next";
import Head from "next/head";
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>pagination</title>
      </Head>

      <main className="flex">
        <Link href="/v1">
          <a className="bg-violet-100 w-full h-screen flex justify-center items-center hover:bg-violet-200">v1</a>
        </Link>
        <Link href="/v2">
          <a className="bg-red-100 w-full h-screen flex justify-center items-center hover:bg-red-200">v2</a>
        </Link>

      </main>
    </div>
  );
};

export default Home;
