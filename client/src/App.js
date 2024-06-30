import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Navbar from "./components/NavbarComp";
import 'react-bootstrap/dist/react-bootstrap.min.js';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Search />} />
        <Route path='/Favorites' element={<Favorites />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
