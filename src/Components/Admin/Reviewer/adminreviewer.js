import React, { useState, useEffect } from "react";
import './adminreviewer.css';
import backIcon from '../../Assets/backicon.png';
import searchIcon from '../../Assets/searchicon.png';
import messageIcon from '../../Assets/messageicon.png';
import editIcon from '../../Assets/editicon.png';
import deleteIcon from '../../Assets/deleteicon.png';

function AdminReviewer() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [reviewers, setReviewers] = useState([]);
    const [editReviewer, setEditReviewer] = useState(null);
    const [reviewerError, setReviewerError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchReviewers = async () => {
            try {
                const response = await fetch('/reviewers/all');
                if (response.ok) {
                    const data = await response.json();
                    setReviewers(data);
                }
            } catch (error) {
                setReviewerError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        };

        fetchReviewers();
    }, []);

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

    const handleEdit = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('id', editReviewer.id);
        formData.append('name', event.target.name.value);
        formData.append('email', event.target.email.value);
        formData.append('specializations', JSON.stringify(selectedAreas));

        try {
            const response = await fetch('/reviewers/update', {
                method: 'PUT',
                body: formData  // JSON yerine FormData gönder
            });

            if(response.ok) {
                const updatedReviewer = await response.json();
                alert("Hakem bilgileri başarıyla güncellendi.");
                // Backend'den gelen güncel veriyle listeyi güncelle
                setReviewers(reviewers.map(r => r.id === updatedReviewer.id ? updatedReviewer : r));
                setShowEditForm(false);
                setEditReviewer(null);
                setSelectedAreas([]);
            } else {
                alert("Hakem bilgileri güncellenemedi. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            alert("Bağlantı hatası: " + error.message);
        }
    }

    const deleteReviewer = async (reviewerId) => {
        if (window.confirm('Bu hakemi silmek istediğinizden emin misiniz?')) {
            try {
                const response = await fetch(`/reviewers?id=${reviewerId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if(response.ok) {
                    alert("Hakem başarıyla silindi.");
                    setReviewers(reviewers.filter(reviewer => reviewer.id !== reviewerId));
                } else {
                    alert("Hakem silinemedi. Lütfen tekrar deneyin.");
                }
            } catch (error) {
                alert("Bağlantı hatası: " + error.message);
            }
        }
    }
        
    
    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
        if (showAddForm) {
            setSelectedAreas([]);
            const form = document.querySelector('.adminreviewer-form');
            if (form) form.reset();
        }
    }

    const handleCancel = () => {
        setShowAddForm(false);
        setSelectedAreas([]);
        const form = document.querySelector('.adminreviewer-form');
        if (form) form.reset();
    }

    const toggleEditForm = (reviewer) => {
        setShowEditForm(!showEditForm);
        if (!showEditForm) {
            setEditReviewer(reviewer);
            setSelectedAreas(reviewer.specializations);
        } else {
            setEditReviewer(null);
            setSelectedAreas([]);
        }
    }

    const toggleCloseForm = () => {
        setShowEditForm(false);
        setEditReviewer(null);
        setSelectedAreas([]);
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

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredReviewers = reviewers.filter(reviewer => 
        reviewer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if(reviewerError) {
        return <div>{reviewerError}</div>;
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
                            value={searchTerm}
                            onChange={handleSearch}
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
                                <button className="adminreviewer-close-button" onClick={handleCancel}>×</button>
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
                                    <button type="button" className="adminreviewer-cancel-button" onClick={handleCancel}>İptal</button>
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
                    {filteredReviewers.map((reviewer, index) => (
                        <div className="adminreviewer-card-content" key={reviewer.id || index}>
                            <span>{reviewer.id}</span>
                            <span>{reviewer.name}</span>
                            <span>{reviewer.email}</span>
                            <p>
                                {reviewer.specializations.map((spec, idx) => (
                                    <label key={idx} className="adminreviewer-specialization-badge">
                                        {spec}
                                    </label>
                                ))}
                            </p>
                            <span>{reviewer.activeReviewsCount}</span>
                            <span>{reviewer.completedReviewsCount}</span>
                            <div className="adminarticle-actions">
                                <button className="adminarticle-action-button">
                                    <img src={messageIcon} alt="message" className="adminreviewer-message-icon"/>
                                </button>                           
                                <button className="adminarticle-action-button">
                                    <img src={editIcon} alt="edit" className="adminreviewer-icon" onClick={() => toggleEditForm(reviewer)}/>
                                </button>
                                <button className="adminarticle-action-button" onClick={() => deleteReviewer(reviewer.id)}>
                                    <img src={deleteIcon} alt="delete" className="adminreviewer-icon"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {showEditForm && (
                    <div className="adminreviewer-form-overlay">
                        <div className="adminreviewer-form-container">
                            <div className="adminreviewer-form-header">
                                <div className="adminreviewer-form-title">
                                    <h2>Hakem Düzenle</h2>
                                    <span>Hakem bilgilerini düzenlemek için formu kullanın.</span>
                                </div>
                                <button className="adminreviewer-close-button" onClick={toggleCloseForm}>×</button>
                            </div>
                            <form className="adminreviewer-form" onSubmit={handleEdit}>
                                <div className="adminreviewer-form-group">
                                    <label>Ad Soyad</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        placeholder="Ad Soyad giriniz" 
                                        defaultValue={editReviewer?.name}
                                        required 
                                    />
                                </div>
                                <div className="adminreviewer-form-group">
                                    <label>E-posta</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="E-posta adresi giriniz" 
                                        defaultValue={editReviewer?.email}
                                        required 
                                    />
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
                                    <button type="button" className="adminreviewer-cancel-button" onClick={toggleCloseForm}>İptal</button>
                                    <button type="submit" className="adminreviewer-submit-button">Güncelle</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}    


            </div>
        </div>
    );
}

export default AdminReviewer;