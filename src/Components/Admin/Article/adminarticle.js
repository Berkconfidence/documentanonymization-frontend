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
    const [articleError, setArticleError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch('/articles');
                if (response.ok) {
                    const data = await response.json();
                    setArticles(data);
                } else {
                    setArticleError("Kullanıcı bilgileri alınamadı.");
                }
            } catch (error) {
                setArticleError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        };
        fetchArticle();
    }, []);

    const handleArticle= (articleTrackingNumber) => {
        window.location.href = `http://localhost:3000/admin/makaleler/${articleTrackingNumber}`;
    };

    if(articleError) {
        return <div>{articleError}</div>;
    }    

    return (
        <div>
            <div className="adminarticle-header">
                <div className="adminarticle-article-header">
                    <button>
                        <a href="/admin">
                            <img src={backIcon} alt="back" className="adminarticle-back-icon"/>
                        </a>
                    </button>
                    <span>Makaleler</span>
                </div>
                <div className="adminarticle-search-header">
                    <input 
                        type="text" 
                        placeholder="Makale Ara..."
                    />
                    <button>
                        Ara
                    </button>
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
                {articles.map((article, index) => (
                    <div className="adminarticle-card-content" key={article.trackingNumber || index}>
                        <span>{article.trackingNumber}</span>
                        <span>{article.fileName}</span>
                        <span>{article.authorEmail}</span>
                        <span>{article.submissionDate ? formatDate(article.submissionDate) : ''}</span>
                        <span>{article.status}</span>
                        <div className="adminarticle-actions">
                            <button className="adminarticle-action-button">
                                <a href="/admin">
                                    <img src={viewIcon} alt="view" className="adminarticle-icon"/>
                                </a>
                            </button>
                            <button className="adminarticle-action-button">
                                <a href="/admin">
                                    <img src={downloadIcon} alt="download" className="adminarticle-icon"/>
                                </a>
                            </button>
                            <button className="adminarticle-action-button">
                                <a href="/admin">
                                    <img src={sendArticleIcon} alt="sendarticle" className="adminarticle-icon"/>
                                </a>
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
