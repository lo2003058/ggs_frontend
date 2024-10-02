import React from 'react';
import {PencilIcon, ArchiveBoxXMarkIcon, EyeIcon} from '@heroicons/react/24/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function DataTable(
  {
    items, headers, route, onDelete,
    isShowViewButton = false, isShowEditButton = true, isShowDeleteButton = true
  }
) {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full border-separate border-spacing-0 border-b">
            <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header.key || index}
                  scope="col"
                  className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                >
                  {header.name}
                </th>
              ))}
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
              >
                <span className="sr-only">Edit</span>
              </th>
            </tr>
            </thead>
            <tbody>
            {items.map((item, rowIndex) => (
              <tr key={item.id || rowIndex}>
                {headers.map((header) => (
                  <td
                    key={header.key}
                    className={classNames(
                      'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                      header.key === 'name' ? 'font-medium text-gray-900' : ''
                    )}
                  >
                    {typeof header.key === 'string' && header.key.includes('.')
                      ? header.key.split('.').reduce((acc, part) => acc && acc[part], item)
                      : item[header.key] || '-'}
                  </td>
                ))}
                <td
                  className={'relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-8 lg:pr-8'}
                >
                  {
                    isShowViewButton ? (
                      <a
                        href={`/${route}/view/${item.id}`}
                      >
                        <button
                          className="rounded-full p-1 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          <EyeIcon className="h-5 w-5" aria-hidden="true"/>
                        </button>
                      </a>
                    ) : null
                  }
                  {
                    isShowEditButton ? (
                      <a
                        href={`/${route}/form/${item.id}`}
                      >
                        <button
                          className="rounded-full p-1 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          <PencilIcon className="h-5 w-5" aria-hidden="true"/>
                        </button>
                      </a>
                    ) : null
                  }
                  {
                    isShowDeleteButton ? (
                      <button
                        className="rounded-full p-1 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => onDelete(item.id, item.name)}
                      >
                        <ArchiveBoxXMarkIcon className="h-5 w-5" aria-hidden="true"/>
                      </button>
                    ) : null
                  }
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
