import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Navbar/navbar";
import './review.css';
import backIcon from '../../Assets/backicon.png';

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

function Review() {

    const { articleTrackingNumber } = useParams();
    const [article, setArticle] = useState([]);
    const [articleError, setArticleError] = useState(null);
    const [reviewText, setReviewText] = useState("");
    const [reviewer, setReviewer] = useState(null);

    const reviewInputRef = useRef(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`/articles/tracking/${articleTrackingNumber}`);
                if (response.ok) {
                    const data = await response.json();
                    setArticle(data);
                }
            } catch (error) {
                setArticleError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        };
        const fetchReviewer = async () => {
            try {
                const response = await fetch(`/reviewers/trackingnumber/${articleTrackingNumber}`);
                if (response.ok) {
                    const data = await response.json();
                    setReviewer(data);
                }
            } catch (error) {
                setArticleError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        };
        fetchReviewer();
        fetchArticle();
    }, [articleTrackingNumber]);

    const handleReview = async (e) => {
        const formData = new FormData();
        formData.append("reviewText", reviewText);
        formData.append("articleTrackingNumber", articleTrackingNumber);
        try {
            const response = await fetch(`/articles/review/${articleTrackingNumber}`, {
                method: "POST",
                body: formData,
            });
            
            if (response.ok) {
                setReviewText("");
                reviewInputRef.current.value = "";
            }
        }
        catch (error) {
            console.error("Değerlendirme gönderme hatası:", error);
            alert("Değerlendirme gönderme sırasında bir hata oluştu.");
        }
    };


    // Makale görüntüleme fonksiyonu
    const viewAnonimizeArticle = async () => {
        try {
            // PDF dosyasını görüntülemek için endpoint'e istek gönder
            const response = await fetch(`/articles/view/${articleTrackingNumber}`);
            
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

    const handleReviewTextChange = (e) => {
        setReviewText(e.target.value);
    };

    const handleDashboard= () => {
        console.log(reviewer.id);
        if(reviewer)
            window.location.href = `http://localhost:3000/reviewer/dashboard/${reviewer.id}`;
    };

    if (articleError) {
        return <div>{articleError}</div>;
    }

    return (
        <div>
            <Navbar/>
            <div className="review-header"/>
            <div className="review-header">
                <div className="review-title">
                    <button onClick={()=> handleDashboard()}>
                        <img src={backIcon} alt="back" className="review-back-icon"/>
                    </button> 
                    <span>Değerlendirme Formu</span>
                </div>
                <div className="review-card-header">
                    <div className="review-article-card">
                        <span className="review-article-card-title">Makale Bilgileri</span>
                        <span className="review-article-card-subtitle">Başlık</span>
                        <span className="review-article-card-content">{article.fileName}</span>
                        <span className="review-article-card-subtitle">Makale Numarası</span>
                        <span className="review-article-card-trackingnumber">{article.trackingNumber}</span>
                        <span className="review-article-card-subtitle">Anahtar Kelimeler</span>
                        <span className="review-article-card-words">Yapay Zeka</span>
                        <span className="review-article-card-subtitle">Yüklenme Tarihi</span>
                        <span className="review-article-card-content">{article.submissionDate ? formatDate(article.submissionDate) : ''}</span>
                        <span className="review-article-card-subtitle">Durum</span>
                        <span className="review-article-card-status">{article.status}</span>
                        <button onClick={()=>viewAnonimizeArticle()}>Makaleyi Görüntüle</button>
                    </div>
                    <div className="review-card">
                        <span className="review-card-title">Değerlendirme Formu</span>
                        <span className="review-card-subtitle">Yazara Yorumlar</span>
                        <form className="review-chat-input" onSubmit={handleReview}>
                            <textarea
                                ref={reviewInputRef}
                                placeholder={"Yazara iletilecek değerlendirme yorumlarınızı yazın..."}
                                required
                                value={reviewText}
                                onChange={handleReviewTextChange}
                            ></textarea>
                            <div className="review-chat-input-container">
                                <button type="button" className="review-chat-input-cancelbutton" onClick={()=> handleDashboard()}>
                                    İptal
                                </button>
                                <button 
                                    type="submit" 
                                    className={`review-chat-input-sendbutton ${!reviewText.trim() ? 'disabled' : ''}`} 
                                    disabled={!reviewText.trim()}
                                >
                                    Değerlendirmeyi Gönder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Review;
