import {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react"
import {CARD_COLORS, NoteColor} from "../../styles/colors.ts"
import {LatLngLiteral} from "leaflet"
import {CalendarDate} from "@internationalized/date"
import DataModal from "../modal/DataModal.tsx"
import {useDisclosure} from "@heroui/react"

import * as Y from 'yjs';
import {useY} from 'react-yjs';
import {IndexeddbPersistence} from 'y-indexeddb'
import * as sdk from "matrix-js-sdk"
import {exportToClipboard, importFromClipboard} from "../../data/clipboard.ts"
import {exportToMatrix, importFromMatrix, loginToMatrix} from "../../data/matrix.ts"

const NOTES_KEY: string = "notes"
const DEFAULT_STORAGE_KEY: string = "default"

export type Note = {
    id: string;
    name: string;
    location: LatLngLiteral | null;
    date: {
        start: CalendarDate;
        end: CalendarDate;
    };
    participants: string;
    sleepingPlace: string;
    notes: string[];
}

export function createNewNote(): Note {
    return Object.seal({
        id: crypto.randomUUID(),
        name: "",
        location: null,
        date: {
            start: new CalendarDate(2025, 1, 1),
            end: new CalendarDate(2025, 1, 1)
        },
        notes: [],
        participants: "",
        sleepingPlace: "",
    })
}

type NoteContextType = {
    notes: Note[];
    addNote: (note: Note) => void;
    updateNote: (id: string, note: Note) => void;
    deleteNote: (id: string) => void;
}


const NoteContext = createContext<NoteContextType | undefined>(undefined)

export function sortByDay(notes: Note[]) {
    return notes.sort((n1, n2) => {
        return (n1.date.start.year - n2.date.start.year) || (n1.date.start.month - n2.date.start.month) || (n1.date.start.day - n2.date.start.day)
    })
}

function reconstructCalendarDate(date: any): CalendarDate {
    if (date instanceof CalendarDate) return date
    return new CalendarDate(date.year, date.month, date.day)
}

function reconstructNote(note: Note): Note {
    return {
        ...note,
        date: {
            start: reconstructCalendarDate(note.date.start),
            end: reconstructCalendarDate(note.date.end),
        }
    }
}

export function NoteProvider({ children }: { children: ReactNode }) {
    const yDoc = useRef(new Y.Doc())
    const [storageKey] = useState<string>(DEFAULT_STORAGE_KEY)
    const [matrixClient, setMatrixClient] = useState<sdk.MatrixClient | null>(null)
    const [provider, setProvider] = useState<IndexeddbPersistence | null>(null)

    const yArray = yDoc.current.getArray<Note>(NOTES_KEY)
    const notes = useY(yArray).map(reconstructNote)

    useEffect(() => {
        if (provider) {
            provider.destroy()
        }

        try {
            const newProvider = new IndexeddbPersistence(storageKey, yDoc.current)
            setProvider(newProvider)
        } catch (error) {
            console.error('Error creating IndexedDB provider:', error)
        }

        return () => {
            if (provider) {
                provider.destroy()
            }
        }
    }, [storageKey])

    const addNote = (note: Note) => {
        yDoc.current.getArray(NOTES_KEY).push([note])
    }

    const updateNote = (id: string, note: Note) => {
        const index = notes.findIndex(n => n.id === id)
        yDoc.current.transact(() => {
            yDoc.current.getArray(NOTES_KEY).delete(index)
            yDoc.current.getArray(NOTES_KEY).insert(index, [note])
        })
    }

    const deleteNote = (id: string) => {
        const index = notes.findIndex(n => n.id === id)
        if (index !== -1) {
            yDoc.current.getArray(NOTES_KEY).delete(index)
        }
    }

    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isOpen) {
                onOpen()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onOpen])

    return (
        <>
            <DataModal
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                onMatrixLogin={(userId, password) => loginToMatrix(userId, password).then(
                    client => {
                        if (client) setMatrixClient(client)
                        return client != null
                    }
                )}
                exportToClipboard={() => exportToClipboard(notes)}
                importFromClipboard={() => importFromClipboard(yDoc, NOTES_KEY)}
                exportToMatrix={roomId => exportToMatrix(matrixClient, roomId, notes)}
                importFromMatrix={roomId => importFromMatrix(matrixClient, roomId, yDoc, NOTES_KEY)}
            />
            <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
                {children}
            </NoteContext.Provider>
        </>
    )
}

export function useNotes() {
    const context = useContext(NoteContext)
    if (context === undefined) {
        throw new Error('useNotes must be used within a NoteProvider')
    }
    return context
}

export function getNoteColor(noteId: string, notes: Note[]): NoteColor {
    const index = notes.findIndex(n => n.id === noteId)
    const lastIndex = CARD_COLORS.length - 1
    if (index === -1) return CARD_COLORS[lastIndex]
    return CARD_COLORS[Math.min(index, lastIndex)]
}
