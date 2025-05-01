export type NoteColor = {
    base: string;
    hover: string;
    transparent: string;
    light: string;
    hex: string;
}

export const CARD_COLORS: NoteColor[] = [
    {base: "bg-red-400", hover: "hover:bg-red-300", transparent: "bg-red-400/30", hex: "#f87171", light: "bg-red-200"},
    {base: "bg-orange-400", hover: "hover:bg-orange-300", transparent: "bg-orange-400/30", hex: "#fb923c", light: "bg-orange-200"},
    {base: "bg-amber-400", hover: "hover:bg-amber-300", transparent: "bg-amber-400/30", hex: "#fbbf24", light: "bg-amber-200"},
    {base: "bg-yellow-400", hover: "hover:bg-yellow-300", transparent: "bg-yellow-400/30", hex: "#facc15", light: "bg-yellow-200"},
    {base: "bg-lime-400", hover: "hover:bg-lime-300", transparent: "bg-lime-400/30", hex: "#a3e635", light: "bg-lime-200"},
    {base: "bg-green-400", hover: "hover:bg-green-300", transparent: "bg-green-400/30", hex: "#4ade80", light: "bg-green-200"},
    {base: "bg-emerald-400", hover: "hover:bg-emerald-300", transparent: "bg-emerald-400/30", hex: "#34d399", light: "bg-emerald-200"},
    {base: "bg-teal-400", hover: "hover:bg-teal-300", transparent: "bg-teal-400/30", hex: "#2dd4bf", light: "bg-teal-200"},
    {base: "bg-cyan-400", hover: "hover:bg-cyan-300", transparent: "bg-cyan-400/30", hex: "#22d3ee", light: "bg-cyan-200"},
    {base: "bg-sky-400", hover: "hover:bg-sky-300", transparent: "bg-sky-400/30", hex: "#38bdf8", light: "bg-sky-200"},
    {base: "bg-blue-400", hover: "hover:bg-blue-300", transparent: "bg-blue-400/30", hex: "#60a5fa", light: "bg-blue-200"},
    {base: "bg-indigo-400", hover: "hover:bg-indigo-300", transparent: "bg-indigo-400/30", hex: "#818cf8", light: "bg-indigo-200"},
    {base: "bg-violet-400", hover: "hover:bg-violet-300", transparent: "bg-violet-400/30", hex: "#a78bfa", light: "bg-violet-200"},
    {base: "bg-purple-400", hover: "hover:bg-purple-300", transparent: "bg-purple-400/30", hex: "#c084fc", light: "bg-purple-200"},
    {base: "bg-fuchsia-400", hover: "hover:bg-fuchsia-300", transparent: "bg-fuchsia-400/30", hex: "#e879f9", light: "bg-fuchsia-200"},
    {base: "bg-pink-400", hover: "hover:bg-pink-300", transparent: "bg-pink-400/30", hex: "#f472b6", light: "bg-pink-200"},
    {base: "bg-rose-400", hover: "hover:bg-rose-300", transparent: "bg-rose-400/30", hex: "#fb7185", light: "bg-rose-200"}
];