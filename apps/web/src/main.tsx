import { createRoot } from "react-dom/client";
import "./styles.css";
import { App } from "./app/App";

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
