import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <main style={{ fontFamily: "Inter, ui-sans-serif, system-ui", padding: 32 }}>
      <h1>ProofForge</h1>
      <p>Proof, not noise.</p>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
