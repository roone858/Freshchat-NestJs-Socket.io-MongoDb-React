import Login from "./pages/Login";
import "./App.css";
import "remixicon/fonts/remixicon.css";
import Navbar from "./layouts/Navbar/Navbar";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Forget from "./pages/Forget";
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
    return (
      <>
        <BrowserRouter>
          <Navbar isLogin={!accessToken ? false : true} />
          <Routes>
            <Route path="/" element={<Login />} />{" "}
            <Route path="/forget" element={<Forget />} />{" "}
          </Routes>
        </BrowserRouter>
      </>
    );
  }
  return (
    <>
      <BrowserRouter>
        <Navbar isLogin={!accessToken ? false : true} />
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
