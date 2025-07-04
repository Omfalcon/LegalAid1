// JediEasterEgg.jsx
"use client"

import { useEffect, useState } from "react";

const JediEasterEgg = ({ triggerActive, onDismiss }) => {
  const [showEgg, setShowEgg] = useState(false);

  useEffect(() => {
    let timer;

    if (triggerActive) {
      timer = setTimeout(() => {
        setShowEgg(true);
        const saber = new Audio('../../public/sound/lightsaber-on.mp3');
        saber.play();
      }, 1500); // Trigger after 8s of silence
    }

    return () => clearTimeout(timer);
  }, [triggerActive]);

  if (!showEgg) return null;

  return (
    <div style={{
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,0.9)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "rgba(31, 41, 55, 1)",
        border: "1px solid rgba(163, 230, 53, 0.4)",
        color: "rgba(163, 230, 53, 1)",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        textAlign: "center",
        boxShadow: "0 0 30px rgba(163, 230, 53, 0.3)"
      }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.75rem" }}>
          🧑‍⚖️ Jedi Counsel Has Arrived
        </h2>
        <p style={{ fontStyle: "italic", marginBottom: "0.5rem" }}>
          "Silence often hides the truth... but the Force always listens."
        </p>
        <p style={{ fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          — Master Yoda, Advocate of Galactic Law
        </p>
        <button
          onClick={() => {
            setShowEgg(false);
            if (onDismiss) onDismiss();
          }}
          style={{
            background: "rgba(163, 230, 53, 1)",
            color: "#000",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer"
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default JediEasterEgg;
