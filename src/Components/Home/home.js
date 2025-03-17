import React, { useRef } from 'react';
import Navbar from '../Navbar/navbar';
import './home.css';
import { useState } from 'react';


function Home() {

    const inputRef = useRef();

    const[selectedFile, setSelectedFile] = useState(null);
    const[uploadSuccess, setUploadSuccess] = useState(false);
    const[trackingNumber, setTrackingNumber] = useState(null);

    const handleFileChange = (event) => {
        if(event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    // Makale Gönderme
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selectedFile) {
            const formData = new FormData();
            formData.append('email', event.target.email.value);
            formData.append('file', selectedFile);
            
            try {
                const response = await fetch('/articles/create', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const articleData = await response.json();
                    setTrackingNumber(articleData.trackingNumber);
                    setUploadSuccess(true);
                } else {
                    alert("Makale gönderilemedi. Lütfen tekrar deneyin.");
                }
            } catch (error) {
                alert("Bağlantı hatası: " + error.message);
            }
        }
    };


    return (
        <div>
            <Navbar />
            <div className="home-article-header">
                    <h1>Makale Yükle</h1>
            </div>
            <div className="home-card">
                <h2>Makalenizi Yükleyebilirsiniz</h2>               
                <p className='home-labelinfo'>Lütfen e-postanızı girin ve makalenizi PDF formatında yükleyin.</p>
                <br></br>
                <form onSubmit={handleSubmit}>
                    <label for="email">Email</label>
                    <br></br>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className='home-email'
                        placeholder='ornek@email.com'
                        required
                    >
                    </input><br></br>       
                    <label for="pdf">PDF Makale</label>
                    <input
                        ref={inputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf" 
                        style={{display: 'none'}}
                        required
                    >
                    </input><br></br>
                    {!selectedFile && (
                        <button type="button" className="home-file-button" onClick={onChooseFile}>
                            <span className="material-symbols-outlined">PDF Yükle</span>
                            <span>Dosya yüklemek için tıklayın veya sürükleyin</span>
                            <span className="home-small-text">Sadece PDF dosyaları desteklenir</span>
                        </button>
                    )}

                    {selectedFile && (
                        <button type="button" className="home-file-button" onClick={onChooseFile}>
                            <span className="material-symbols-outlined">PDF Yükle</span>
                            <span>Dosya yüklemek için tıklayın veya sürükleyin</span>
                            <span className="home-small-text">Sadece PDF dosyaları desteklenir</span>
                            <span className="home-file-name">{selectedFile.name}</span>
                        </button>                     
                    )}
                    {uploadSuccess && (  
                        <>
                            <span className="home-succes-article">
                                PDF başarıyla yüklendi! 
                            </span>
                            <p>Takip Numaranız: <strong>{trackingNumber}</strong></p>
                        </>                                    
                    )}
                    <button type="submit" className="home-upload-article">Makaleyi Yükle</button>
                </form>

            </div>
        </div>
    )
}

export default Home;