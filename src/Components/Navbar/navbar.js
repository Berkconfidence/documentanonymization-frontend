import React from "react";
import './navbar.css';
import fileUploadIcon from '../Assets/fileuploadicon.png';
import searchIcon from '../Assets/searchicon.png';


function Navbar() {
    return (
        
        <header className="header">
            <a href="/home" className="home">Home</a>

            <nav className="navbar">
                <button className="navbar-button" onClick={() => window.location.href = '/home'}>
                    <img src={fileUploadIcon} alt="upload" className="upload-icon" />
                    Makale Yükle
                </button>
                <button className="navbar-button" onClick={() => window.location.href = '/makalesorgula'}>
                    <img src={searchIcon} alt="upload" className="search-icon" />
                    Makale Sorgula
                </button>
            </nav>
        </header>
    )
}

export default Navbar;