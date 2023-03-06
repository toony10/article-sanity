import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import A from "../public/A letter.png";
const Home: NextPage = () => {
  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Article</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex justify-between items-center bg-yellow-400 border-black py-10 lg:py-0'>
        <div className='px-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif'>
            <span className='underline decoration-black decoration-4'>
              Article
            </span>{" "}
            is a place to write, read,and connect
          </h1>
          <p>
            it's easy and free to post thinking on any topic and connect with
            millions of reader
          </p>
        </div>
        <Image
          src={A}
          alt='LOL'
          className='hidden md:inline-flex h-32 lg:h-full'
        />
      </div>
    </div>
  );
};

export default Home;
