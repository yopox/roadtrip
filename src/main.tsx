import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import {HeroUIProvider, ToastProvider} from "@heroui/react";
import {NoteProvider} from "./components/providers/NotesProvider.tsx";
import {LocationProvider} from "./components/providers/LocationProvider.tsx"
import {applyMatrixSDKPolyfills} from "./fixMatrixSdk.tsx"

applyMatrixSDKPolyfills()

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HeroUIProvider locale="en-GB">
            <ToastProvider />
            <NoteProvider>
                <LocationProvider>
                    <App />
                </LocationProvider>
            </NoteProvider>
        </HeroUIProvider>
    </React.StrictMode>
);