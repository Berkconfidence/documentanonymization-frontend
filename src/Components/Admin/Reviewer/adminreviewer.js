import React, { useState } from "react";
import './adminreviewer.css';
import backIcon from '../../Assets/backicon.png';
import searchIcon from '../../Assets/searchicon.png';
import messageIcon from '../../Assets/messageicon.png';
import editIcon from '../../Assets/editicon.png';
import deleteIcon from '../../Assets/deleteicon.png';

function AdminReviewer() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedAreas, setSelectedAreas] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // FormData oluştur
        const formData = new FormData();
        formData.append('name', event.target.name.value);
        formData.append('email', event.target.email.value);
        formData.append('specializations', JSON.stringify(selectedAreas));
        
        try {
            const response = await fetch('/reviewers/create', {
                method: 'POST',
                body: formData
            });
            
            if(response.ok) {
                alert("Hakem başarıyla eklendi.");
                setShowAddForm(false);
                
                // Form alanlarını temizle
                event.target.name.value = '';
                event.target.email.value = '';
                setSelectedAreas([]);
            } else {
                alert("Hakem eklenemedi. Lütfen tekrar deneyin.");
            }
        }
        catch(error) {
            alert("Bağlantı hatası: " + error.message);
        }
    }
    
    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const handleSelectedAreas = (area) => {
        if(selectedAreas.includes(area)) {
            setSelectedAreas(selectedAreas.filter((selectedArea) => selectedArea !== area));
        } else {
            setSelectedAreas([...selectedAreas, area]);
        }
    }

    const selectArea = (area) => {
        if(Array.isArray(selectedAreas)) {
            handleSelectedAreas(area);
        } else {
            setSelectedAreas([area]);
        }
        setIsDropdownOpen(!isDropdownOpen);
    }

    return (
        <div>
            <div className="adminreviewer-header">
                <div className="adminreviewer-title">
                    <a href="/admin">
                        <button>
                            <img src={backIcon} alt="back" className="adminreviewer-back-icon"/>
                        </button>   
                    </a>
                    <span>Hakemler</span>
                </div>
                <div className="adminreviewer-search">
                    <div className="adminreviewer-search-header">
                        <img src={searchIcon} alt="search"/>
                        <input 
                            type="text" 
                            placeholder="Hakem ara..."
                        />
                    </div>
                    <button onClick={toggleAddForm}>
                        <span>+</span>
                        Yeni Hakem Ekle
                    </button>
                </div>
                
                {showAddForm && (
                    <div className="adminreviewer-form-overlay">
                        <div className="adminreviewer-form-container">
                            <div className="adminreviewer-form-header">
                                <div className="adminreviewer-form-title">
                                    <h2>Yeni Hakem Ekle</h2>
                                    <span>Sisteme yeni bir hakem eklemek için aşağıdaki formu doldurun.</span>
                                </div>
                                <button className="adminreviewer-close-button" onClick={toggleAddForm}>×</button>
                            </div>
                            <form className="adminreviewer-form" onSubmit={handleSubmit}>
                                <div className="adminreviewer-form-group">
                                    <label>Ad Soyad</label>
                                    <input type="text" name="name" placeholder="Ad Soyad giriniz" required />
                                </div>
                                <div className="adminreviewer-form-group">
                                    <label>E-posta</label>
                                    <input type="email" name="email" placeholder="E-posta adresi giriniz" required />
                                </div>
                                <div className="adminreviewer-form-group">
                                    <label>Uzmanlık Alanları</label>
                                    <div className="adminreviewer-custom-dropdown">
                                        <div 
                                            className="adminreviewer-dropdown-header" 
                                            onClick={toggleDropdown}
                                        >
                                            <span>Uzmanlık Alanı seçin</span>
                                            <i className="adminreviewer-dropdown-icon">{isDropdownOpen ? '▼' : '▲'}</i>
                                        </div>
                                        {isDropdownOpen && (
                                            <div className="adminreviewer-dropdown-content">
                                                <div className="adminreviewer-dropdown-item" onClick={() => selectArea("Derin öğrenme")}>Derin öğrenme</div>
                                                <div className="adminreviewer-dropdown-item" onClick={() => selectArea("Doğal dil işleme")}>Doğal dil işleme</div>
                                                <div className="adminreviewer-dropdown-item" onClick={() => selectArea("Beyin-bilgisayar arayüzleri")}>Beyin-bilgisayar arayüzleri</div>
                                                <div className="adminreviewer-dropdown-item" onClick={() => selectArea("Artırılmış ve sanal gerçeklik")}>Artırılmış ve sanal gerçeklik</div>
                                                <div className="adminreviewer-dropdown-item" onClick={() => selectArea("Veri madenciliği")}>Veri madenciliği</div>
                                                <div className="adminreviewer-dropdown-item" onClick={() => selectArea("Veri görselleştirme")}>Veri görselleştirme</div>
                                                <div className="adminreviewer-dropdown-item" onClick={() => selectArea("Şifreleme algoritmaları")}>Şifreleme algoritmaları</div>
                                                <div className="adminreviewer-dropdown-item" onClick={() => selectArea("Ağ güvenliği")}>Ağ güvenliği</div>
                                                <div className="adminreviewer-dropdown-item" onClick={() => selectArea("Bulut bilişim")}>Bulut bilişim</div>
                                                <div className="adminreviewer-dropdown-item" onClick={() => selectArea("Blockchain teknolojisi")}>Blockchain teknolojisi</div>
                                            </div>
                                        )}
                                        {selectedAreas && selectedAreas.length > 0 && (
                                            <div className="adminreviewer-selected-areas">
                                                {selectedAreas.map((area, index) => (
                                                    <div className="adminreviewer-selected-area" key={index}>
                                                        <span>{area}</span>
                                                        <button type="button" onClick={() => handleSelectedAreas(area)}>×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="adminreviewer-form-buttons">
                                    <button type="button" className="adminreviewer-cancel-button" onClick={toggleAddForm}>İptal</button>
                                    <button type="submit" className="adminreviewer-submit-button">Ekle</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                
                <div className="adminreviewer-card">
                    <p1>Hakem Listesi</p1>
                    <div className="adminreviewer-card-header">
                        <span>ID</span>
                        <span>Ad Soyad</span>
                        <span>E-posta</span>
                        <span>Uzmanlık Alanları</span>
                        <span>Aktif<br/>İncelemeler</span>
                        <span>Tamamlanan<br/>İncelemeler</span>
                        <span>İşlemler</span>
                    </div>
                    <div className="adminreviewer-card-content" >
                        <span>REV001</span>
                        <span>Berk Güven</span>
                        <span>berkconfidence@gmail.com</span>
                        <p>Yapay Zeka</p>
                        <span>1</span>
                        <span>3</span>
                        <div className="adminarticle-actions">
                            <button className="adminarticle-action-button">
                                <img src={messageIcon} alt="message" className="adminreviewer-message-icon"/>
                            </button>                           
                            <button className="adminarticle-action-button">
                                <img src={editIcon} alt="edit" className="adminreviewer-icon"/>
                            </button>
                            <button className="adminarticle-action-button">
                                <img src={deleteIcon} alt="delete" className="adminreviewer-icon"/>
                            </button>
                        </div>
                    </div>
                </div>        


            </div>
        </div>
    );
}

export default AdminReviewer;