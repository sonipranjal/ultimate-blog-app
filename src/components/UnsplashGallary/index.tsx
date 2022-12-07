import { zodResolver } from "@hookform/resolvers/zod";
import type { Post } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { z } from "zod";
import useDebounce from "../../hooks/useDebounce";
import { trpc } from "../../utils/trpc";
import Modal from "../Modal";

enum SELECT_FROM {
  UNSPLASH = "UNSPLASH",
  LOCAL = "LOCAL",
}

export const querySchema = z.object({
  query: z.string().min(5),
});

type UnsplashGallaryProps = {
  openEditImageModal: boolean;
  closeModal: () => void;
  currentPost: Post;
};

const UnsplashGallary = ({
  openEditImageModal,
  closeModal,
  currentPost,
}: UnsplashGallaryProps) => {
  const [selectImageOption, setSelectImageOption] =
    useState<SELECT_FROM | null>(null);
  const [showUnsplashGallary, setShowUnsplashGallary] = useState(false);

  const [selectedImageUrl, setSelectedImageUrl] = useState("");

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

  const { data, isLoading: isGallaryLoading } =
    trpc.unsplash.getImages.useQuery(
      { query: debouncedSearch },
      {
        enabled: !!debouncedSearch,
      }
    );

  const trpcUtils = trpc.useContext();

  const { mutate, isLoading: isUpdatePostLoading } =
    trpc.post.updatePost.useMutation({
      onSuccess() {
        trpcUtils.post.getPost
          .invalidate({ slug: currentPost.slug })
          .then(() => {
            closeModal();
            toast.success("successfully updated featured image 🥳");
          })
          .catch(() => {
            toast.error("oh no, something went wrong ☹️");
          })
          .finally(() => {
            setSelectedImageUrl("");
          });
      },
    });

  const handleConfirmImage = () => {
    mutate({
      postId: currentPost.id,
      featuredImage: selectedImageUrl,
    });
  };

  return (
    <div>
      <Modal isOpen={openEditImageModal} onClose={closeModal}>
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
              <div className="flex max-h-[60vh] flex-col space-y-4 p-5">
                <div>
                  <input
                    type="text"
                    id="search"
                    className="w-full rounded-lg border bg-gray-50 p-4 outline-none focus:border-gray-600"
                    {...register("query")}
                  />
                </div>
                <div className="grid grid-cols-3 place-items-center gap-4 overflow-y-auto">
                  {isGallaryLoading && (
                    <div className="col-span-full flex h-80 w-full animate-pulse items-center justify-center rounded-xl bg-gradient-to-tr from-slate-100 via-gray-200 to-neutral-300 p-4">
                      <BiLoader className="h-10 w-10 animate-spin text-black" />
                    </div>
                  )}
                  {data?.results.map((photo) => (
                    <div key={photo.id} className="relative">
                      <Image
                        src={photo.urls.small}
                        alt={photo.alt_description ?? photo.description ?? ""}
                        width={photo.width}
                        height={photo.height}
                      />
                      <div
                        onClick={() => setSelectedImageUrl(photo.urls.full)}
                        className={`absolute inset-0 h-full w-full cursor-pointer hover:bg-black/20
                          ${
                            selectedImageUrl === photo.urls.full &&
                            "bg-black/40"
                          }
                        `}
                      />
                    </div>
                  ))}
                </div>
                {selectedImageUrl && (
                  <button
                    onClick={handleConfirmImage}
                    disabled={isUpdatePostLoading}
                    className="flex w-full transform items-center justify-center space-x-2 rounded-lg border bg-white p-5 px-4 py-2 transition hover:bg-black/10 active:scale-95"
                  >
                    {isUpdatePostLoading ? "Loading..." : "Confirm"}
                  </button>
                )}
              </div>
            )}
        </div>
      </Modal>
    </div>
  );
};

export default UnsplashGallary;
