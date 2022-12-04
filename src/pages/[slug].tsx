import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import Modal from "../components/Modal";
import MainLayout from "../Layouts/MainLayout";
import { trpc } from "../utils/trpc";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useDebounce from "../hooks/useDebounce";
import Image from "next/image";

enum SELECT_FROM {
  UNSPLASH = "UNSPLASH",
  LOCAL = "LOCAL",
}

export const querySchema = z.object({
  query: z.string().min(5),
});

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
  const [selectImageOption, setSelectImageOption] =
    useState<SELECT_FROM | null>(null);
  const [showUnsplashGallary, setShowUnsplashGallary] = useState(false);

  const editBlogImage = () => {
    setOpenEditImageModal(true);
  };

  useEffect(() => {
    if (selectImageOption === SELECT_FROM.UNSPLASH) {
      setShowUnsplashGallary(true);
    }
  }, [selectImageOption]);

  const { register, watch } = useForm<{ query: string }>({
    resolver: zodResolver(querySchema),
  });

  const watchQuery = watch("query");
  const debouncedSearch = useDebounce(watchQuery, 1500);

  const { data } = trpc.unsplash.getImages.useQuery(
    { query: debouncedSearch },
    {
      enabled: !!debouncedSearch,
    }
  );
  console.log(data);

  return (
    <MainLayout>
      <div className="col-span-full mx-auto flex w-full max-w-screen-xl flex-col justify-center p-6">
        {isSuccess && (
          <div className="flex flex-col justify-center space-y-4">
            <div className="relative mb-10 h-[60vh] w-full rounded-3xl bg-gray-300 p-28 shadow-xl">
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
      <Modal
        isOpen={openEditImageModal}
        onClose={() => {
          setOpenEditImageModal(false);
        }}
      >
        <div className="relative">
          {showUnsplashGallary && (
            <div
              onClick={() => {
                setSelectImageOption(null);
              }}
              className="w-max cursor-pointer text-4xl text-gray-500 hover:text-gray-900"
            >
              <IoIosArrowRoundBack />
            </div>
          )}
          {!Boolean(selectImageOption) && (
            <div className="my-10 flex w-full flex-row justify-center space-x-10 transition-all">
              <div
                className="w-max transform cursor-pointer whitespace-nowrap rounded-lg bg-gradient-to-br from-gray-200 via-gray-200/50 to-gray-300 p-4 text-lg font-medium text-gray-900/60 ring-1 ring-gray-300   delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-gradient-to-tl hover:text-black hover:shadow-xl"
                onClick={() => setSelectImageOption(SELECT_FROM.UNSPLASH)}
              >
                Choose Image from Unsplash
              </div>
              <div className="w-max transform cursor-pointer whitespace-nowrap rounded-lg bg-gradient-to-br from-gray-200 via-gray-200/50 to-gray-300 p-4 text-lg font-medium text-gray-900/60 ring-1 ring-gray-300   delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-gradient-to-tl hover:text-black hover:shadow-xl">
                Select from your Computer
              </div>
            </div>
          )}

          {showUnsplashGallary &&
            selectImageOption === SELECT_FROM.UNSPLASH && (
              <div className="flex max-h-[60vh] flex-col space-y-4">
                <div>
                  <input
                    type="text"
                    id="search"
                    className="w-full rounded-lg border bg-gray-50 p-4 outline-none focus:border-gray-600"
                    {...register("query")}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 overflow-y-auto">
                  {data?.results.map((photo) => (
                    <div key={photo.id}>
                      <Image
                        src={photo.urls.small}
                        alt={photo.alt_description ?? photo.description ?? ""}
                        width={photo.width}
                        height={photo.height}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </Modal>
    </MainLayout>
  );
};

export default BlogPage;
