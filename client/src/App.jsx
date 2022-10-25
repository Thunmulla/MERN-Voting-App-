import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Routes} from "react-router-dom";
import {HomePage} from "./pages/HomePage.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import {ElectionPage} from "./pages/ElectionPage";
import {VotePage} from "./pages/VotePage";
import {ContactUsPage} from "./pages/ContactUsPage";
import React, {useEffect} from "react";
import {RegisterForm} from "./component/Form/RegisterForm.jsx";
import {ManageElection} from "./pages/ManageElection";
import {AddElection} from "./component/Form/AddElection.jsx";
import {EditElection} from "./component/Form/EditElection";


function App() {
    const ClearSession = () => {
        if (window.location.pathname !== "/election/edit-elect") {
            if (sessionStorage.getItem("SelectedElection")) {
                sessionStorage.removeItem("SelectedElection");
            }
        }
    }
    useEffect(() => {
        ClearSession();
    }, [])

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/register" element={<RegisterForm/>}/>
                <Route path="/contactus" element={<ContactUsPage/>}/>
                <Route exact path="/election" element={<ElectionPage/>}/>
                {/*Electiion Sub Routes*/}
                <Route path="/election/add-elect" element={<AddElection/>}/>
                <Route path="/election/edit-elect" element={<EditElection/>}/>
                <Route path="/election/manage-elect" element={<ManageElection/>}/>
                <Route path="/election/vote" element={<VotePage/>}/>


                <Route exact path="*" element={<HomePage/>}/>
            </Routes>
        </div>

    )
}

export default App
