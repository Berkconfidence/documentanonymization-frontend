import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/home';
import Inquiry from './Components/Inquiry/inquiry';

function App() {
  return (
    
    <div className="App">
      <BrowserRouter>
            <Routes>
              <Route exact path='/home' Component={Home}></Route>
              <Route exact path='/makalesorgula' Component={Inquiry}></Route>
              
            </Routes>
       </BrowserRouter>
    </div>
  );
}

export default App;
