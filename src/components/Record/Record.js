//thirtparty 
import React from 'react';
import { Link } from 'react-router-dom';
//components
//pages
//others
//styles
import './Record.scss';

const Record = ({ id, type, category, amount, date }) => {
    return (
      <div className='record'>
            <div className='record__category'>{category}</div>
            <div className={type === 'income' ? 'record__amount record__amount-income' : 'record__amount record__amount-spendings' }>
                {type === 'income' ? '+' + amount : '-' + amount }
            </div>
            <div className='record__percentage'>{date}</div>
            <Link to={{ pathname: id }} state={{ category, amount, id }}><img className='record__icon' src='/icons/pencil.png' alt='icon' /></Link>
      </div>
    )
  }
  
  export default Record;