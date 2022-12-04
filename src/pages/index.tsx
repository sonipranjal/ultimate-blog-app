import React, { useContext } from "react";
import MainSection from "../components/MainSection";
import { GlobalContext } from "../contexts/GlobalContext";
import Modal from "../components/Modal";
import { trpc } from "../utils/trpc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MainLayout from "../Layouts/MainLayout";

interface IFormInputs {
  title: string;
  description: string;
  text: string;
}

export const postSchema = z.object({
  title: z.string().min(20).max(40),
  description: z.string().min(100).max(150),
  text: z.string().min(80),
});

const ErrorMessage = ({ errorMessage }: { errorMessage?: string }) => {
  return (
    <div className="w-full break-words text-sm text-red-500">
      <p>{errorMessage}</p>
    </div>
  );
};

const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>({
    resolver: zodResolver(postSchema),
  });

  const { openModal, setOpenModal } = useContext(GlobalContext);

  const { mutate } = trpc.post.createPost.useMutation({
    onSuccess: () => {
      setOpenModal(false);
      reset();
    },
  });

  const onSubmit = async (data: IFormInputs) => {
    mutate(data);
  };

  return (
    <MainLayout>
      <MainSection />
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-y-2"
        >
          <input
            type="text"
            {...register("title")}
            placeholder="title"
            className="w-full rounded-lg border bg-gray-50 p-4 outline-none focus:border-gray-600"
          />
          <ErrorMessage errorMessage={errors.title?.message} />
          <input
            type="text"
            {...register("description")}
            placeholder="short description"
            className="w-full rounded-lg border bg-gray-50 p-4 outline-none focus:border-gray-600"
          />
          <ErrorMessage errorMessage={errors.description?.message} />
          <textarea
            cols={30}
            rows={10}
            className="w-full rounded-lg border bg-gray-50 p-4 outline-none focus:border-gray-600"
            placeholder="write your text here..."
            {...register("text")}
          />
          <ErrorMessage errorMessage={errors.text?.message} />
          <div className="flex justify-end">
            <button
              type={"submit"}
              className="flex items-center space-x-2 rounded-lg px-4 py-2 ring-1 ring-gray-400"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default Home;
