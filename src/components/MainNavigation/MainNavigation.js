//thirtparty 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//components
//pages
//others 
//styles
import './MainNavigation.scss';

const MainNavigation = () => {
    const [page, setPage] = useState('income');
    const url = window.location.href.slice(22)

    useEffect(() => {
      setPage(url)
    }, [url])
    
    return (
      <div className='mainnavigation'>
        <Link className={ page === 'income' ? 'mainnavigation__link mainnavigation__link-active' : 'mainnavigation__link' } to="/income" onClick={() => setPage('income')}>
            <h3 className='mainnavigation__text'>Income</h3>
            <div className='mainnavigation__box'>
                <img className='mainnavigation__icon' src='/icons/income.png' alt='icon' />
                <div className='mainnavigation__line'></div>
            </div>
        </Link>
        <Link className={ page === 'spendings' ? 'mainnavigation__link mainnavigation__link-active' : 'mainnavigation__link' } to="/spendings" onClick={() => setPage('spendings')}>
            <h3 className='mainnavigation__text'>Spendings</h3>
            <div className='mainnavigation__box'>
                <img className='mainnavigation__icon' src='/icons/spendings.png' alt='icon' />
                <div className='mainnavigation__line'></div>
            </div>
        </Link>
        <Link className={ page === 'overalllook' ? 'mainnavigation__link mainnavigation__link-active' : 'mainnavigation__link' } to="/overalllook" onClick={() => setPage('overalllook')}>
          <h3 className='mainnavigation__text'>Overall look</h3>
            <div className='mainnavigation__box'>
                <img className='mainnavigation__icon' src='/icons/chart.png' alt='icon' />
                <div className='mainnavigation__line'></div>
            </div>
        </Link>
        <Link className={ page === 'settings' ? 'mainnavigation__link mainnavigation__link-active' : 'mainnavigation__link' } to="/settings" onClick={() => setPage('settings')}>
          <h3 className='mainnavigation__text'>Settings</h3>
            <div className='mainnavigation__box'>
                <img className='mainnavigation__icon' src='/icons/settings.png' alt='icon' />
                <div className='mainnavigation__line'></div>
            </div>
        </Link>
      </div>
    )
  }
  
  export default MainNavigation;