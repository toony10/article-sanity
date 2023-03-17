import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import Head from "next/head";
import Image from "next/image";
import { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface Props {
  post: Post;
}

interface IFormInputs {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

const post = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  console.log(post);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Head>
        <title>Article - {post.title}</title>
      </Head>
      <img
        src={urlFor(post.mainImage).url()!}
        className='w-full h-60 object-cover'
        alt='lol'
      />
      <article className='max-w-3xl mx-auto'>
        <h1 className='text-3xl mt10 mb-3'>{post.title}</h1>
        <h2 className='text-xl font-light text-gray-500 mb-2'>
          {post.description}
        </h2>
        <div className='flex items-center space-x-2'>
          <img
            src={urlFor(post.author.image).url()!}
            alt='author'
            className='h-10 w-10 rounded-full'
          />
          <p
            className='font-extralight text-sm'
            suppressHydrationWarning={true}>
            by <span className='font-semibold'>{post.author.name}</span> - at{" "}
            {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className='mt-10'>
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              normal: (props: any) => <p className='my-2' {...props} />,
              h1: (props: any) => (
                <h1 className='text-2xl font-bold my-5' {...props} />
              ),
              h2: (props: any) => (
                <>
                  <h2
                    className='text-xl font-bold my-5 inline-flex'
                    {...props}
                  />
                </>
              ),
              li: ({ children }: any) => (
                <li className='ml-4 list-disc'>{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a className='text-blue-500 hover:underline' href={href}>
                  {children}{" "}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className='max-w-lg my-5 mx-auto border border-yellow-500' />
      {submitted ? (
        <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
          <h3 className='text-3xl font-bold'>
            Thank you for submitted your comment !
          </h3>
          <p>Once it has been approved, it will appear below.</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col my-10 p-10 max-w-2xl mx-auto'>
          <h3 className='text-sm text-yellow-500'>Enjoyed this article? </h3>
          <h4 className='text-3xl font-bold'>Leave a comment below!</h4>
          <hr className='py-3 mt-2' />

          <input
            {...register("_id")}
            type='hidden'
            name='_id'
            value={post._id}
          />

          <label className='block mb-5'>
            <span className='text-gray-700'>Name</span>
            <input
              {...register("name", { required: true })}
              type='text'
              placeholder='Tony Stark'
              className='shadow border rounded py-2 px-3 mt-1 block w-full ring-yellow-500 focus:ring outline-none'
            />
          </label>
          <label className='block mb-5'>
            <span className='text-gray-700'>Email</span>
            <input
              {...register("email", { required: true })}
              type='email'
              placeholder='example@netcom.com'
              className='shadow border rounded py-2 px-3 mt-1 block w-full ring-yellow-500 focus:ring outline-none'
            />
          </label>
          <label className='block mb-5'>
            <span className='text-gray-700'>Comment</span>
            <textarea
              {...register("comment", { required: true })}
              placeholder='Good article!'
              className='shadow border rounded py-2 px-3 mt-1 block w-full ring-yellow-500 focus:ring outline-none'
            />
          </label>
          {/* Errors */}
          <div className='flex flex-col'>
            {errors.name && (
              <span className='text-red-500'>- The Name Field is required</span>
            )}
            {errors.email && (
              <span className='text-red-500'>
                - The Email Field is required
              </span>
            )}
            {errors.comment && (
              <span className='text-red-500'>
                - The Comment Field is required
              </span>
            )}
          </div>

          <input
            type='submit'
            className='shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer'
          />
        </form>
      )}
      <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2'>
        <h3 className='text-4xl'>Comments</h3>
        <hr className='bp-2' />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className='text-yellow-500'>{comment.name}:</span>{" "}
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
  _id,
    slug{
        current
    }
}`;
  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
    *[_type == "post" && slug.current == $slug][0] {
        _id,
        _createdAt,
        title,
        author -> {
            name,
            image
        },
        'comments': *[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true],
            description,
            mainImage,
            slug,
            body
    }
    `;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // Update the old cache after 60 seconds
  };
};
