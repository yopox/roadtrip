import React, {useState} from 'react'
import MapView from './components/MapView'
import NotesSection from './components/NotesSection'
import CalendarView from './components/CalendarView'

function App() {
    const [selectedLocation, setSelectedLocation] = useState(null)

    return (
        <>
            <div className="absolute top-0 left-0 z-1">
                <MapView
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                />
            </div>

            <div className="absolute bottom-4 left-0 z-2">
                <NotesSection/>
            </div>

            <div className="absolute top-0 right-0 z-2">
                <CalendarView />
            </div>
        </>
    )
}

export default App
