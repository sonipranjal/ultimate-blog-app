import React from "react";
import { BiChevronDown } from "react-icons/bi";
import { TfiSearch } from "react-icons/tfi";
import { trpc } from "../../utils/trpc";
import BlogItem from "../BlogItem";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Tag from "../Tag";
import { useSession } from "next-auth/react";
import InfiniteScroll from "react-infinite-scroll-component";

const MainSection = () => {
  const { data } = useSession();

  const posts = trpc.post.getPosts.useInfiniteQuery(
    {
      userId: data?.user?.id,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

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
        {posts.isError && (
          <p className="p-4 text-sm text-gray-800">
            Something went wrong while fetching the blog posts!
          </p>
        )}

        {posts.isLoading && (
          <div className="absolute inset-0 m-5 flex animate-pulse items-center justify-center rounded-xl bg-gradient-to-tr from-slate-200 via-gray-300 to-neutral-400  p-4">
            <AiOutlineLoading3Quarters
              className="animate-spin text-black"
              size={50}
            />
          </div>
        )}

        <InfiniteScroll
          dataLength={
            posts.data?.pages.flatMap((page) => page.posts).length ?? 0
          } //This is important field to render the next data
          next={posts.fetchNextPage}
          hasMore={Boolean(posts.hasNextPage)}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p className="text-center font-bold">
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {posts.isSuccess &&
            posts.data.pages
              .flatMap((page) => page.posts)
              .map((post, i) => <BlogItem key={i} {...post} />)}
        </InfiniteScroll>
      </div>
    </section>
  );
};

export default MainSection;
