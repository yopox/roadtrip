import {Button, DateRangePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react"
import {useNotes} from "../providers/NotesProvider.tsx"
import {BedIcon, PeopleIcon} from "../ui/Icons.tsx"
import {CalendarDate} from "@internationalized/date"

function NoteEditModal({ noteId, isOpen, onOpenChange }: { noteId: string | null, isOpen: boolean, onOpenChange: (_: boolean) => any }) {
    const { notes, updateNote } = useNotes()
    const note = noteId ? notes.find(n => n.id === noteId) : null

    let name = note ? note.name : ''
    let dateRange = note ? note.date : {
        start: new CalendarDate(2025, 0, 1),
        end: new CalendarDate(2025, 0, 1)
    }
    let participants = note ? note.participants : ''
    let sleepingPlace = note ? note.sleepingPlace : ''

    const handleSave = (onClose: () => void) => {
        if (noteId) {
            updateNote(noteId, {
                ...note,
                name,
                date: {
                    start: dateRange.start,
                    end: dateRange.end,
                },
                participants,
                sleepingPlace
            })
        }
        onClose()
    }


    return (
        noteId ? <Modal
                placement="center"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Edit Location</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-row gap-2">
                                    <Input
                                        label="Name"
                                        placeholder="Location Name"
                                        variant="bordered"
                                        defaultValue={name}
                                        onValueChange={value => name = value}
                                    />
                                    <DateRangePicker
                                        isRequired
                                        label="Date"
                                        firstDayOfWeek="mon"
                                        defaultValue={{
                                            start: dateRange.start,
                                            end: dateRange.end,
                                        }}
                                        onChange={value => dateRange = value}
                                    />
                                </div>
                                <Input
                                    label="Participants (comma separated)"
                                    placeholder="No Participants"
                                    variant="bordered"
                                    defaultValue={participants}
                                    onValueChange={value => participants = value}
                                    endContent={(<PeopleIcon className="size-6 text-default-400 pointer-events-none"/>)}
                                />
                                <Input
                                    label="Sleeping Place"
                                    placeholder="No Sleeping Place"
                                    variant="bordered"
                                    defaultValue={sleepingPlace}
                                    onValueChange={value => sleepingPlace = value}
                                    endContent={(<BedIcon className="size-6 text-default-400 pointer-events-none"/>)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" onPress={() => handleSave(onClose)}>
                                    OK
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            : <></>
    )
}

export default NoteEditModal