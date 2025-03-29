import React, {useEffect, useState} from "react";
import './adminlog.css';
import backIcon from '../../Assets/backicon.png';
import userTypeIcon from '../../Assets/adminreviewericon.png';
import calendarIcon from '../../Assets/calendaricon.png';
import searchIcon from '../../Assets/searchicon.png';
import filterIcon from '../../Assets/filtericon.png';

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

function AdminLog() {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logError, setLogError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLogs, setFilteredLogs] = useState([]);
    
    // Filtre seçenekleri
    const [selectedUserType, setSelectedUserType] = useState('Tümü');
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('/logs');
                if (response.ok) {
                    const data = await response.json();
                    setLogs(data);
                    setFilteredLogs(data);
                }
            }
            catch (error) {
                setLogError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        };
        fetchLogs();
    }, []);

    // Arama terimini değiştirdiğimizde filtreleme yap
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredLogs(logs);
        } else {
            const filtered = logs.filter(log => 
                log.articleNumber && log.articleNumber.toString().includes(searchTerm)
            );
            setFilteredLogs(filtered);
        }
    }, [searchTerm, logs]);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const handleUserTypeSelect = (userType) => {
        setSelectedUserType(userType);
        setIsDropdownOpen(false);
    };
    
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };
    
    const applyFilters = () => {
        let filtered = [...logs];
        
        // Makale numarasına göre filtrele
        if (searchTerm) {
            filtered = filtered.filter(log => 
                log.articleNumber && log.articleNumber.toString().includes(searchTerm)
            );
        }
        
        // Kullanıcı tipine göre filtrele
        if (selectedUserType !== 'Tümü') {
            filtered = filtered.filter(log => log.userType === selectedUserType);
        }
        
        // Tarihe göre filtrele
        if (selectedDate) {
            const selectedDateObj = new Date(selectedDate);
            const year = selectedDateObj.getFullYear();
            const month = selectedDateObj.getMonth();
            const day = selectedDateObj.getDate();
            
            filtered = filtered.filter(log => {
                if (!log.actionDate) return false;
                
                const logDate = new Date(log.actionDate);
                return (
                    logDate.getFullYear() === year &&
                    logDate.getMonth() === month &&
                    logDate.getDate() === day
                );
            });
        }
        
        setFilteredLogs(filtered);
    };

    if(logError) {
        return <div>{logError}</div>;
    } 

    return (
        <div>
            <div className="adminlog-header">
                <div className="adminlog-title">
                    <a href="/admin">
                        <button>
                            <img src={backIcon} alt="back" className="adminlog-back-icon"/>
                        </button>   
                    </a>
                    <span>Sistem Logları</span>
                </div>

                <div className="adminlog-search">
                    <div className="adminlog-search-container">
                        <div className="adminlog-search-header">
                            <img src={userTypeIcon} alt="usertype"/>
                            <div className="adminlog-custom-dropdown">
                                <div className="adminlog-dropdown-header"
                                    onClick={handleDropdownToggle}>
                                    <span>{selectedUserType}</span>
                                    <i className="adminlog-dropdown-icon">{isDropdownOpen ? '▲':'▼' }</i>
                                </div>
                                {isDropdownOpen && (
                                    <div className="adminlog-dropdown-content">
                                        <div className="adminlog-dropdown-item" onClick={() => handleUserTypeSelect('Tümü')}>Tümü</div>
                                        <div className="adminlog-dropdown-item" onClick={() => handleUserTypeSelect('Editör')}>Editör</div>
                                        <div className="adminlog-dropdown-item" onClick={() => handleUserTypeSelect('Hakem')}>Hakem</div>
                                        <div className="adminlog-dropdown-item" onClick={() => handleUserTypeSelect('Yazar')}>Yazar</div>
                                    </div>    
                                )}                
                            </div>
                        </div>
                        <div className="adminlog-search-header">
                            <img src={calendarIcon} alt="calendar"/>
                            <input 
                                type="date" 
                                className="adminlog-input" 
                                placeholder="Tarih Seçin"
                                value={selectedDate}
                                onChange={handleDateChange}
                            />
                        </div>
                        <div className="adminlog-search-header">
                            <img src={searchIcon} alt="search"/>
                            <input 
                                type="text" 
                                className="adminlog-input" 
                                placeholder="Makale numarasına göre ara..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <button className="adminlog-search-button" onClick={applyFilters}>
                        <img src={filterIcon} alt="filter" className="adminlog-filter-icon"/>
                        <span>Filtrele</span>
                    </button>
                </div>

                <div className="adminlog-card">
                    <div className="adminlog-card-header">
                        <span>ID</span>
                        <span>Makale Numarası</span>
                        <span>İşlem</span>
                        <span>Kullanıcı</span>
                        <span>Kullanıcı Tipi</span>
                        <span>Tarif</span>
                    </div>
                    {filteredLogs.map((log, index) => (
                        <div className="adminlog-card-content" key={log.id || index}>
                            <span>{log.id}</span>
                            <span>{log.articleNumber}</span>
                            <span>{log.action}</span>
                            <span>{log.user}</span>
                            <span>{log.userType}</span>
                            <span>{log.actionDate ? formatDate(log.actionDate) : ''}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminLog;