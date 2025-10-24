import React from "react";
import Navbar from "../components/Navbar";
import { PlusIcon, UploadCloudIcon } from "lucide-react";

const Dashboard = () => {
  return (
    <>
      <div className="max-w-7xl px-16 py-8">
        <span className="text-sm font-normal text-gray-900 dark:text-gray-100">
          Welcome,{" "}
          <span className="font-bold text-gray-900 dark:text-gray-100">
            Zardron
          </span>
          <div className="flex gap-2 mt-4">
            <button className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 hover:shadow-md hover:border-dashed transition-all duration-300 cursor-pointer">
              <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-full text-white" />
              <p className="text-xs group-hover:text-indigo-600 transition-all duration-300 mt-2">
                Create Resume
              </p>
            </button>

            <button className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 hover:shadow-md hover:border-dashed transition-all duration-300 cursor-pointer">
              <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] rounded-full text-white" />
              <p className="text-xs group-hover:text-[var(--accent-color)] transition-all duration-300 mt-2">
                Upload Existing
              </p>
            </button>
          </div>
        </span>
      </div>
    </>
  );
};

export default Dashboard;
