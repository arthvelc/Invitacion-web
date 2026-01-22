import { BrowserRouter, Routes, Route } from "react-router-dom";
import InvitePage from "./pages/InvitePage";

function App() {
  const basename = import.meta.env.DEV ? "/" : "/Invitacion-web";

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Ruta con código dinámico */}
        <Route path="/:code" element={<InvitePage />} />

        {/* Opcional: raíz */}
        <Route path="/" element={<InvitePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;