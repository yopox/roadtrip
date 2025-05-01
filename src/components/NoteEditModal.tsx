import {Modal, ModalBody, ModalContent, ModalHeader} from "@heroui/react"

function NoteEditModal() {
    return (
      <Modal>
          <ModalContent>
              {(onClose) => (
                  <>
                      <ModalHeader>Location name</ModalHeader>
                      <ModalBody>
                        Hello
                      </ModalBody>
                  </>
              )}
          </ModalContent>
      </Modal>
    )
}

export default NoteEditModal