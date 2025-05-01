import {Button, DateRangePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react"
import {useNotes} from "./NotesProvider.tsx"
import {BedIcon, PeopleIcon} from "./Icons.tsx"
import {useState} from "react"
import {CalendarDate} from "@internationalized/date"

function NoteEditModal({ noteId, isOpen, onOpenChange }: { noteId: string | null, isOpen: boolean, onOpenChange: (_: boolean) => any }) {
    const { notes, updateNote } = useNotes()
    const note = noteId ? notes.find(n => n.id === noteId) : null

    const [name, setName] = useState(note?.name || '')
    const [dateRange, setDateRange] = useState({
        start: note?.date.start || new CalendarDate(2025, 0, 1),
        end: note?.date.end || new CalendarDate(2025, 0, 1)
    })
    const [participants, setParticipants] = useState(note?.participants || '')
    const [sleepingPlace, setSleepingPlace] = useState(note?.sleepingPlace || '')

    const handleSave = (onClose: () => void) => {
        if (noteId) {
            console.log(dateRange)
            updateNote(noteId, {
                ...note,
                name,
                date: {
                    start: new CalendarDate(dateRange.start.year, dateRange.start.month, dateRange.start.day),
                    end: new CalendarDate(dateRange.end.year, dateRange.end.month, dateRange.end.day),
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
                                        defaultValue={note.name}
                                        onValueChange={setName}
                                    />
                                    <DateRangePicker
                                        isRequired
                                        label="Date"
                                        firstDayOfWeek="mon"
                                        defaultValue={{
                                            start: note.date.start,
                                            end: note.date.end,
                                        }}
                                        onChange={setDateRange}
                                    />
                                </div>
                                <Input
                                    label="Participants (comma separated)"
                                    placeholder="No Participants"
                                    variant="bordered"
                                    defaultValue={note.participants}
                                    onValueChange={setParticipants}
                                    endContent={(<PeopleIcon className="size-6 text-default-400 pointer-events-none"/>)}
                                />
                                <Input
                                    label="Sleeping Place"
                                    placeholder="No Sleeping Place"
                                    variant="bordered"
                                    defaultValue={note.sleepingPlace}
                                    onValueChange={setSleepingPlace}
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