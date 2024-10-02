import React from 'react';

function PageHeader({name, subtitle, route}) {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold leading-6 text-gray-900 capitalize">{name}</h1>
        <p className="mt-2 text-sm text-gray-700">
          {subtitle}
        </p>
      </div>
      <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <a
          href={`/${route}/form`}
          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add {route}
        </a>
      </div>
    </div>
  );
}

export default PageHeader;
