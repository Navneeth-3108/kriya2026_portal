import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import ShipLanding from "./pages/ShipLanding";
import Anchorage from "./pages/Anchorage";
import SeaSolve from "./pages/SeaSolve";
import MapPage from "./components/MapPage";
import AdminPage from "./components/AdminPage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import PirateArena from "./PirateArena";

function TempNav() {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.8)", padding: "10px", display: "flex", gap: "15px", zIndex: 99999, overflowX: "auto", fontFamily: "sans-serif" }}>
      <Link to="/codequest" style={{ color: "white" }}>Signup</Link>
      <Link to="/codequest/login" style={{ color: "white" }}>Login</Link>
      <Link to="/codequest/shiplanding" style={{ color: "white" }}>ShipLanding</Link>
      <Link to="/codequest/anchorage" style={{ color: "white" }}>Anchorage</Link>
      <Link to="/codequest/team/test/sea/1" style={{ color: "white" }}>SeaSolve</Link>
      <Link to="/codequest/map" style={{ color: "white" }}>MapPage</Link>
      <Link to="/codequest/admin" style={{ color: "white" }}>Admin</Link>
      <Link to="/codequest/arena" style={{ fontWeight: "bold", color: "gold" }}>Arena</Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TempNav />
      <Routes>
        <Route path="/" element={<Navigate to="/codequest" replace />} />
        <Route path="/codequest">
          <Route index element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="shiplanding" element={<ShipLanding />} />
          <Route path="anchorage" element={<Anchorage />} />
          <Route path="team/:kriyaID/sea/:seaId" element={<SeaSolve />} />
          <Route path="map" element={<MapPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="arena" element={<PirateArena />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
