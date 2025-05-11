import * as Y from 'yjs';
import * as sdk from "matrix-js-sdk"
import {Note} from "../components/providers/NotesProvider";
import {addToast} from "@heroui/react"
import {EventType, MsgType} from "matrix-js-sdk/lib/@types/event"
import {Direction} from "matrix-js-sdk/lib/models/event-timeline"
import React from "react"

export function loginToMatrix(userId: string, password: string): Promise<sdk.MatrixClient | null> {
    const client = sdk.createClient({
        baseUrl: "https://matrix.org",
    })

    const loginData = {
        type: "m.login.password",
        user: userId,
        password: password
    }

    return client.loginRequest(loginData)
        .then(
            response => {
                addToast({
                    title: "Login successful",
                    description: "Matrix login successful.",
                    severity: "success",
                })
                return sdk.createClient({
                    baseUrl: "https://matrix.org",
                    accessToken: response.access_token,
                    userId: response.user_id
                })
            },
            err => {
                addToast({
                    title: "Login failed",
                    description: "Matrix login failed. (" + err + ")",
                    severity: "danger",
                })
                console.log(err)
                return null
            }
        )
}

export function exportToMatrix(matrixClient: sdk.MatrixClient, roomId: string, notes: Note[]): Promise<boolean> {
    const notesJson = JSON.stringify(notes);
    return matrixClient.sendEvent(
        roomId,
        EventType.RoomMessage,
        {
            msgtype: MsgType.Text,
            body: notesJson,
            format: "org.matrix.custom.html",
            formatted_body: `<pre>${notesJson}</pre>`,
        }
    )
        .then(
            () => {
                addToast({
                    title: "Export successful",
                    description: "Notes exported to Matrix.",
                    severity: "success",
                })
                return true
            },
            err => {
                addToast({
                    title: "Export failed",
                    description: "Notes couldn't be exported to Matrix. (" + err + ")",
                    severity: "danger",
                })
                console.log(err)
                return false
            }
        )
}

export function importFromMatrix(matrixClient: sdk.MatrixClient, roomId: string, yDoc: React.RefObject<Y.Doc>, key: string): Promise<boolean> {
    return matrixClient.joinRoom(roomId)
        .catch(() => {
            // We might already be in the room
        })
        .then(() => {
            return matrixClient.createMessagesRequest(
                roomId,
                "", // empty for most recent messages
                5,
                Direction.Backward
            )
        })
        .then(response => {
            if (response && response.chunk && response.chunk.length > 0) {
                for (const event of response.chunk) {
                    if (event.type === EventType.RoomMessage && event.content && event.content.body) {
                        try {
                            const importedNotes = JSON.parse(event.content.body) as Note[];
                            yDoc.current.transact(() => {
                                yDoc.current.getArray(key).delete(0, yDoc.current.getArray(key).length)
                                yDoc.current.getArray(key).insert(0, importedNotes)
                            })
                            addToast({
                                title: "Import successful",
                                description: "Notes imported from Matrix.",
                                severity: "success",
                            })
                            return true
                        } catch (e) {}
                    }
                }
            }
            return false
        })
        .catch(err => {
            addToast({
                title: "Import failed",
                description: "Notes couldn't be imported from Matrix. (" + err + ")",
                severity: "danger",
            })
            console.log(err)
            return false
        })
}