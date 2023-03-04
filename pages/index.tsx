import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import NavBar from "../components/NavBar";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Article</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
    </div>
  );
};

export default Home;
