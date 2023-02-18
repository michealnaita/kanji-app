import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

export default function Modal({
  isOpen,
  closeModal,
  proceed,
  action,
}: {
  isOpen: boolean;
  closeModal: () => void;
  proceed: () => void;
  action: 'leave' | 'join';
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-skin-secondary p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="font-semibold  text-skin-off-white text-2xl"
                >
                  {action[0].toUpperCase() + action.slice(1)} Household
                </Dialog.Title>
                {action === 'join' && (
                  <div className="mt-2 font-sm space-y-1 text-skin-secondary">
                    <p className="font-semibold text">
                      Joining this household means that;
                    </p>
                    <p className="text-skin-secondary">
                      <span className="text-skin-orange">&#x2022;</span> Your
                      balance will be automatically deducted when the house is
                      full.
                    </p>
                    <p className="text-skin-secondary">
                      <span className="text-skin-orange">&#x2022;</span> You
                      cant leave this household for the next 12 hours
                    </p>
                  </div>
                )}
                {action === 'leave' && (
                  <p className="mt-4 text-lg text-skin-secondary">
                    Are you sure you want to leave this Household
                  </p>
                )}
                <div className="mt-4 space-x-6 float-right w-max ">
                  <button
                    className="text-skin-red font-semibold outline-0"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-skin-lime text-white py-4 px-8 font-semibold rounded-xl outline-0"
                    onClick={proceed}
                  >
                    Continue
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
