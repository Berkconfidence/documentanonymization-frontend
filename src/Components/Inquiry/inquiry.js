import React, { useRef } from 'react';
import Navbar from '../Navbar/navbar';
import './inquiry.css';
import { useState } from 'react';
import searchIcon from '../Assets/searchicon.png';


function Home() {

    const [inquiryType, setInquiryType] = useState('article');
    const [showResult, setShowResult] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [email, setEmail] = useState('');
    const [activeTab, setActiveTab] = useState('active');
    
    const articleInputRef = useRef();
    const emailInputRef = useRef();

    const handleInquiryType = (e) => {
        setInquiryType(e.target.value);
        setShowResult(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inquiryType === 'article') {
            setTrackingNumber(articleInputRef.current.value);
        } else {
            setEmail(emailInputRef.current.value);
        }
        setShowResult(true);
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    }

    return (
        <div>
            <Navbar />
            <div className="inquiry-article-header">
                    <h1>Makale Takip Sistemi</h1>
            </div>
            <div className="inquiry-card">
                <h2>Makale Sorgulama</h2>               
                <p className='inquiry-labelinfo'>E-posta adresiniz veya makale takip numaranız ile makalenizin durumunu sorgulayabilirsiniz.</p>
                <br></br>
                
                <div className="inquiry-form">
                    <input 
                        type='radio' 
                        id='article' 
                        name='inquiry' 
                        value='article'
                        className='inquiry-radio'
                        checked={inquiryType === 'article'}
                        onChange={handleInquiryType}
                    />
                    <label htmlFor='article' className='inquiry-articlenumber-label'>Takip Numarası ile Sorgula</label>
                    <input 
                        type='radio' 
                        id='email' 
                        name='inquiry' 
                        value='email' 
                        className='inquiry-radio'
                        checked={inquiryType === 'email'}
                        onChange={handleInquiryType}
                    />
                    <label htmlFor='email' className='inquiry-email-label'>E-posta ile Sorgula</label>                             
                </div>

                {inquiryType === 'article' ?
                    <div className='inquiry-article-input'>
                        <span className='inquiry-radio-span'>Takip Numarası</span>
                        <div className="inquiry-input-with-icon">
                            <img src={searchIcon} alt="search" className="inquiry-input-icon" />
                            <input 
                                type='text' 
                                placeholder='Örn: 12345678' 
                                ref={articleInputRef}
                            />
                        </div>
                        <button onClick={handleSubmit}>Sorgula</button>
                    </div>
                    :
                    <div className='inquiry-article-input'>
                        <span className='inquiry-radio-span'>E-posta Adresi</span>
                        <div className="inquiry-input-with-icon">
                            <img src={searchIcon} alt="search" className="inquiry-input-icon" />
                            <input 
                                type='text' 
                                placeholder='Örn: ornek@email.com' 
                                ref={emailInputRef}
                            />
                        </div>
                        <button onClick={handleSubmit}>Sorgula</button>
                    </div>                   
                }
            </div>

            {showResult && (
                    <div className='inquiry-card'>
                        <h2>Sorgu Sonuçları</h2>
                        {inquiryType === 'article' ? (
                            <p className='inquiry-labelinfo'>"{trackingNumber}" takip numaralı makale sonuçları</p>
                        ) : (
                            <p className='inquiry-labelinfo'>"{email}" e-posta adresine ait makale sonuçları</p>
                        )}
                        
                        <div className='inquiry-tablist'>
                            <div className='inquiry-tablist-item'>
                                <div 
                                    className={`inquiry-tab ${activeTab === 'active' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('active')}
                                >
                                    Aktif Makaleler
                                </div>
                                <div 
                                    className={`inquiry-tab ${activeTab === 'evaluated' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('evaluated')}
                                >
                                    Değerlendirilen Makaleler
                                </div>
                            </div>
                        </div>
                        
                        {activeTab === 'active' ? (
                            <div className="tab-content">
                                <p>Aktif makalelerinizin içeriği burada görüntülenecek</p>
                                {/* Aktif makaleler içeriği */}
                            </div>
                        ) : (
                            <div className="tab-content">
                                <p>Değerlendirilen makalelerinizin içeriği burada görüntülenecek</p>
                                {/* Değerlendirilen makaleler içeriği */}
                            </div>
                        )}
                    </div>
            )}
        </div>
    )
}

export default Home;