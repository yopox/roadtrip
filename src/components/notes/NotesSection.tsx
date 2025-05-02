import React, {useCallback, useState} from 'react'
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Textarea,
    useDisclosure
} from "@heroui/react";
import {createNewNote, getNoteColor, Note, useNotes} from "../providers/NotesProvider.tsx";
import NoteEditModal from "./NoteEditModal.tsx"
import {CalendarDate} from "@internationalized/date"
import {BedIcon, MenuIcon, PeopleIcon} from "../ui/Icons.tsx"
import {useLocation} from "../providers/LocationProvider.tsx"
import {LatLngLiteral} from "leaflet"

function firstDayAvailable(notes: Note[]): CalendarDate {
    let day = notes.length
        ? notes[0].date.end.add({days: 1})
        : new CalendarDate(2025, 6, 1);

    for (let n of notes) {
        if (day.compare(n.date.start) < 0) break;
        if (day.compare(n.date.end) > 0) continue;
        day = n.date.end.add({days: 1});
    }

    return day
}

function NotesSection() {
    const {notes, addNote, updateNote, deleteNote} = useNotes()
    const { mapLocation, onMapLocationChanged } = useLocation()

    const [editingNoteId, setEditingNoteId] = useState(null)
    const [editValue, setEditValue] = useState(null)
    const [popupNoteId, setPopupNoteId] = useState(null)
    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    const waitForMapLocation = useCallback(() => {
        return new Promise((resolve: (value: LatLngLiteral) => void, reject) => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', handleKeyDown);
                    reject(new Error('Selection cancelled'))
                }
            }

            const unsubscribe = onMapLocationChanged((newLocation) => {
                document.removeEventListener('keydown', handleKeyDown)
                unsubscribe()
                resolve(newLocation)
            })

            document.addEventListener('keydown', handleKeyDown);
        })
    }, [])

    const setNoteLocation = (noteId: string, location: LatLngLiteral) => {
        const note = notes.find(n => n.id === noteId)
        note.location = location
        updateNote(noteId, note)
    }

    const saveField = () => {
        const note = notes.find(n => n.id === editingNoteId)
        note.name = editValue
        updateNote(editingNoteId, note)

        setEditingNoteId(null)
    }

    const formatDateRange = (date: {start: CalendarDate, end: CalendarDate}) => {
        return `${date.start.day} → ${date.end.day}`
    }

    return (
        <div className="flex flex-col gap-4 p-8 pb-4">
            <NoteEditModal isOpen={isOpen} noteId={popupNoteId} onOpenChange={onOpenChange}/>
            <Button
                isIconOnly
                aria-label="Add Location"
                variant="solid"
                color="primary"
                className="w-fit text-zinc-800"
                onPress={(_) => {
                    const note = createNewNote()
                    const day = firstDayAvailable(notes)
                    note.date.start = day;
                    note.date.end = day;
                    addNote(note)
                    setPopupNoteId(note.id);
                    onOpen();
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
            </Button>
            <div
                className="flex flex-row gap-6 overflow-x-scroll scrollbar-hide"
            >
                {notes.map((note) => (
                    <Card
                        isBlurred
                        className="border-none bg-background/60 dark:bg-default-100/50 min-w-64 h-fit self-end"
                        shadow="sm"
                        key={note.id}
                    >
                        <CardHeader className={`${getNoteColor(note.id, notes).light}`}>
                            {editingNoteId === note.id ? (
                                <div className="w-full">
                                    <Input
                                        type="text"
                                        variant="bordered"
                                        size="sm"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onBlur={saveField}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && saveField()}
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-row w-full items-center">
                                    <div className="text-lg font-semibold flex-1"
                                        onClick={() => {
                                            setEditValue(note.name)
                                            setEditingNoteId(note.id)
                                        }}>
                                        {note.name || 'New Location'}
                                    </div>
                                    <Chip
                                        className={`${getNoteColor(note.id, notes).base} mr-2 font-semibold`}
                                        size="md"
                                    >
                                        {formatDateRange(note.date) || '? → ?'}
                                    </Chip>
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button isIconOnly color="primary" variant="light" aria-label="menu" size="sm" className="text-zinc-800">
                                                <MenuIcon className="size-4"/>
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            aria-label="Static Actions"
                                            onAction={(actionKey) => {
                                                switch (actionKey) {
                                                    case "edit-details":
                                                        setPopupNoteId(note.id)
                                                        onOpen()
                                                        break;
                                                    case "select-location":
                                                        waitForMapLocation().then((location) => {
                                                            if (!location) return;
                                                            setNoteLocation(note.id, location)
                                                        })
                                                        break;
                                                    case "delete":
                                                        deleteNote(note.id);
                                                        break;
                                                }
                                            }}
                                        >
                                            <DropdownItem key="edit-details">Edit Details</DropdownItem>
                                            <DropdownItem key="select-location">Select Location</DropdownItem>
                                            <DropdownItem key="delete" className="text-danger" color="danger">Delete Card</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            )}
                        </CardHeader>

                        <CardBody>
                            <div className="text-sm text-zinc-600">
                                <div className="flex flex-row items-center gap-2">
                                    <PeopleIcon className="size-4" />
                                    {note.participants.length > 0
                                        ? note.participants
                                        : 'No participants'}
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <BedIcon className="size-4" />
                                    {note.sleepingPlace
                                        ? `${note.sleepingPlace}`
                                        : 'No sleeping place'}
                                </div>
                            </div>

                            <Textarea minRows={1}
                                      variant="underlined"
                                      color="primary"
                                      className="text-zinc-800"
                                      defaultValue={note.notes ? note.notes.join('\n') : ''}
                                      onChange={(e) => {
                                          const updatedNote = {...note, notes: e.target.value.split('\n')}
                                          updateNote(note.id, updatedNote)
                                      }}
                            />
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default NotesSection;
