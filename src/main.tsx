import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import {HeroUIProvider} from "@heroui/react";
import {NoteProvider} from "./components/NotesProvider";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HeroUIProvider locale="en-GB">
            <NoteProvider>
                <App />
            </NoteProvider>
        </HeroUIProvider>
    </React.StrictMode>
);