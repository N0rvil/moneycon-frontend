//thirtparty 
import React from 'react';
//components
//pages
//others
//styles
import './MoneyBar.scss';

const MoneyBar = ({ header, money, fill, color }) => {
  
    return (
        <div className='moneybar'>
            <h3 className='moneybar__header' style={{ color: `${color}` }} >{header}</h3>
            <div className='moneybar__box'>
                <div className='moneybar__bar'>
                    <div className='moneybar__bar-bar' style={{ background: `${color}`, width: `${fill}` }}></div>
                </div>
                <h4 className='moneybar__money' style={{ color: `${color}` }} >{money}</h4>
            </div>
        </div>
    )
  }
  
export default MoneyBar;