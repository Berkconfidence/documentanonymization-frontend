import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/home';
import Inquiry from './Components/Inquiry/inquiry';
import Admin from './Components/Admin/admin';
import AdminMakale from './Components/Admin/Article/adminarticle';
import AdminMakaleDetails from './Components/Admin/Article/[id]/adminarticledetails';

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
            </Routes>
       </BrowserRouter>
    </div>
  );
}

export default App;
