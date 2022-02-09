import React, { useState, useEffect }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import LandingPage from './pages/LandingPage/LandingPage';
import SignUp from './pages/SignUp/SignUp';
import SignIn from './pages/SignIn/SignIn';
import MainNavigation from './components/MainNavigation/MainNavigation';
import Income from './pages/Income/Income';
import Spendings from './pages/Spendings/Spendings';
import OverallLook from './pages/OverallLook/OverallLook';
import Settings from './pages/Settings/Settings';
import AddRecord from './pages/AddRecord/AddRecord';
import EditRecord from './pages/EditRecord/EditRecord';
import AddCategory from './pages/AddCategory/AddCategory';
import Error from './pages/Error/Error';

import Header from './components/Header/Header';

import history from './history';

import './App.scss';

const App = () => {

  const [auth, setAuth] = useState(false);
  const [userData, setUserData] = useState({});

  const setGlobalCurrency = (curr) => {
    setUserData({
      ...userData,
      currency: curr
    })
  }

  useEffect(() => {
    if (Cookies.get('login')) {
      let authData = {
        query: `
          query {
            getSession(token: "${Cookies.get('login')}") {
              creator {
                _id
                balance
                currency
              }
          }
        }
      `
    };
  
    axios({
      method: 'POST',
      url: `http://localhost:3005/graphql`,
      data: authData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cookies.get('login'),
      }
      })
      .then(resData => {
        if (!resData.data.data.getSession.creator._id) {
          return setAuth(false);
        }
        setUserData({ 
          _id: resData.data.data.getSession.creator._id,
          balance: resData.data.data.getSession.creator.balance,
          currency: resData.data.data.getSession.creator.currency
        })
        setAuth(true);
      })
      .catch(err => console.log(err));
  }
  
}, [])

  return (
    <Router history={history} >
      <main className='app'>
        <Header userData={userData} auth={auth} />
        {auth ? <MainNavigation /> : null}
          <Routes className='app__content'>       
            {auth ? <Route path='/' element={<Income />} exact /> : <Route path='/' element={<LandingPage />} exact />} 
            {auth ? <Route path='/signup' element={<Error />} exact /> : <Route path='/signup' element={<SignUp />} exact />}     
            {auth ? <Route path='/signin' element={<Error />} exact /> : <Route path='/signin' element={<SignIn />} exact />}     
            {auth ? <Route path='/income' element={<Income userData={userData} />} exact /> : <Route path='/income' element={<Error />} exact />}
            {auth ? <Route path='/income/:id' element={<EditRecord />} exact /> : <Route path='/income/:id' element={<Error />} exact />}
            {auth ? <Route path='/spendings/:id' element={<EditRecord />} exact /> : <Route path='/spendings/:id' element={<Error />} exact />}
            {auth ? <Route path='/spendings' element={<Spendings userData={userData} />} exact /> : <Route path='/spendings' element={<Error />} exact />}
            {auth ? <Route path='/overallLook' element={<OverallLook userData={userData} />} exact /> : <Route path='/overallLook' element={<Error />} exact />}
            {auth ? <Route path='/addrecord' element={<AddRecord userData={userData} />} exact /> : <Route path='/addrecord' element={<Error />} exact />}
            {auth ? <Route path='/settings/addcategory' element={<AddCategory userData={userData} />} exact /> : <Route path='/settings/addcategory' element={<Error />} exact />}
            {auth ? <Route path='/settings' element={<Settings userData={userData} setGlobalCurrency={setGlobalCurrency} />} exact /> : <Route path='/settings' element={<Error />} exact />}
            <Route path='*' element={<Error />} />         
          </Routes>
        </main>
    </Router>
  )
}

export default App;