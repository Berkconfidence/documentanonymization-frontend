import React, {useEffect, useState} from 'react';
import './adminarticle.css';
import backIcon from '../../Assets/backicon.png';
import viewIcon from '../../Assets/viewicon.png';
import downloadIcon from '../../Assets/downloadicon.png';
import sendArticleIcon from '../../Assets/sendarticleicon.png';

// Tarihi formatla fonksiyonu ekleyin (bileşen dışında)
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

function AdminArticle() {

    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [articleError, setArticleError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('Yazara İletildi');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch('/articles');
                if (response.ok) {
                    const data = await response.json();
                    setArticles(data);
                    setFilteredArticles(data);
                }
            } catch (error) {
                setArticleError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        };
        fetchArticle();
    }, []);

    useEffect(() => {
        // Arama terimi değiştiğinde filtreleme yap
        const results = articles.filter(article => 
            article.fileName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredArticles(results);
    }, [searchTerm, articles]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleArticle= (articleTrackingNumber) => {
        window.location.href = `http://localhost:3000/admin/makaleler/${articleTrackingNumber}`;
    };

    const downloadPDF = async (article) => {
        try {
            // PDF dosyasını indirmek için endpoint'e istek gönder
            const response = await fetch(`/articles/download/${article.trackingNumber}`);
            
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
            const fileName = article.fileName || `${article.trackingNumber}_makale.pdf`;
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

     // Makale görüntüleme fonksiyonu
     const viewArticle = async (article) => {
        try {
            // PDF dosyasını görüntülemek için endpoint'e istek gönder
            const response = await fetch(`/articles/download/${article.trackingNumber}`);
            
            if (!response.ok) {
                throw new Error('PDF görüntüleme işlemi başarısız oldu');
            }
            
            // Dosyayı blob olarak al
            const blob = await response.blob();
            
            // Dosya için URL oluştur
            const url = window.URL.createObjectURL(blob);
            
            // Yeni sekmede aç
            window.open(url, '_blank');
            
        } catch (error) {
            console.error('PDF görüntüleme hatası:', error);
            alert('PDF görüntüleme sırasında bir hata oluştu.');
        }
    };

    const changeStatus = async (article) => {
        try {
            const response = await fetch(`/articles/updateStatus/${article.trackingNumber}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: selectedStatus,
            });
            if (response.ok) {
                alert("Makale durumu başarıyla güncellendi.");
            } else {
                const errorText = await response.text();
                throw new Error(`Durum güncelleme başarısız: ${response.status} ${errorText}`);
            }
        } catch (error) {
            alert(`Makale durumu güncelleme sırasında bir hata oluştu: ${error.message}`);
        }
    };

    if(articleError) {
        return <div>{articleError}</div>;
    }    

    return (
        <div>
            <div className="adminarticle-header">
                <div className="adminarticle-article-header">
                    <a href="/admin">
                        <button>
                            <img src={backIcon} alt="back" className="adminarticle-back-icon"/>
                        </button>   
                    </a>
                    <span>Makaleler</span>
                </div>
                <div className="adminarticle-search-header">
                    <input 
                        type="text" 
                        placeholder="Makale Ara..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className="adminarticle-card">
                <div className="adminarticle-card-header">
                    <span>Takip Numarası</span>
                    <span>Başlık</span>
                    <span>Yazar</span>
                    <span>Tarih</span>
                    <span>Durum</span>
                    <span>İşlemler</span>
                </div>
                {filteredArticles.map((article, index) => (
                    <div className="adminarticle-card-content" key={article.trackingNumber || index}>
                        <span>{article.trackingNumber}</span>
                        <span>{article.fileName}</span>
                        <span>{article.authorEmail}</span>
                        <span>{article.submissionDate ? formatDate(article.submissionDate) : ''}</span>
                        <span>{article.status}</span>
                        <div className="adminarticle-actions">
                            <button className="adminarticle-action-button" onClick={() => viewArticle(article)}>
                                <img src={viewIcon} alt="view" className="adminarticle-icon"/>
                            </button>
                            <button className="adminarticle-action-button" onClick={() => downloadPDF(article)}>
                                <img src={downloadIcon} alt="download" className="adminarticle-icon"/>
                            </button>
                            <button className="adminarticle-action-button" onClick={() => {
                                setSelectedStatus("Yazara İletildi");
                                changeStatus();
                            }}>
                                <img src={sendArticleIcon} alt="sendarticle" className="adminarticle-icon"/>
                            </button>
                            <button className="adminarticle-action-button details" onClick={() => handleArticle(article.trackingNumber)}>
                                Detaylar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminArticle;
