import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './adminarticledetails.css';
import backIcon from '../../../Assets/backicon.png';
import downloadIcon from '../../../Assets/whitedownloadicon.png';
import sendArticleIcon from '../../../Assets/sendarticleicon.png';


const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
};

function AdminArticleDetails() {
    const { articleTrackingNumber } = useParams();
    const [selectedStatus, setSelectedStatus] = useState("Alındı");
    const [selectedReviewer, setSelectedReviewer] = useState("Hakem Seç");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isReviewerDropdownOpen, setIsReviewerDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('active');
    const [article, setArticle] = useState([]);
    const [articleError, setArticleError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`/articles/tracking/${articleTrackingNumber}`);
                if (response.ok) {
                    const data = await response.json();
                    setArticle(data);
                } else {
                    setArticleError("Makale bilgileri alınamadı.");
                }
            } catch (error) {
                setArticleError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        };
        fetchArticle();
    }, [articleTrackingNumber]);

    if(articleError) {
        return <div>{articleError}</div>;
    }
    
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleDropdownReviewer = () => {
        setIsReviewerDropdownOpen(!isReviewerDropdownOpen);
    };
    
    const selectStatus = (status) => {
        setSelectedStatus(status);
        setIsDropdownOpen(false);
    };

    const selectReviewer = (reviewer) => {
        setSelectedReviewer(reviewer);
        setIsReviewerDropdownOpen(false);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    }

    // PDF indirme fonksiyonu
    const downloadPDF = async () => {
        try {
            // PDF dosyasını indirmek için endpoint'e istek gönder
            const response = await fetch(`/articles/${articleTrackingNumber}/download`);
            
            if (!response.ok) {
                throw new Error('PDF indirme işlemi başarısız oldu');
            }
            
            // Dosyayı blob olarak al
            const blob = await response.blob();
            
            // Dosya için URL oluştur
            const url = window.URL.createObjectURL(blob);
            
            // Geçici download link oluştur
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            
            // Dosya adını ayarla
            const fileName = article.fileName || `${articleTrackingNumber}_makale.pdf`;
            a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
            
            // Link'i DOM'a ekle, tıkla ve kaldır
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
        } catch (error) {
            console.error('PDF indirme hatası:', error);
            alert('PDF indirme sırasında bir hata oluştu.');
        }
    };

    return (
        <div>
            <div className="adminarticledetails-header">
                <div className="adminarticledetails-article-header">
                    <button>
                        <a href="/admin/makaleler">
                            <img src={backIcon} alt="back" className="adminarticledetails-back-icon"/>
                        </a>
                    </button>
                    <span>Makaleler</span>
                </div>
            </div>

            <div className="adminarticledetails-card-header">
                <div className="adminarticledetails-card-header1">
                    <div className="adminarticledetails-card">
                        <span className="adminarticledetails-card-title">{article.fileName}</span>
                        <div className="adminarticledetails-card-content">
                            <span className="adminarticledetails-card-content-title">Makale Numarası</span>
                            <span className="adminarticledetails-card-content-text">{article.trackingNumber}</span>
                            <span className="adminarticledetails-card-content-title">E-posta</span>
                            <span className="adminarticledetails-card-content-text">{article.authorEmail}</span>
                            <span className="adminarticledetails-card-content-title">Gönderim Tarihi</span>
                            <span className="adminarticledetails-card-content-text">
                            {article.submissionDate ? formatDate(article.submissionDate) : ''}
                            </span>
                            <span className="adminarticledetails-card-content-title">Makale Durumu</span>
                            <span className="adminarticledetails-card-content-text">{article.status}</span>
                        </div>
                        <div className="adminarticledetails-card-buttons">
                            <button className="adminarticledetails-card-button1" onClick={downloadPDF}>
                                <img src={downloadIcon} alt="back"/>
                                <span>PDF İndir</span>
                            </button>
                            <button className="adminarticledetails-card-button2">
                                <img src={sendArticleIcon} alt="back"/>
                                <span>Anonimleştir ve Hakeme Gönder</span>
                            </button>
                        </div>
                    </div>
                    <div className='adminarticledetails-inquiry-tablist'>
                        <div className='inquiry-tablist-item'>
                            <div 
                                className={`adminarticledetails-inquiry-tab ${activeTab === 'active' ? 'active' : ''}`}
                                onClick={() => handleTabChange('active')}
                            >
                                Hakemler
                            </div>
                            <div 
                                className={`adminarticledetails-inquiry-tab ${activeTab === 'evaluated' ? 'active' : ''}`}
                                onClick={() => handleTabChange('evaluated')}
                            >
                                İşlem Geçmişi
                            </div>
                        </div>
                    </div>
                    {activeTab === 'active' ? (
                        <div className="adminarticledetails-card4">
                            <p>Hakem Ataması</p>
                            {/* article.reviewer ? */}
                            <p1>Henüz hakem ataması yapılmamış</p1>
                            <p2>Yeni Hakem Ata</p2>
                            <div className="adminarticledetails-card4-content">
                                <div className="adminarticledetails-custom-dropdownreviewer">
                                    <div 
                                        className="adminarticledetails-dropdown-header" 
                                        onClick={toggleDropdownReviewer}
                                    >
                                        <span>{selectedReviewer}</span>
                                        <i className="dropdown-icon">{isReviewerDropdownOpen ? '▼' : '▲'}</i>
                                    </div>
                                    {isReviewerDropdownOpen && (
                                        <div className="adminarticledetails-dropdown-content">
                                            <div className="adminarticledetails-dropdown-item" onClick={() => selectReviewer("Berk Güven")}>Berk Güven</div>
                                            <div className="adminarticledetails-dropdown-item" onClick={() => selectReviewer("Ege Polat")}>Ege Polat</div>
                                        </div>
                                    )}
                                </div>
                                <button className="">
                                    Hakem Ata
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="adminarticledetails-card5">
                            <p>İşlem Geçmişi</p>
                            <div className="adminarticledetails-card5-content">
                                <div className="adminarticledetails-card5-item">
                                    <p1>2023-10-15</p1>
                                    <div className="adminarticledetails-card5-item-content">
                                        <span>Makale sisteme yüklendi</span>
                                        <p1>Berk Güven</p1>
                                    </div>
                                </div>
                                <div className="adminarticledetails-card5-item">
                                    <p1>2023-10-15</p1>
                                    <div className="adminarticledetails-card5-item-content">
                                        <span>Makale editör tarafından incelemeye alındı</span>
                                        <p1>Admin</p1>
                                    </div>
                                </div>
                                
                            </div> 
                        </div>
                    )}
                </div>
                <div className="adminarticledetails-card-header2">
                    <div className="adminarticledetails-card2">
                        <span className="adminarticledetails-card-title">Hızlı İşlemler</span>
                        <div className="adminarticledetails-card2-content">
                            <button>
                                <span>Makaleyi Görüntüle</span>
                            </button>
                            <button onClick={downloadPDF}>
                                <span>PDF İndir</span>
                            </button>
                            <button>
                                <span>Anonimleştir</span>
                            </button>
                            <button>
                                <span>Yazara Mesaj Gönder</span>
                            </button>
                            <button>
                                <span>Değerlendirme Sürecini Başlat</span>
                            </button>
                        </div>
                    </div>
                    <div className="adminarticledetails-card3">
                        <span className="adminarticledetails-card-title">Makale Durumu</span>
                        <div className="adminarticledetails-card3-content">
                            <div className="adminarticledetails-custom-dropdown">
                                <div 
                                    className="adminarticledetails-dropdown-header" 
                                    onClick={toggleDropdown}
                                >
                                    <span>{selectedStatus}</span>
                                    <i className="dropdown-icon">{isDropdownOpen ? '▼' : '▲'}</i>
                                </div>
                                {isDropdownOpen && (
                                    <div className="adminarticledetails-dropdown-content">
                                        <div className="adminarticledetails-dropdown-item" onClick={() => selectStatus("Alındı")}>Alındı</div>
                                        <div className="adminarticledetails-dropdown-item" onClick={() => selectStatus("Hakem Değerlendirmesinde")}>Hakem Değerlendirmesinde</div>
                                        <div className="adminarticledetails-dropdown-item" onClick={() => selectStatus("Değerlendirme Tamamlandı")}>Değerlendirme Tamamlandı</div>
                                        <div className="adminarticledetails-dropdown-item" onClick={() => selectStatus("Yazara iletildi")}>Yazara iletildi</div>
                                    </div>
                                )}
                            </div>
                            <button className="adminarticledetails-status-button">
                                Durumu Güncelle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AdminArticleDetails;