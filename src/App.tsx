import React from 'react'
import MapView from './components/map/MapView.tsx'
import NotesSection from './components/notes/NotesSection.tsx'
import CalendarView from './components/calendar/CalendarView.tsx'

function App() {
    return (
        <>
            <div className="absolute top-0 left-0 z-1">
                <MapView/>
            </div>

            <div className="absolute bottom-4 left-0 z-2 w-full pointer-events-none">
                <NotesSection/>
            </div>

            <div className="absolute top-0 right-0 z-2 pointer-events-none">
                <CalendarView />
            </div>
        </>
    )
}

export default App
