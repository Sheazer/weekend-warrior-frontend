import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import ManageParticipants from "./pages/ManageParticipants";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Map from "./pages/Map";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/manage" element={<ManageParticipants />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/map" element={<Map />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;