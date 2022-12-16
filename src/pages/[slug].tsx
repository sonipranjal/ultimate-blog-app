import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import MainLayout from "../Layouts/MainLayout";
import { trpc } from "../utils/trpc";
import UnsplashGallary from "../components/UnsplashGallary";
import Image from "next/image";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import { BsThreeDots } from "react-icons/bs";
import AnimatedSidebar from "../components/AnimatedSidebar";
import Avatar from "../components/Avatar";
import CommentsSidebar from "../components/CommetsSidebar";

const BlogPage = () => {
  const { query } = useRouter();
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();

  const {
    data: blog,
    isLoading,
    isError,
    isSuccess,
  } = trpc.post.getPost.useQuery(
    { slug: query.slug as string, userId: sessionData?.user?.id },
    {
      enabled: !!query.slug,
    }
  );

  const [{ isLiked, likesCount }, setLikesObject] = useState({
    isLiked: Boolean(blog?.likes && blog.likes.length > 0),
    likesCount: blog?._count.likes ?? 0,
  });

  useEffect(() => {
    setLikesObject({
      isLiked: Boolean(blog?.likes && blog.likes.length > 0),
      likesCount: blog?._count.likes ?? 0,
    });
  }, [blog]);

  const likePost = trpc.post.likePost.useMutation({
    onSuccess: () => {
      setLikesObject(({ likesCount }) => ({
        isLiked: true,
        likesCount: likesCount + 1,
      }));
      utils.post.getPost.invalidate({
        slug: query.slug as string,
        userId: sessionData?.user?.id,
      });
    },
  });
  const dislikePost = trpc.post.dislikePost.useMutation({
    onSuccess: () => {
      setLikesObject(({ likesCount }) => ({
        isLiked: false,
        likesCount: likesCount - 1,
      }));
      utils.post.getPost.invalidate({
        slug: query.slug as string,
        userId: sessionData?.user?.id,
      });
    },
  });

  const [openEditImageModal, setOpenEditImageModal] = useState(false);

  const editBlogImage = () => {
    setOpenEditImageModal(true);
  };

  const [openCommentSidebar, setOpenCommentSidebar] = useState(false);

  return (
    <MainLayout>
      <div className="relative col-span-full mx-auto flex w-full max-w-screen-xl flex-col justify-center p-6">
        <div className="fixed bottom-5 right-0 left-0 flex w-full items-center justify-center">
          {blog && (
            <div className="flex items-center space-x-4 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-gray-600 shadow-xl  transition-all duration-300 hover:border-gray-500 hover:text-gray-900">
              <div className="flex items-center space-x-1 border-r border-gray-300 pr-4">
                {(likePost.isLoading || dislikePost.isLoading) && (
                  <BsThreeDots className="animate-pulse text-2xl text-indigo-600" />
                )}

                {!likePost.isLoading &&
                  !dislikePost.isLoading &&
                  (isLiked ? (
                    <FcLike
                      className="cursor-pointer text-2xl"
                      onClick={() => dislikePost.mutate({ postId: blog.id })}
                    />
                  ) : (
                    <FcLikePlaceholder
                      className="cursor-pointer text-2xl"
                      onClick={() => likePost.mutate({ postId: blog.id })}
                    />
                  ))}

                <div className="text-xs">{likesCount}</div>
              </div>
              <div className="flex items-center space-x-0.5">
                <HiOutlineChatBubbleOvalLeft
                  strokeWidth={1}
                  className="cursor-pointer text-2xl"
                  onClick={() => setOpenCommentSidebar(true)}
                />
                <div className="text-xs">{blog?._count.comments}</div>
              </div>
            </div>
          )}
        </div>
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
                className="absolute top-5 left-5 z-10 cursor-pointer text-3xl text-gray-500 hover:text-black"
              />
              <div className="absolute inset-0 flex h-full w-full max-w-full items-center justify-center break-words  text-center  font-bold text-white">
                <span className="rounded-xl bg-black/40 p-4 text-4xl text-white">
                  {blog?.title}
                </span>
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

      {blog && (
        <CommentsSidebar
          postId={blog.id}
          openCommentSidebar={openCommentSidebar}
          onClose={() => setOpenCommentSidebar(false)}
          commentsCounts={blog?._count.comments ?? 0}
          slug={blog.slug}
        />
      )}
    </MainLayout>
  );
};

export default BlogPage;
