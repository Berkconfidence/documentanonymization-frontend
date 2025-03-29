import React, {useEffect, useState} from "react";
import './reviewer.css';
import Navbar from "../Navbar/navbar";
import reviewerIcon from '../Assets/reviewericon.png';

function Reviewer() {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState('Hakem seçin');
    const [reviewers, setReviewers] = useState([]);
    const [selectedReviewer, setSelectedReviewer] = useState(null);
    const [reviewerError, setReviewerError] = useState(null);

    useEffect(() => {
        const fetchReviewers = async () => {
            try {
                const response = await fetch('/reviewers/all');
                if (response.ok) {
                    const data = await response.json();
                    setReviewers(data);
                }
            }
            catch (error) {
                setReviewerError("Bağlantı hatası: " + error.message);
            }
        };
        fetchReviewers();
    }, []);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleUserTypeSelect = (reviewer) => {
        setSelectedUserType(reviewer.name);
        setSelectedReviewer(reviewer);
        setIsDropdownOpen(false);
    };

    const handleDashboardClick = () => {
        if (selectedReviewer) {
            window.location.href = `/reviewer/dashboard/${selectedReviewer.id}`;
        }
        else
            alert("Lütfen bir hakem seçin.");
    }

    if (reviewerError) {
        return <div>{reviewerError}</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="reviewer-header"/>
            <div className="reviewer-card">
                <div className="reviewer-card-header">
                    <span className="reviewer-card-header-title">Hakem Paneli</span>
                    <span className="reviewer-card-header-title2">
                        Değerlendirme yapmak için lütfen kendinizi seçin.
                    </span>
                </div>
                <div className="reviewer-card-body">
                    <span className="reviewer-card-body-title">Hakem Seçimi</span>
                    <div className="reviewer-custom-dropdown">
                        <div className="reviewer-dropdown-header"
                            onClick={handleDropdownToggle}>
                            <span>{selectedUserType}</span>
                            <i className="reviewer-dropdown-icon">{isDropdownOpen ? '▲':'▼' }</i>
                        </div>
                        {isDropdownOpen && (                     
                            <div className="reviewer-dropdown-content">
                                {reviewers.map((reviewer, index) => (
                                    <div className="reviewer-dropdown-item" key={index} onClick={()=>handleUserTypeSelect(reviewer)}>{reviewer.name}</div>
                                ))}
                            </div>  
                        )}                
                    </div>
                    <button className="reviewer-card-body-button" onClick={handleDashboardClick}>
                        <img src={reviewerIcon} alt="reviewer"/>
                        <span>Hakem Paneline Giriş Yap</span>
                    </button>
                    <div className="reviewer-card-body-text">
                        <span>Hakem olarak sisteme giriş yapmak için yukarıdan adınızı seçin.</span>
                        <span>Sorun yaşarsanız lütfen editör ile iletişime geçin.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Reviewer;