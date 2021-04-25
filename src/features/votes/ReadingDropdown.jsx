import React, { useEffect, Fragment } from 'react';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import { firestore } from '../../utils/firebase';
import { classNames, archivePoll, unArchivePoll } from './voteHelpers'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'


export const ReadingDropdown = ({ send, poll, transition, }) => {

  const { id, title, deadline, archived } = poll;

  return (
    <Menu as="div" className="relative inline-block text-left z-10">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
              Options
              <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="py-1">
                <Menu.Item onClick={() => send('TOGGLED')} >
                  {({ active }) => (
                    <p

                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Edit
                    </p>
                  )}
                </Menu.Item>

                {archived ? <Menu.Item onClick={() => unArchivePoll(id, transition)}>

                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Unarchive
                    </a>
                  )}
                </Menu.Item>
                  :
                  <Menu.Item onClick={() => archivePoll(id, transition)}>
                    {({ active }) => (
                      <p
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Archive
                      </p>
                    )}
                  </Menu.Item>
                }
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}