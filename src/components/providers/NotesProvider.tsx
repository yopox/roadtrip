import {createContext, ReactNode, useContext, useEffect} from "react"
import {CARD_COLORS, NoteColor} from "../../styles/colors.ts"
import {LatLngLiteral} from "leaflet"
import {CalendarDate} from "@internationalized/date"
import {useY} from 'react-yjs';
import * as Y from 'yjs';

const NOTES_KEY: string = "notes"

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
        return n1.date.start.compare(n2.date.start)
    })
}

const yDoc = new Y.Doc();
const yArray = yDoc.getArray<Note>(NOTES_KEY);

export function NoteProvider({ children }: { children: ReactNode }) {
    const notes = useY(yArray);

    useEffect(() => {
        localStorage.setItem('plannerNotes', JSON.stringify(notes))
    }, [notes])

    const addNote = (note: Note) => {
        yDoc.getArray(NOTES_KEY).push([note])
    }

    const updateNote = (id: string, note: Note) => {
        const index = notes.findIndex(n => n.id === id)
        yDoc.transact(() => {
            yDoc.getArray(NOTES_KEY).delete(index)
            yDoc.getArray(NOTES_KEY).insert(index, [note])
        })
    }

    const deleteNote = (id: string) => {
        const index = notes.findIndex(n => n.id === id)
        if (index !== -1) {
            yDoc.getArray(NOTES_KEY).delete(index)
        }
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
            {children}
        </NoteContext.Provider>
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