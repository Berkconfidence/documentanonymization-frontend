import React from 'react';
import Navbar from '../Navbar/navbar';
import './admin.css';
import adminarticleIcon from '../Assets/adminarticleicon.png' 
import adminreviewerIcon from '../Assets/adminreviewericon.png'
import admincommentIcon from '../Assets/admincommenticon.png'
import admininboxIcon from '../Assets/admininboxicon.png'
import adminlogIcon from '../Assets/adminlogicon.png'

function Admin() {
    return (
        <div>
            <Navbar/>
            <div className="admin-article-header">
                    <h1>Admin Paneli</h1>
            </div>

            <div className="admin-card-header">
                <div className="admin-card">
                    <div className="admin-card-title">
                        <span>Makaleler</span>
                        <img src={adminarticleIcon} alt="makale" className="admin-article-icon" />
                    </div>
                    <div className="admin-card-content">
                        <span>Sisteme yüklenen tüm makaleleri görüntüleyin ve yönetin.</span>
                        <button className="admin-article-button">
                            <a href="/admin/makaleler">Makaleleri Görüntüle</a>
                        </button>   
                    </div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">
                        <span>Hakemler</span>
                        <img src={adminreviewerIcon} alt="reviewer" className="admin-reviewer-icon" />
                    </div>
                    <div className="admin-card-content">
                        <span>Hakem atamalarını yönetin ve hakem değişiklikleri yapın.</span>
                        <button className="admin-article-button">
                            <a href="/admin">Hakemleri Yönet</a>
                        </button>   
                    </div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">
                        <span>Mesajlar</span>
                        <img src={admincommentIcon} alt="reviewer" className="admin-comment-icon" />
                    </div>
                    <div className="admin-card-content">
                        <span>Yazarlardan gelen mesajları görüntüleyin ve yanıtlayın.</span>
                        <button className="admin-article-button">
                            <a href="/admin">Mesajları Görüntüle</a>
                        </button>   
                    </div>
                </div>
            </div>
            <div className="admin-card-header">
                <div className="admin-card">
                    <div className="admin-card-title">
                        <span>Değerlendirme Süreci</span>
                        <img src={admininboxIcon} alt="makale" className="admin-inbox-icon" />
                    </div>
                    <div className="admin-card-content">
                        <span>Değerlendirme sürecindeki makaleleri takip edin.</span>
                        <button className="admin-article-button">
                            <a href="/admin">Süreci Görüntüle</a>
                        </button>   
                    </div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">
                        <span>Sistem Logları</span>
                        <img src={adminlogIcon} alt="reviewer" className="admin-log-icon" />
                    </div>
                    <div className="admin-card-content">
                        <span>Sistemdeki makale işlemlerinin log kayıtlarını inceleyin.</span>
                        <button className="admin-article-button">
                            <a href="/admin">Logları Görüntüle</a>
                        </button>   
                    </div>
                </div>
                <div className="admin-card empty-card">
                    {/* Boş kart - sadece yer tutucu */}
                </div>
            </div>
        </div>
    )
}

export default Admin;