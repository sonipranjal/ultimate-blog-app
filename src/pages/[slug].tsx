import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import MainLayout from "../Layouts/MainLayout";
import { trpc } from "../utils/trpc";
import UnsplashGallary from "../components/UnsplashGallary";
import Image from "next/image";

const BlogPage = () => {
  const { query } = useRouter();

  const {
    data: blog,
    isLoading,
    isError,
    isSuccess,
  } = trpc.post.getPost.useQuery(
    { slug: query.slug as string },
    {
      enabled: !!query.slug,
    }
  );

  const [openEditImageModal, setOpenEditImageModal] = useState(false);

  const editBlogImage = () => {
    setOpenEditImageModal(true);
  };

  return (
    <MainLayout>
      <div className="col-span-full mx-auto flex w-full max-w-screen-xl flex-col justify-center p-6">
        {isSuccess && (
          <div className="flex flex-col justify-center space-y-4">
            <div className="relative mb-10 h-[60vh] w-full rounded-3xl bg-gray-300 p-28 shadow-xl">
              {blog?.featuredImage && (
                <Image
                  src={blog?.featuredImage}
                  alt={blog.title}
                  fill
                  className="rounded-3xl object-cover"
                />
              )}
              <BiEdit
                onClick={editBlogImage}
                className="absolute top-5 left-5 cursor-pointer text-3xl text-gray-500 hover:text-black"
              />
              <div className="absolute -bottom-4 w-full max-w-full break-words text-3xl font-bold text-gray-700">
                {blog?.title}
              </div>
            </div>
            <div className="border-l-4 border-black pl-4 text-sm text-gray-700">
              {blog?.description}
            </div>
            <div className="text-lg text-gray-700">{blog?.text}</div>
          </div>
        )}
      </div>
      {blog && (
        <UnsplashGallary
          openEditImageModal={openEditImageModal}
          closeModal={() => setOpenEditImageModal(false)}
          currentPost={blog}
        />
      )}
    </MainLayout>
  );
};

export default BlogPage;
