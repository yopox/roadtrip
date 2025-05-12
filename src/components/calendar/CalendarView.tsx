import React from 'react'

import {Card, CardBody, CardHeader, Divider} from "@heroui/react"
import {getNoteColor, sortByDay, useNotes} from "../providers/NotesProvider.tsx"
import {NoteColor} from "../../styles/colors.ts"
import {CalendarDate} from "@internationalized/date"

const JULY_2025_START_INDEX: number = 1
const JULY_2025_DAYS: number = 31

type CalendarDay = {
  day: number;
  color: NoteColor | null;
}

export const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

function CalendarView({}) {
  const { notes } = useNotes()

  const generateCalendarDays: () => CalendarDay[] = () => {
    const days: CalendarDay[] = []

    // Add empty cells for days before the 1st
    for (let i = 0; i < JULY_2025_START_INDEX; i++) {
      days.push({ day: null, color: null })
    }

    // Add days of the month
    for (let day = 1; day <= JULY_2025_DAYS; day++) {
      const date = new CalendarDate(2025, 7, day)

      // Find an event that contains this date
      let color = null

      let sortedNotes = sortByDay(notes)

      for (let i = notes.length - 1; i >= 0; i--) {
        const note = sortedNotes[i]
        if (date.compare(note.date.start) >= 0 && date.compare(note.date.end) <= 0) {
          color = getNoteColor(note.id, notes)
          break
        }
      }

      days.push({ day, color })
    }

    return days
  }

  return (
      <div className="m-8">
        <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px] pointer-events-auto"
            shadow="md"
        >
          <CardHeader className="py-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">July 2025</h4>
          </CardHeader>

          <Divider />

          <CardBody className="text-zinc-800">
            <div className="grid grid-cols-7 gap-1 text-center *:size-8 *:font-bold">
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div className="text-zinc-500">S</div>
              <div className="text-zinc-500">S</div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {generateCalendarDays().map((dayData) => (
                  <div
                      key={dayData.day}
                      className={`p-1 rounded-full size-8 ${dayData.color ? dayData.color.light + " " + dayData.color.hover : "hover:bg-zinc-400/20"}`}
                  >
                    {dayData.day}
                  </div>
              ))}
            </div>
          </CardBody>

        </Card>
      </div>
  )
}

export default CalendarView
