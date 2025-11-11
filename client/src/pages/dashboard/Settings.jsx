import { useEffect } from 'react';

const Settings = () => {
  useEffect(() => {
    document.title = 'Dashboard Settings • Resume Builder';

    return () => {
      document.title = 'Resume Builder';
    };
  }, []);

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Customize how the resume builder works for you. Feature controls are on the way—thank you for your
          patience while we finish this area.
        </p>
      </header>

      <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
        A richer settings experience is coming soon. Let us know which controls you want to see first!
      </div>
    </section>
  );
};

export default Settings;
