import React from 'react';
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

const DataTableSearch = ({value, onChange}) => {
  return (
    <div className="my-6 flex rounded-md shadow-sm">
      <div className="relative flex flex-grow items-stretch focus-within:z-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5 text-gray-400"/>
        </div>
        <input
          id="keyword"
          name="keyword"
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Search what you want..."
          className="block w-full h-12 rounded-3xl border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}

export default DataTableSearch;
