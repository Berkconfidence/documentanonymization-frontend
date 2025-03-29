import React, {useEffect, useState, useRef} from "react";
import "./adminmessage.css";
import backIcon from "../../Assets/backicon.png";
import searchIcon from "../../Assets/searchicon.png";
import chatIcon from "../../Assets/chaticon.png";

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


function AdminMessage() {

    const [receiveMessages, setReceiveMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [senderEmail, setSenderEmail] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sendMessages, setSendMessages] = useState([]);

    const messageInputRef = useRef();

    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                const response = await fetch(`/messages`);
                if (response.ok) {
                    const data = await response.json();
                    setReceiveMessages(data);
                }
            }
            catch (error) {
                alert("Bağlantı hatası: " + error.message);
            }
        }
        fetchAllMessages();
    }, []);

    // Kullanıcı seçildiğinde o kullanıcıya ait mesajları filtrele
    useEffect(() => {
        if(senderEmail) {
            const filteredMessages = receiveMessages.filter(
                message => message.senderEmail === senderEmail || message.receiverEmail === senderEmail
            ).sort((a, b) => new Date(a.sentDate) - new Date(b.sentDate)); // Eskiden yeniye sırala
            
            setMessages(filteredMessages);
        }
    }, [senderEmail, receiveMessages]);

    // Son mesajları gruplandıran fonksiyon
    const getLastMessagePerSender = () => {
        const sendersMap = new Map();
        
        // Her gönderen için en son mesajı bul
        receiveMessages.forEach(message => {
            // Admin mailini filtrele
            if (message.senderEmail === 'admin@gmail.com') return;
            
            if(!sendersMap.has(message.senderEmail) || 
                new Date(message.sentDate) > new Date(sendersMap.get(message.senderEmail).sentDate))
            {
                sendersMap.set(message.senderEmail, message);
            }
        });
        
        // Map'ten değerleri diziye dönüştür ve tarih sırasına göre sırala
        return Array.from(sendersMap.values())
            .filter(message => message.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));
    };


    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        // Kullanıcı seçilmediyse işlemi durdur
        if (!senderEmail) {
            alert("Lütfen önce bir kullanıcı seçiniz!");
            return;
        }
        
        const messageValue = messageInputRef.current.value;
        try {
            const formData = new FormData();
            formData.append('email', senderEmail);
            formData.append('content', messageValue);

            const response = await fetch('/messages/admincreate', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                // Tüm mesajları yeniden yükle
                fetchAllMessages();
                // Mevcut mesaj dizisini güncelle
                setMessages([...messages, data]);
            }
            if (!response.ok) {
                alert("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
            }
        }
        catch (error) {
            alert("Bağlantı hatası: " + error.message);
        }
        setSendMessages([...sendMessages, messageValue]);
        messageInputRef.current.value = '';
    }

    // Mesaj listesini çekmek için ayrı bir fonksiyon tanımla
    const fetchAllMessages = async () => {
        try {
            const response = await fetch(`/messages`);
            if (response.ok) {
                const data = await response.json();
                setReceiveMessages(data);
            }
        }
        catch (error) {
            alert("Bağlantı hatası: " + error.message);
        }
    }

    return (
        <div>
            <div className="adminmessage-header">
                <div className="adminmessage-title">
                    <a href="/admin">
                        <button>
                            <img src={backIcon} alt="back" className="adminmessage-back-icon"/>
                        </button>   
                    </a>
                    <span>Mesajlar</span>
                </div>
                <div className="adminmessage-cardheader">
                    <div className="adminmessage-cardinbox">
                        <div className="adminmessage-cardinbox-title">
                            <span>Gelen Kutusu</span>
                        </div>
                        <div className="adminmessage-cardinbox-search">
                            <img src={searchIcon} alt="search"/>
                            <input 
                                type="text" 
                                placeholder="Mesaj ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {getLastMessagePerSender().map((message) =>
                            <button key={message.senderEmail} onClick={() => setSenderEmail(message.senderEmail)}>
                                <div className="adminmessage-cardinbox-content">
                                    <div className="adminmessage-cardinbox-content-header">
                                        <span className="adminmessage-cardinbox-content-sender">
                                            {message.senderEmail}
                                        </span>
                                        <span className="adminmessage-cardinbox-content-date">
                                            {message.sentDate ? formatDate(message.sentDate) : ''}
                                        </span>
                                    </div>
                                    <span className="adminmessage-cardinbox-content-message-text">
                                        {message.content.length > 40 ? message.content.substring(0, 40) + "..." : message.content}
                                    </span>
                                </div>
                            </button>
                        )}
                        
                    </div>
    
                    <div className="adminmessage-cardoutbox">
                        <div className="adminmessage-cardoutbox-title">
                            <span>Mesaj İçeriği</span>
                        </div>
                        <div className="adminmessage-cardoutbox-senderheader">
                            <div>
                                <span className="adminmessage-cardoutbox-senderinfo">
                                    Gönderen:
                                </span>
                                <span className="adminmessage-cardoutbox-sender">
                                    {senderEmail}
                                </span>
                            </div>
                            <span className="adminmessage-cardoutbox-date">
                                {messages.length > 0 ? formatDate(messages[messages.length - 1].sentDate) : ''}
                            </span>
                        </div>
                        <div className="adminmessage-chat-container">
                            {senderEmail ? (
                                <>
                                    <div className="adminmessage-cardoutbox-messagepanel">
                                        {messages.length > 0 ? (
                                            messages.map((message) => (
                                                message.senderEmail !== senderEmail ? (
                                                    <div className="adminmessage-chat-adminmessage" key={message.sentDate}>
                                                        <span>{message.content}</span>
                                                        <span className="adminmessage-chat-clock">
                                                            {message.sentDate ? formatDate(message.sentDate) : ''}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="adminmessage-chat-authormessage" key={message.sentDate}>
                                                        <span>{message.content}</span>
                                                        <span className="adminmessage-chat-authorclock">
                                                            {message.sentDate ? formatDate(message.sentDate) : ''}
                                                        </span>
                                                    </div>
                                                )
                                            ))
                                        ) : (
                                            <div className="adminmessage-no-messages">Bu kullanıcı ile mesajlaşma bulunmamaktadır.</div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="adminmessage-select-user">
                                    Lütfen sol taraftan bir kullanıcı seçiniz
                                </div>
                            )}
                        </div>

                        <span className="adminmessage-cardoutbox-reply">
                            Yanıt
                        </span>
                        <form className="adminmessage-chat-input" onSubmit={handleSendMessage}>
                            <textarea 
                                ref={messageInputRef}
                                placeholder={senderEmail ? "Mesajınızı yazın..." : "Önce bir kullanıcı seçiniz!"}
                                required
                                disabled={!senderEmail}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey && senderEmail) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            ></textarea>
                            <button type="submit" disabled={!senderEmail}>
                                <img src={chatIcon} alt="chat" className="adminmessage-chat-messageicon" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AdminMessage;