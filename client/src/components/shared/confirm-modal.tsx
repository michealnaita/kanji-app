import { Dialog } from '@headlessui/react';

export default function ConfirmationModal({
  open,
  action,
  onClose,
  children,
  title,
  buttonText,
}: {
  open: boolean;
  action: () => void;
  onClose: () => void;
  children: any;
  title: string;
  buttonText?: string;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Panel className="modal-card">
        <div className="menu-container space-y-7 text-black">
          <h1 className="font-semibold">{title}</h1>
          <p>{children}</p>
          <div className="space-y-4">
            <button
              className="primary"
              onClick={() => {
                action();
                onClose();
              }}
            >
              {buttonText || 'Confirm'}
            </button>
            <button className="primary-alt" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
