import React from 'react';
import Cookies from 'js-cookie';

import { Link } from 'react-router-dom'

import './Header.scss';

import history from '../../history';

const LandingPage = (props) => {

  const logout = () => {
    Cookies.remove('login');
    history.push('/');
    window.location.reload();
  }


  return (
    <div className='header'>
      {props.auth ? 
        <h2 className='header__balance'>
          {props.userData.balance} Kč
        </h2> 
      : 
        <Link className='header__home' to="/">
          <img src='/icons/home.png' className='header__home-icon' alt='home-icon' />
        </Link>
      }
      {props.auth ? 
        <nav>
          <Link className='btn__long-white header__logout' to="/" onClick={() => logout()}>
            <h3>Logout</h3>
            <img src='/icons/logout.png' className='header__logout-icon' alt='home-icon' />
          </Link>
        </nav> 
      :
        <nav className='header__nav'>
          <Link className='btn__small-lightorange' to="/signin">Sing in</Link>
          <Link className='btn__small-white' to='signup'>Sing up</Link>
        </nav>
      }
    </div>
  )
}

export default LandingPage;