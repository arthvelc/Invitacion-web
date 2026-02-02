import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InvitePage from "./pages/InvitePage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Fullscreen image */}
        <Route path="/gif" element={<GifFullScreenPage />} />

        {/* Home */}
        <Route path="/" element={<InvitePage />} />

        {/* Invite with code */}
        <Route path="/invite/:code" element={<InvitePage />} />
      </Routes>
    </BrowserRouter>
  );
}

function GifFullScreenPage() {
  const [errored, setErrored] = useState(false);
  const src = "/images/fullscreen.webp";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10000,
          background: "rgba(0,0,0,.55)",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        /gif → {src}
      </div>
      {!errored ? (
        <img
          src={src}
          alt="gif"
          onError={() => setErrored(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            color: "#fff",
            fontFamily:
              "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
            textAlign: "center",
            padding: 16,
            maxWidth: 520,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>
            No se pudo cargar el GIF 😅
          </div>
          <div style={{ opacity: 0.9, fontSize: 13 }}>
            Verifica que exista en:
            <br />
            <code style={{ color: "#9fe3ff" }}>{src}</code>
            <br />
            (debe estar en <code style={{ color: "#9fe3ff" }}>public/images/fullscreen.webp</code>)
          </div>
        </div>
      )}
    </div>
  );
}

export default App;