import React from "react";
import './navbar.css';
import fileUploadIcon from '../Assets/fileuploadicon.png';
import searchIcon from '../Assets/searchicon.png';


function Navbar() {
    return (
        
        <header className="navbar-header">
            <div>
                <a href="/admin" className="navbar-admin">Admin</a>
                <a href="/reviewer" className="navbar-reviewer">Hakem</a>
            </div>
            <nav className="navbar">
                <button className="navbar-button" onClick={() => window.location.href = '/home'}>
                    <img src={fileUploadIcon} alt="upload" className="navbar-upload-icon" />
                    Makale Yükle
                </button>
                <button className="navbar-button" onClick={() => window.location.href = '/makalesorgula'}>
                    <img src={searchIcon} alt="upload" className="navbar-search-icon" />
                    Makale Sorgula
                </button>
            </nav>
        </header>
    )
}

export default Navbar;