import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import A from "../public/A letter.png";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";
interface Props {
  posts: [Post];
}
const Home = ({ posts }: Props) => {
  console.log(posts);
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
        <Image src={A} alt='LOL' className='hidden md:inline-flex lg:h-full' />
      </div>

      {/* Posts */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className='group cursor-pointer border rounded-lg overflow-hidden'>
              {post.mainImage && (
                <img
                  className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out'
                  src={urlFor(post.mainImage).url()!}
                  alt=''
                />
              )}
              <div className='flex justify-between p-5 bg-white'>
                <div>
                  <p className='text-lg font-bold'>{post.title}</p>
                  <p className='text-xs'>
                    {post.description} (by {post.author.name})
                  </p>
                </div>

                <img
                  className='h-12 w-12 rounded-full object-cover'
                  src={urlFor(post.author.image).url()!}
                  alt=''
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
  _id,
    title,
    author -> {
      name,
      image
    },
  description,
    mainImage,
    slug,
}`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
