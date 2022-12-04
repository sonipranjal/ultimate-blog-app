import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { RouterOutputs } from "../../utils/trpc";

type BlogItemProps = RouterOutputs["post"]["getPosts"][number];

const BlogItem = ({
  author: { name, image, username },
  title,
  description,
  slug,
}: BlogItemProps) => {
  return (
    <div className="flex w-full flex-col border-b border-gray-300 py-6 last:border-none">
      <Link
        href={`/p/${username}`}
        className="group flex w-full items-center space-x-4"
      >
        <div>
          <div className="relative h-10 w-10 rounded-full bg-gray-400">
            {image && (
              <Image
                alt={name ?? ""}
                fill
                src={image}
                className="rounded-full"
              />
            )}
          </div>
        </div>
        <div>
          <div>
            <span className="group-hover:underline">{name}</span> &#x2022; Nov
            30, 2022
          </div>
          <div>The founder & teacher @ clubofcoders.com</div>
        </div>
      </Link>
      <Link href={slug}>
        <div className="group grid grid-cols-12 place-items-center">
          <div className="col-span-8 flex flex-col space-y-4">
            <div className="text-xl font-extrabold group-hover:underline">
              {title}
            </div>
            <div className="text-sm text-gray-600">{description}</div>
          </div>
          <div className="col-span-4 w-full max-w-xs p-4">
            <div className="aspect-video rounded-xl bg-gray-400"></div>
          </div>
        </div>
      </Link>
      <div className="flex w-full items-center space-x-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            className="rounded-3xl bg-gray-200 px-5 py-3 text-sm text-black"
            key={i}
          >
            {i}Design
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogItem;
