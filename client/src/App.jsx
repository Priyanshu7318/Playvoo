import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Channel from "./pages/Channel";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-wrapper">
            <Routes>
              <Route path="/">
                <Route index element={<Home />} />
                <Route path="trend" element={<Home type="trend" />} />
                <Route path="sub" element={<Home type="sub" />} />
                <Route path="search" element={<Search />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="upload" element={<Upload />} />
                <Route path="channel/:id" element={<Channel />} />
                <Route path="video/:id" element={<Watch />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
