import {createContext, ReactNode, useContext, useEffect, useState} from "react"
import {CARD_COLORS, NoteColor} from "../styles/colors.ts"
import {LatLngLiteral} from "leaflet"
import {CalendarDate} from "@internationalized/date"

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
            start: new CalendarDate(2025, 0, 0),
            end: new CalendarDate(2025, 0, 0)
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

function sortByDay(notes: Note[]) {
    return notes.sort((n1, n2) => {
        return n1.date.start.compare(n2.date.start)
    })
}

export function NoteProvider({ children }: { children: ReactNode }) {
    const [notes, setNotes] = useState(() => {
        const savedNotes: string = localStorage.getItem('plannerNotes')
        let loadedNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : []
        loadedNotes.forEach(note => {
            note.date.start = new CalendarDate(note.date.start.year, note.date.start.month, note.date.start.day)
            note.date.end = new CalendarDate(note.date.end.year, note.date.end.month, note.date.end.day)
        })
        return sortByDay(loadedNotes)
    })

    useEffect(() => {
        localStorage.setItem('plannerNotes', JSON.stringify(notes))
    }, [notes])

    const addNote = (note: Note) => {
        setNotes(sortByDay([...notes, note]))
    }

    const updateNote = (id: string, note: Note) => {
        setNotes(notes.map(n => n.id === id ? note : n))
    }

    const deleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id))
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