import React from "react";
import { IoReader } from "react-icons/io5";

const Sidebar = () => {
  return (
    <section className="col-span-4 flex flex-col items-center space-y-8 p-10">
      <div className="">
        <div className="grid grid-cols-12 rounded-xl bg-gradient-to-br from-gray-200 via-gray-200/50 to-gray-300 p-8">
          <div className="col-span-9 grid grid-cols-1 gap-y-4">
            <div>
              <div className="font-lg font-bold text-gray-900">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequuntur.
              </div>
              <div className="text-sm font-medium text-gray-600">
                Lorem ipsum dolor sit Lorem, ipsum.
              </div>
            </div>
            <div>
              <div className="w-fit rounded-3xl bg-gray-300 px-4 py-2 text-sm text-gray-700">
                Get unlimited access
              </div>
            </div>
          </div>
          <div className="col-span-3 grid w-full place-items-center">
            <IoReader size={115} className="text-white" />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col space-y-6">
        <div className="font-bold">People you might be interested</div>
        <div className="flex w-full flex-col space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="grid w-full grid-cols-12 gap-2" key={i}>
              <div className="col-span-2">
                <div className="h-12 w-12 rounded-full bg-gray-400"></div>
              </div>
              <div className="col-span-7 flex flex-col">
                <div className="text-sm font-bold">John Doe</div>
                <div className="text-xs font-normal">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Illo, ut.
                </div>
              </div>
              <div className="col-span-3">
                <button className="flex items-center space-x-2 rounded-lg px-4 py-2 ring-1 ring-gray-400">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col space-y-6">
        <div className="font-bold">My reading list</div>
        <div className="flex flex-col space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid grid-cols-10 gap-4">
              <div className="col-span-4 w-full max-w-xs">
                <div className="aspect-square rounded-xl bg-gray-400"></div>
              </div>
              <div className="col-span-6 flex flex-col justify-around">
                <div className="text-base font-bold text-gray-900">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Consequuntur.
                </div>
                <div className="text-sm">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Officiis deserunt deleniti, quibusdam sint assumenda vel
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="h-8 w-8 rounded-full bg-gray-400"></div>
                  <div>John snow</div>
                  <div>&#x2022;</div>
                  <div>Nov 20, 2022</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
