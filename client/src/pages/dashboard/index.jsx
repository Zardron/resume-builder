import React from "react";
import { File, PlusIcon, PencilIcon, TrashIcon} from "lucide-react";
import { Link } from "react-router-dom";



const Dashboard = () => {
  return (
    <>
      <div className="mx-auto px-16 py-8">
        <div className="w-full flex items-center justify-center mb-10">
          <span className="text-lg text-gray-900 dark:text-gray-100 text-center">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              Welcome to your Smart Resume Builder Dashboard.
            </span>
            <p className="text-sm font-thin text-gray-900 dark:text-gray-100">
              Craft a professional, standout resume in minutes — powered by AI.
            </p>
          </span>
        </div>
        <div className="w-full flex items-center justify-center gap-4">
          <Link
            className="w-full bg-white dark:bg-gray-800 max-w-36 h-48 flex flex-col items-center justify-center rounded-lg border border-gray-300 dark:border-white/50 hover:shadow-md hover:border-dashed transition-all duration-300 cursor-pointer"
            to={`/dashboard/builder`}
            state={{ builder: "new-resume" }}
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-full text-white" />
            <p className="text-xs group-hover:text-indigo-600 transition-all duration-300 mt-2">
              Create Resume
            </p>
          </Link>

          <Link
            className="w-full bg-white dark:bg-gray-800 max-w-36 h-48 flex flex-col items-center justify-center rounded-lg border border-gray-300 dark:border-white/50 hover:shadow-md hover:border-dashed transition-all duration-300 cursor-pointer"
            to={`/dashboard/builder`}
            state={{ builder: "existing-resume" }}
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] rounded-full text-white" />
            <p className="text-xs group-hover:text-indigo-600 transition-all duration-300 mt-2">
              Upload Existing
            </p>
          </Link>
        </div>

        <hr className="w-full border-gray-200 dark:border-gray-700 my-4" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <button className="group w-full relative h-48 flex flex-col items-center justify-center rounded-lg border border-[var(--primary-color)] dark:border-white/50 hover:shadow-xs hover:shadow-gray-500 dark:hover:shadow-black hover:translate-x-[2px] hover:translate-y-[-2px] bg-gradient-to-r from-[var(--gradient-primary-color)] to-[var(--gradient-accent-color)] transition-all duration-300 cursor-pointer">
            <File className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-full text-white border border-white" />
            <p className="text-xs group-hover:text-[var(--primary-color)] transition-all duration-300 mt-2">
              Zardron's Resume
            </p>

            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center flex-col">
              <p className="text-xs">Last updated:</p>
              <p className="text-xs font-thin">10/24/2025</p>
            </div>

            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <PencilIcon className="size-4 text-[var(--ai-blue)] transition-all duration-300 hover:scale-110" />
              <TrashIcon className="size-4 text-red-500 transition-all duration-300 hover:scale-110" />
            </div>
          </button>

          <button className="group w-full relative h-48 flex flex-col items-center justify-center rounded-lg border border-[var(--primary-color)] dark:border-white/50 hover:shadow-xs hover:shadow-gray-500 dark:hover:shadow-black hover:translate-x-[2px] hover:translate-y-[-2px] bg-gradient-to-r from-[var(--gradient-primary-color)] to-[var(--gradient-accent-color)] transition-all duration-300 cursor-pointer">
            <File className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-full text-white border border-white" />
            <p className="text-xs group-hover:text-[var(--primary-color)] transition-all duration-300 mt-2">
              Alaine's Resume
            </p>

            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center flex-col">
              <p className="text-xs">Last updated:</p>
              <p className="text-xs font-thin">10/24/2025</p>
            </div>

            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <PencilIcon className="size-4 text-[var(--ai-blue)] transition-all duration-300 cursor-pointer hover:scale-110" />
              <TrashIcon className="size-4 text-red-500 transition-all duration-300 cursor-pointer hover:scale-110" />
            </div>
          </button>

          <button className="group w-full relative h-48 flex flex-col items-center justify-center rounded-lg border border-[var(--primary-color)] dark:border-white/50 hover:shadow-xs hover:shadow-gray-500 dark:hover:shadow-black hover:translate-x-[2px] hover:translate-y-[-2px] bg-gradient-to-r from-[var(--gradient-primary-color)] to-[var(--gradient-accent-color)] transition-all duration-300 cursor-pointer">
            <File className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-full text-white border border-white" />
            <p className="text-xs group-hover:text-[var(--primary-color)] transition-all duration-300 mt-2">
              Zaine's Resume
            </p>

            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center flex-col">
              <p className="text-xs">Last updated:</p>
              <p className="text-xs font-thin">10/24/2025</p>
            </div>

            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <PencilIcon className="size-4 text-[var(--ai-blue)] transition-all duration-300 cursor-pointer hover:scale-110" />
              <TrashIcon className="size-4 text-red-500 transition-all duration-300 cursor-pointer hover:scale-110" />
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
