import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { z } from "zod";
import { GlobalContext } from "../../contexts/GlobalContext";
import { trpc } from "../../utils/trpc";
import { ErrorMessage } from "../FormModal";
import Modal from "../Modal";

export const tagSchema = z.object({
  name: z.string().min(3).max(20),
  description: z.string().min(10).max(400),
});

const TagFormModal = () => {
  const { setOpenTagModal, openTagModal } = useContext(GlobalContext);

  const utils = trpc.useContext();

  const {
    mutate: createTag,
    isLoading,
    error,
  } = trpc.tag.createTag.useMutation({
    onSuccess: () => {
      toast.success("tag added successfully!");
      reset();
      utils.tag.getTags.invalidate();
      setOpenTagModal(false);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ name: string; description: string }>({
    resolver: zodResolver(tagSchema),
  });

  return (
    <Modal isOpen={openTagModal} onClose={() => setOpenTagModal(false)}>
      {isLoading && (
        <div className="absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-10">
          <BiLoaderCircle className="h-10 w-10 animate-spin text-black" />
        </div>
      )}
      <form
        onSubmit={handleSubmit((data) => createTag(data))}
        className="relative grid grid-cols-1 gap-y-2"
      >
        <input
          type="text"
          {...register("name")}
          placeholder="Nextjs"
          className="w-full rounded-lg border p-4 shadow outline-none focus:border-gray-600"
        />
        <ErrorMessage errorMessage={errors.name?.message || error?.message} />

        <textarea
          {...register("description")}
          placeholder="Nextjs is framework of Reactjs, it is used to develop production ready applications fast with a great developer experience"
          className="w-full rounded-lg border p-4 shadow outline-none focus:border-gray-600"
          rows={5}
        />
        <ErrorMessage errorMessage={errors.description?.message} />

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
  );
};

export default TagFormModal;
