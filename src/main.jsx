import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InvitePage from "./pages/InvitePage.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/i/:code" element={<InvitePage />} />
      {/* opcional */}
      <Route
        path="/"
        element={
          <div style={{ padding: 24, fontFamily: "system-ui" }}>
            Abre una invitación: <code>/i/abc123</code>
          </div>
        }
      />
    </Routes>
  </BrowserRouter>
);