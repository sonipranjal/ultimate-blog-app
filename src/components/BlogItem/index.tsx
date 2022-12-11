import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { RouterOutputs } from "../../utils/trpc";
import Avatar from "../Avatar";
import Tag from "../Tag";

type BlogItemProps = RouterOutputs["post"]["getPosts"][number];

const BlogItem = ({
  author: { name, image, username },
  title,
  description,
  slug,
  featuredImage,
  createdAt,
  tags,
}: BlogItemProps) => {
  return (
    <div className="flex h-max w-full flex-col border-b border-gray-300 py-6 last:border-none">
      <Link
        href={`/u/${username}`}
        className="group flex w-full items-center space-x-4"
      >
        <div>
          <div className="relative h-10 w-10 rounded-full bg-gray-400">
            {image && <Avatar alt={name ?? ""} url={image} size="full" />}
          </div>
        </div>
        <div>
          <div>
            <span className="group-hover:underline">{name}</span> &#x2022;{" "}
            {new Date(createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div>The founder & teacher @ clubofcoders.com</div>
        </div>
      </Link>
      <Link href={`/${slug}`}>
        <div className="group grid grid-cols-12 place-items-center">
          <div className="col-span-8 flex flex-col space-y-4">
            <div className="text-xl font-extrabold group-hover:underline">
              {title}
            </div>
            <div className="text-sm text-gray-600">{description}</div>
          </div>
          <div className="col-span-4 w-full max-w-sm p-4">
            <div className="relative aspect-video transform rounded-xl bg-gray-400 shadow-xl transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:shadow-2xl">
              {featuredImage && (
                <Image
                  src={featuredImage}
                  fill
                  alt={title}
                  className="rounded-xl"
                />
              )}
            </div>
          </div>
        </div>
      </Link>
      <div className="flex w-full items-center space-x-4">
        {tags.map((tag) => (
          <Tag key={tag.id} name={tag.name} />
        ))}
      </div>
    </div>
  );
};

export default BlogItem;
