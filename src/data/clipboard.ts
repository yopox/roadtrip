import * as Y from 'yjs';
import {Note} from "../components/providers/NotesProvider";
import {addToast} from "@heroui/react"
import React from "react"


export function exportToClipboard(notes: Note[]): Promise<boolean> {
    const notesJson = JSON.stringify(notes)
    return navigator.clipboard
        .writeText(notesJson)
        .then(
            () => {
                addToast({
                    title: "Export successful",
                    description: "Notes exported to the clipboard.",
                    severity: "success",
                })
                return true
            },
            err => {
                addToast({
                    title: "Export failed",
                    description: "Notes couldn't be exported to the clipboard. (" + err + ")",
                    severity: "danger",
                })
                console.log(err)
                return false
            },
        )
}

export function importFromClipboard(yDoc: React.RefObject<Y.Doc>, key: string): Promise<boolean> {
    return navigator.clipboard.readText()
        .then(
            text => {
                try {
                    const importedNotes = JSON.parse(text) as Note[]
                    yDoc.current.transact(() => {
                        yDoc.current.getArray(key).delete(0, yDoc.current.getArray(key).length);
                        yDoc.current.getArray(key).insert(0, importedNotes);
                    })
                    addToast({
                        title: "Import successful",
                        description: "Notes imported from the clipboard.",
                        severity: "success",
                    })
                    return true
                } catch (e) {
                    addToast({
                        title: "Import failed",
                        description: "Notes couldn't be imported from the clipboard. (" + e + ")",
                        severity: "danger",
                    })
                    return false
                }
            },
            err => {
                addToast({
                    title: "Import failed",
                    description: "Notes couldn't be imported from the clipboard. (" + err + ")",
                    severity: "danger",
                })
                console.log(err)
                return false
            }
        )
}