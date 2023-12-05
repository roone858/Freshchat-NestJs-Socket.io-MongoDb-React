import Login from "./pages/Login";
import "./App.css";
import Navbar from "./layouts/Navbar/Navbar";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const accessToken = sessionStorage.getItem("accessToken");
  // useEffect(() => {
  //   const gottenAccessToken = sessionStorage.getItem("accessToken");
  //   if (gottenAccessToken) {
  //     window.location.href = "/";
  //   }
  // }, [accessToken]);

  if (!accessToken) {
    return <Login />;
  }
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:username" element={<Chat />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
