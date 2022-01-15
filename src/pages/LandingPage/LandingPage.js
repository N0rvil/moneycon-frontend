import React from 'react';
import { Link } from 'react-router-dom';

import './LandingPage.scss';

const LandingPage = () => {
  return (
    <div className='landingpage'>
      <div className='landingpage__box'>
        <div className='landingpage__frame'>
          <h1 className='landingpage__header'>Know where your money go</h1>
        </div>
        <Link className='btn__medium-orange' to='/signup'>
          Start now 
          <img src='./icons/arrow.png' className='landingpage__icon-arrow' alt='arrow-icon' />
        </Link>
      </div>
      <div className='landingpage__box'>
        <img className='landingpage__image' src='./images/landingpage__phone-image.png' alt='landing-img' />
      </div>
    </div>
  )
}

export default LandingPage;