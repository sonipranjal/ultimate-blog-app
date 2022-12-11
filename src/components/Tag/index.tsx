import React from "react";
import { type IconType } from "react-icons";

type TagProps = {
  onClick?: () => void;
  Icon?: IconType;
  name: string;
};

const Tag = ({ onClick, Icon, name }: TagProps) => {
  return (
    <div className="my-2 flex items-center space-x-2 rounded-md bg-gradient-to-br from-gray-200 via-gray-200/50 to-gray-300 px-4 py-2.5 text-sm text-gray-900">
      <div>{name}</div>
      {Icon && (
        <div onClick={onClick} className="cursor-pointer">
          <Icon className="text-gray-500" />
        </div>
      )}
    </div>
  );
};

export default Tag;
