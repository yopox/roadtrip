import {createContext, ReactNode, useContext, useState} from "react"
import {LatLngLiteral} from "leaflet"

type LocationContextType = {
    mapLocation: LatLngLiteral | null;
    setMapLocation: (location: LatLngLiteral | null) => void;
    onMapLocationChanged: (callback: (location: LatLngLiteral | null) => void) => () => void;
}

export const LocationContext = createContext<LocationContextType>(null)

export function LocationProvider({ children }: { children: ReactNode}) {
    const [mapLocation, setMapLocation] = useState(null)
    const [subscribers] = useState<Set<(location: LatLngLiteral | null) => void>>(() => new Set());

    const onMapLocationChanged = (callback: (location: LatLngLiteral | null) => void) => {
        subscribers.add(callback)
        return () => {
            subscribers.delete(callback)
        }
    }

    const updateLocation = (location: LatLngLiteral | null) => {
        setMapLocation(location)
        if (location) {
            subscribers.forEach(callback => callback(location))
        }
    }

    return (
        <LocationContext.Provider value={{ mapLocation, setMapLocation: updateLocation, onMapLocationChanged }}>
            {children}
        </LocationContext.Provider>
    )
}

export function useLocation() {
    const context = useContext(LocationContext)
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider')
    }
    return context
}