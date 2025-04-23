
import { useState } from "react";
import { Home } from "./pages/home/home";
import { Registration } from "./pages/registration/registration";
import {BrowserRouter,Route,Routes} from "react-router-dom"
import { Selected } from "./pages/selected/selected";
function App() {
    const [openProfileModal,setOpenProfileModal]= useState(false)

const userInfo={
  name:"Иван",
  surname: "Иванов",
  email: "ivanovivan@gmail.com",
  nick: "vanya"
}
  return (
    <BrowserRouter>
    <div className="App" style={{margin:"-8px",overflow: "hidden"}}>
      <Routes>
        <Route path="/account" element={<Home openProfileModal={openProfileModal} setOpenProfileModal={setOpenProfileModal} userInfo={userInfo}/>}/>
        <Route path="/" element={<Registration />}/>
        <Route path="/selected" element={<Selected openProfileModal={openProfileModal} setOpenProfileModal={setOpenProfileModal} userInfo={userInfo}/>}/>
      </Routes>
    </div>
    </BrowserRouter>  );
}

export default App;
