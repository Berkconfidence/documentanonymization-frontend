import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/home';
import Inquiry from './Components/Inquiry/inquiry';
import Admin from './Components/Admin/admin';
import AdminMakale from './Components/Admin/Article/adminarticle';
import AdminMakaleDetails from './Components/Admin/Article/[id]/adminarticledetails';
import AdminHakem from './Components/Admin/Reviewer/adminreviewer';
import AdminMessage from './Components/Admin/Message/adminmessage';
import AdminLog from './Components/Admin/Log/adminlog';
import Reviewer from './Components/Reviewer/reviewer';
import ReviewerDashboard from './Components/Reviewer/Dashboard/dashboard';
import ReviewerReview from './Components/Reviewer/Review/review';

function App() {
  return (
    
    <div className="App">
      <BrowserRouter>
            <Routes>
              <Route exact path='/home' Component={Home}></Route>
              <Route exact path='/makalesorgula' Component={Inquiry}></Route>
              <Route exact path='/admin' Component={Admin}></Route>
              <Route exact path='/admin/makaleler' Component={AdminMakale}></Route>
              <Route exact path='/admin/makaleler/:articleTrackingNumber' Component={AdminMakaleDetails}></Route>
              <Route exact path='/admin/hakemler' Component={AdminHakem}></Route>
              <Route exact path='/admin/mesajlar' Component={AdminMessage}></Route>
              <Route exact path='/admin/loglar' Component={AdminLog}></Route>
              <Route exact path='/reviewer' Component={Reviewer}></Route>
              <Route exact path='/reviewer/dashboard/:reviewerid' Component={ReviewerDashboard}></Route>
              <Route exact path='/reviewer/review/:articleTrackingNumber' Component={ReviewerReview}></Route>
            </Routes>
       </BrowserRouter>
    </div>
  );
}

export default App;
