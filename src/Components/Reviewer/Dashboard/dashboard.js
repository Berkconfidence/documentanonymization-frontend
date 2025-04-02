import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './dashboard.css';
import Navbar from "../../Navbar/navbar";
import backIcon from '../../Assets/backicon.png';
import approvedIcon from '../../Assets/approvedicon.png';
import clockIcon from '../../Assets/clockicon.png';

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

function Dashboard() {
    const { reviewerid } = useParams();
    const [reviewer, setReviewer] = useState(null);
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviewer = async () => {
            try {
                const response = await fetch(`/reviewers/${reviewerid}`);
                if (response.ok) {
                    const data = await response.json();
                    setReviewer(data);
                } 
            } catch (error) {
                setError("Bir hata oluştu: " + error.message);
            }
        };
        const fetchArticle = async () => {
            try {
                const response = await fetch(`/articles/reviewer/${reviewerid}`);
                
                if (response.status === 204) {
                    // İçerik yok (No Content) durumu
                    setArticles([]);
                    return;
                }
                
                if (response.ok) {
                    const data = await response.json();
                    setArticles(data);
                } else {
                    setError(`Makale yüklenirken hata oluştu: HTTP ${response.status}`);
                }
            } catch (error) {
                setError("Makale yüklenirken hata oluştu: " + error.message);
            }
        };
        fetchReviewer();
        fetchArticle();
    }, [reviewerid]);

    const handleArticle= (articleTrackingNumber) => {
        window.location.href = `http://localhost:3000/reviewer/review/${articleTrackingNumber}`;
    };

    if (error) return <div>{error}</div>;
    if (!reviewer) return <div>Yükleniyor...</div>;

    return (
        <div>
            <Navbar />
            <div className="dashboard-header"/>
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <a href="/reviewer">
                        <button>
                            <img src={backIcon} alt="back" className="dashboard-back-icon"/>
                        </button>   
                    </a>
                    <span>Hakem Paneli</span>
                </div>
                <div className="dashboard-card">
                    <span className="dashboard-card-title">Hoş Geldiniz, {reviewer.name} </span>
                    <span className="dashboard-card-title2">
                        Bu panelden size atanan makaleleri değerlendirebilir ve yorumlarınızı gönderebilirsiniz.
                    </span>
                    <div className="dashboard-card-header">
                        <div className="dashboard-card-header-card1">
                            <img src={clockIcon} alt="clock" className="dashboard-card-header-icon"/>
                            <div className="dashboard-card-header-card1-text">
                                <span>Bekleyen Değerlendirmeler</span>
                                <span className="dashboard-card-header-card1-text-subtitle">{reviewer.activeReviewsCount}</span>
                            </div>
                        </div>
                        <div className="dashboard-card-header-card2">
                            <img src={approvedIcon} alt="approved" className="dashboard-card-header-icon"/>
                            <div className="dashboard-card-header-card1-text">
                                <span>Tamamlanan Değerlendirmeler</span>
                                <span className="dashboard-card-header-card1-text-subtitle">{reviewer.completedReviewsCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dashboard-card2">
                    {articles.map((article,index) => (
                        <div className="dashboard-card2-card" key={index}>
                        <div className="dashboard-card2-card-header">
                            <div className="dashboard-card2-card-header-container">
                                <span className="dashboard-card2-card-header-title">{article.fileName}</span>
                                <div className="dashboard-card2-card-header-subtitle">
                                    <span className="dashboard-card2-card-header-title2">{article.trackingNumber}</span>
                                    <span className="dashboard-card2-card-header-title3">Yüklendi: {article.submissionDate ? formatDate(article.submissionDate) : ''}</span>
                                </div>
                            </div>
                            <button 
                                onClick={()=>handleArticle(article.trackingNumber)}
                                className={article.status === "Değerlendirildi" || article.status === "Yazara İletildi" ? "dashboard-evaluated-button" : ""}
                            >
                                {article.status === "Değerlendirildi" || article.status === "Yazara İletildi" ? "Değerlendirildi" : "Değerlendirme Yap"}
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;