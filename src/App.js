import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import ManageUnits from "./pages/ManageUnits";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ManageServiceMan from "./pages/ManageServiceMan";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path={'/registration'} element={<Registration/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path="/manage-units/:id" element={<ManageUnits/>}/>
                <Route path="/manage-serviceman/:id" element={<ManageServiceMan/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
