import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import { HiXMark } from "react-icons/hi2";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import AnimatedSidebar from "../AnimatedSidebar";
import Avatar from "../Avatar";

import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
dayjs.extend(relativeTime);

type CommentsSidebarProps = {
  openCommentSidebar: boolean;
  onClose: () => void;
  commentsCounts: number;
  postId: string;
  slug: string;
};

type commentType = {
  text: string;
};

const commentSchema = z.object({
  text: z.string().min(5),
});

const CommentsSidebar = ({
  openCommentSidebar,
  onClose,
  commentsCounts,
  postId,
  slug,
}: CommentsSidebarProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<commentType>({
    resolver: zodResolver(commentSchema),
  });

  const utils = trpc.useContext();
  const comments = trpc.comment.getComments.useQuery({ postId });

  const { data: userSession } = useSession();

  const createComment = trpc.comment.createComment.useMutation({
    onSuccess: () => {
      utils.comment.getComments.invalidate({ postId }), reset();
      utils.post.getPost.invalidate({ userId: userSession?.user?.id, slug });
    },
  });

  return (
    <AnimatedSidebar
      side="right"
      toggleSidebar={openCommentSidebar}
      onClose={onClose}
    >
      <div className="flex h-full w-full justify-end">
        <div className="relative flex h-screen max-h-screen w-full max-w-md flex-col rounded-xl bg-white p-10">
          <div className="my-2 flex items-center justify-between text-xl">
            <h2 className=" text-black">Responses ({commentsCounts})</h2>
            <HiXMark
              onClick={onClose}
              className="cursor-pointer transition-all duration-300 hover:text-gray-900"
            />
          </div>
          <form
            action=""
            onSubmit={handleSubmit((data) => {
              createComment.mutate({
                ...data,
                postId,
              });
            })}
            className="transition-all duration-300"
          >
            <div className="my-4">
              <textarea
                id="comment"
                placeholder="What are your thoughts?"
                className="w-full rounded-lg border p-4 shadow-md outline-none placeholder:text-sm focus:border-gray-600"
                {...register("text")}
                rows={2}
                disabled={createComment.isLoading}
              />
            </div>
            <div className="flex w-full justify-end">
              {isValid && (
                <button
                  type="submit"
                  className="flex items-center space-x-2 rounded-lg px-4 py-2 ring-1 ring-gray-400"
                >
                  {createComment.isLoading ? "Loading..." : "Comment"}
                </button>
              )}
            </div>
          </form>
          <div className="mt-10 flex flex-col space-y-8 overflow-y-auto">
            {comments.data &&
              comments.data.map((comment) => (
                <div
                  key={comment.id}
                  className="flex flex-col justify-center space-y-3 border-b border-b-gray-200 pb-8 last:border-none"
                >
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10">
                      <Avatar size="full" url={comment.user.image} />
                    </div>
                    <div>
                      <p className="text-base text-gray-900">
                        {comment.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dayjs(comment.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{comment.text}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </AnimatedSidebar>
  );
};

export default CommentsSidebar;
