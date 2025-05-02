import React, {useEffect, useRef} from 'react'
import {MapContainer, Polyline, TileLayer, useMap} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import '../../styles/MapView.css'
import {getNoteColor, useNotes} from "../providers/NotesProvider.tsx"
import {CalendarDate} from "@internationalized/date"
import {useLocation} from "../providers/LocationProvider.tsx"

// Function to create a custom colored marker
const createColoredMarker: (hexColor: string) => L.DivIcon = (hexColor) => {
  const markerElement: HTMLDivElement = document.createElement('div')
  markerElement.className = 'custom-marker'

  const pin: HTMLDivElement = document.createElement('div')
  pin.className = 'pin'
  pin.style.borderColor = hexColor

  markerElement.appendChild(pin)

  return L.divIcon({
    className: 'custom-div-icon',
    html: markerElement,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

// Japan coordinates (centered on Tokyo)
const JAPAN_POSITION = { lat: 35.6762, lng: 139.6503 }
const DEFAULT_ZOOM = 6

function MapController({ selectedLocation, setSelectedLocation }) {
  const map = useMap()

  // Add click handler to set location
  useEffect(() => {
    const handleMapClick = (e) => {
      setSelectedLocation(e.latlng)
    }

    map.on('click', handleMapClick)

    return () => {
      map.off('click', handleMapClick)
    }
  }, [map, setSelectedLocation])

  return null
}

function MapView() {
  const { notes } = useNotes()
  const { mapLocation, setMapLocation } = useLocation()

  const formatDateRange: (date: { start: CalendarDate, end: CalendarDate }) => string = (date) => {
    return `${date.start.day} - ${date.end.day}`
  }

  const filteredMarkers = notes.filter(note => note.location)

  const generatePolylines = () => {
    const lines = []

    for (let i = 0; i < notes.length - 1; i++) {
      const currentNote = notes[i]
      const nextNote = notes[i + 1]

      if (currentNote.location && nextNote.location) {
        lines.push([
          [currentNote.location.lat, currentNote.location.lng],
          [nextNote.location.lat, nextNote.location.lng]
        ])
      }
    }

    return lines
  }

  const polylines = generatePolylines()

  const mapRef = useRef(null)
  const markersRef = useRef([])

  const MapMarkersController = () => {
    const map = useMap()
    mapRef.current = map

    useEffect(() => {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        if (map) marker.remove()
      })
      markersRef.current = []

      if (map && filteredMarkers.length > 0) {
        filteredMarkers.forEach(note => {
          if (note.location) {
            const customIcon = createColoredMarker(getNoteColor(note.id, notes).hex)
            const marker = L.marker(note.location, { icon: customIcon })

            // Create popup content
            const popupContent = document.createElement('div')
            const title = document.createElement('h3')
            title.textContent = note.name

            const dateRange = document.createElement('p')
            dateRange.textContent = formatDateRange(note.date)

            const participants = document.createElement('p')
            participants.textContent = `Participants: ${note.participants}`

            const sleepingPlace = document.createElement('p')
            sleepingPlace.textContent = `Sleeping: ${note.sleepingPlace}`
            sleepingPlace.style.fontStyle = 'italic'

            popupContent.appendChild(title)
            popupContent.appendChild(dateRange)
            popupContent.appendChild(participants)
            popupContent.appendChild(sleepingPlace)

            marker.bindPopup(popupContent)
            marker.addTo(map)
            markersRef.current.push(marker)
          }
        })
      }

      return () => {
        markersRef.current.forEach(marker => {
          if (map) marker.remove()
        })
        markersRef.current = []
      }
    }, [map, filteredMarkers, setMapLocation])

    return null
  }

  return (
    <div className="h-screen w-screen top-0 left-0">
      <MapContainer 
        center={JAPAN_POSITION}
        zoom={DEFAULT_ZOOM} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_bright/{z}/{x}/{y}.png"
        />

        <MapController selectedLocation={mapLocation} setSelectedLocation={setMapLocation} />
        <MapMarkersController />

        {polylines.map((positions, index) => (
          <Polyline
            key={index}
            positions={positions}
            color="oklch(44.2% 0.017 285.786)"
            weight={3}
            opacity={0.7}
            dashArray="5, 10"
          />
        ))}
      </MapContainer>
    </div>
  )
}

export default MapView
