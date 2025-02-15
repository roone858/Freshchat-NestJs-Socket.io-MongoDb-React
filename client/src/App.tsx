import Login from "./pages/Login";
import "./App.css";
import "remixicon/fonts/remixicon.css";
import Chat from "./pages/Chat";
import Forget from "./pages/Forget";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import withAuth from "./HOC/WithAuth";
const ProtectedChat = withAuth(Chat); // Wrap Chat with authentication

function App() {

    return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedChat />} /> {/* Protected Route */}
        <Route path="/login" element={ < Login />} />
        <Route path="/forget" element={<Forget />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
