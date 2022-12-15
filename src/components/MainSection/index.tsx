import React from "react";
import { BiChevronDown } from "react-icons/bi";
import { TfiSearch } from "react-icons/tfi";
import { trpc } from "../../utils/trpc";
import BlogItem from "../BlogItem";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Tag from "../Tag";
import { useSession } from "next-auth/react";

const MainSection = () => {
  const { data } = useSession();

  const {
    data: posts,
    isSuccess,
    isLoading,
    isError,
  } = trpc.post.getPosts.useQuery({
    userId: data?.user?.id,
  });

  const { data: tags } = trpc.tag.getTags.useQuery();

  return (
    <section className="col-span-8 flex flex-col border-r border-gray-300 px-20">
      <div className="flex w-full items-center justify-between p-4">
        <div className="relative w-full max-w-md">
          <label className="absolute top-3.5 left-4 text-base text-gray-700">
            <TfiSearch />
          </label>
          <input
            type="text"
            name=""
            id=""
            className="w-full rounded-3xl border border-gray-500 px-10 py-2 outline-none placeholder:text-sm placeholder:font-light placeholder:text-gray-400"
            placeholder="Search.."
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="whitespace-nowrap text-gray-700">My topics:</div>
          <div className="flex w-full items-center space-x-2">
            {/* todo: if user logged in, show tags that interest user, otherwise shows most popular tags */}
            {tags &&
              tags
                .slice(0, 4)
                .map((tag) => <Tag name={tag.name} key={tag.id} />)}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between border-b-2 border-gray-200 px-10 py-5">
        <div className="text-gray-900">Articles</div>
        <div className="flex items-center space-x-2 rounded-3xl border border-gray-400 px-4 py-2 text-sm font-semibold">
          <span>Following</span>
          <span className="text-lg">
            <BiChevronDown />
          </span>
        </div>
      </div>
      <div className="relative flex h-full w-full flex-col space-y-4">
        {isError && (
          <p className="p-4 text-sm text-gray-800">
            Something went wrong while fetching the blog posts!
          </p>
        )}

        {isLoading && (
          <div className="absolute inset-0 m-5 flex animate-pulse items-center justify-center rounded-xl bg-gradient-to-tr from-slate-200 via-gray-300 to-neutral-400  p-4">
            <AiOutlineLoading3Quarters
              className="animate-spin text-black"
              size={50}
            />
          </div>
        )}
        {isSuccess && posts.map((post, i) => <BlogItem key={i} {...post} />)}
      </div>
    </section>
  );
};

export default MainSection;
