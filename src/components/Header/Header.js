import React from 'react';
import Cookies from 'js-cookie';

import { Link } from 'react-router-dom'

import './Header.scss';

import history from '../../history';

const LandingPage = ({ auth, userData }) => {

  const logout = () => {
    Cookies.remove('login');
    history.push('/');
    window.location.reload();
  }


  return (
    <div className='header'>
      {auth ? 
        <div className='header__balance'>
          <img src='/icons/balance.png' className='header__home-icon' alt='home-icon' />
          <h2 className='header__balance-header'>
            {userData.balance + ` ${userData.currency}`}
          </h2> 
        </div>
      : 
      <div className='header__box'>
        <Link className='header__link' to="/">
          <img src='/icons/home.png' className='header__home-icon' alt='home-icon' />
        </Link>
        <Link className='header__link' to="/info">
          <img src='/icons/info.png' className='header__home-icon' alt='info-icon' />
        </Link>
      </div>   
      }
      {auth ? 
        <nav>
          <Link className='btn__long-white header__logout' to="/" onClick={() => logout()}>
            <h3>Logout</h3>
            <img src='/icons/logout.png' className='header__logout-icon' alt='home-icon' />
          </Link>
        </nav> 
      :
        <nav className='header__nav'>
          <Link className='btn__small-lightorange' to="/signin">Sign in</Link>
          <Link className='btn__small-white' to='signup'>Sign up</Link>
        </nav>
      }
    </div>
  )
}

export default LandingPage;