import {
  TEModal,
  TEModalDialog,
  TEModalContent,
  TEModalHeader,
  TEModalBody,
  TEModalFooter,
} from 'tw-elements-react'
import Button from '../../button'

interface ModalProps {
  children: React.ReactNode
  open: boolean
  setModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Modal({
  children,
  open,
  setModal,
}: Readonly<ModalProps>): JSX.Element {
  return (
    <div>
      {/* <!--Top left modal--> */}
      <TEModal show={open} setShow={setModal}>
        <TEModalDialog
          position="top-left"
          theme={{
            show: 'translate-x-0 opacity-100',
            hidden: 'translate-x-[-100%] opacity-0',
          }}
          className="!w-96 pt-6"
        >
          <TEModalContent>
            <TEModalHeader className="h-12">
              <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                Filtros
              </h5>
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                onClick={() => setModal(false)}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </TEModalHeader>
            <TEModalBody>{children}</TEModalBody>
            <TEModalFooter className="flex space-x-2">
              <Button onClick={() => setModal(false)}> Limpar </Button>
              <Button onClick={() => setModal(false)}> Pesquisar </Button>
            </TEModalFooter>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  )
}
