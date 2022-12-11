import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Avatar from "../../components/Avatar";
import MainLayout from "../../Layouts/MainLayout";
import { SlShareAlt } from "react-icons/sl";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import BlogItem from "../../components/BlogItem";
import { trpc } from "../../utils/trpc";
import { BiEdit } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const UserProfilePage = () => {
  const { query } = useRouter();

  const { data: userProfile } = trpc.user.getUserProfile.useQuery(
    {
      username: query.username as string,
    },
    {
      enabled: !!query.username,
    }
  );

  const {
    data: posts,
    isSuccess,
    isLoading,
    isError,
  } = trpc.post.getPosts.useQuery();

  const { mutate: uploadAvatarToServer, isLoading: isImageUploading } =
    trpc.user.uploadAvatar.useMutation({
      onSuccess: () => {
        toast.success("avatar changed successfully!");
      },
    });

  const [image, setImage] = useState<File | null>(null);
  const [createObjectURL, setCreateObjectURL] = useState<string | null>(null);

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const i = e.target.files[0];

      if (i.size > 1.5 * 1000000) {
        return toast.error("image size should not exceed 1.5mb");
      }

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));

      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        if (fileReader.result) {
          uploadAvatarToServer({
            imageBase64DataURI: fileReader.result as string,
            mimetype: i.type,
          });
        }
      };
      fileReader.readAsDataURL(i);
    }
  };

  return (
    <MainLayout>
      <div className="col-span-full mx-auto flex h-full w-full flex-col items-center p-10 lg:max-w-screen-lg xl:max-w-screen-xl">
        <div className="grid w-full grid-rows-2 rounded-xl bg-white shadow-md">
          <div className="relative max-h-52 rounded-t-xl bg-gradient-to-tr from-[#F8E1AC] via-[#F6D9BE] to-[#F6CFCD]">
            <div className="absolute left-10 -bottom-10">
              <div className="relative">
                {isImageUploading && (
                  <div className="absolute inset-0 z-10 h-full w-full animate-pulse rounded-full bg-black bg-opacity-30" />
                )}
                {createObjectURL ? (
                  <Avatar size="l" url={createObjectURL} />
                ) : (
                  userProfile?.image && (
                    <Avatar size="l" url={userProfile?.image} />
                  )
                )}
                <form>
                  <label
                    id="avatar"
                    htmlFor="avatarButton"
                    className="group absolute inset-0 z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-full text-3xl text-white transition-all hover:bg-black/20"
                  >
                    <BiEdit className="invisible group-hover:visible" />
                  </label>
                  <input
                    type="file"
                    id="avatarButton"
                    name="avatar"
                    className="hidden"
                    accept="image/*"
                    onChange={onChangeImage}
                    disabled={isLoading}
                  />
                </form>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 px-12 pt-10 pb-5">
            <div className="text-3xl font-semibold text-gray-800">
              {userProfile?.name}
            </div>
            <div className="text-xl text-gray-500">
              @{userProfile?.username}
            </div>
            <div className="text-base text-gray-500">5 posts</div>
            <div>
              <button className="flex transform items-center space-x-2  rounded-lg border border-gray-500 px-4 py-2 text-gray-500 transition-all duration-300 hover:border-gray-900 hover:text-gray-900 active:scale-95">
                <div>
                  <SlShareAlt />
                </div>
                <div className="text-sm">Share Profile</div>
              </button>
            </div>
          </div>
        </div>
        <div></div>
        {isLoading && (
          <div className="absolute inset-0 m-5 flex animate-pulse items-center justify-center rounded-xl bg-gradient-to-tr from-slate-200 via-gray-300 to-neutral-400  p-4">
            <AiOutlineLoading3Quarters
              className="animate-spin text-black"
              size={50}
            />
          </div>
        )}
        {isSuccess && posts.map((post, i) => <BlogItem key={i} {...post} />)}
        <div></div>
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;
