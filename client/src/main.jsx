import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import App from './App'
import {Header} from "./component/Header/Header.jsx";
import {Footer} from "./component/Footer/Footer.jsx";
import {SideBar} from "./component/SideBar/SideBar";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <div className="flex-row">
                <SideBar/>
                <Header/>
                <App/>
            </div>
            <Footer/>
        </BrowserRouter>
    </React.StrictMode>
)
