//thirtparty 
import React, { useState } from 'react';
//components
import EditRecordPopup from '../../components/EditRecordPopup/EditRecordPopup';
//pages
//others
//styles
import './Record.scss';

const Record = ({ id, type, category, amount, date,currency, removeRecord, changeRecord }) => {

  const [isPopupActive, setIsPopupActive] = useState(false);

  const setPopup = () => {
    setIsPopupActive(!isPopupActive);
  }

    return (
      <div className='record'>
        {isPopupActive ? <EditRecordPopup closePopup={setPopup} type={type} cat={category} amt={amount} id={id} removeRecord={removeRecord} changeRecord={changeRecord}  /> : null}
          <div className='record__category'>{category}</div>
          <div className={type === 'income' ? 'record__amount record__amount-income' : 'record__amount record__amount-spendings' }>
            {type === 'income' ? '+' + amount + ` ${currency}` : '-' + amount + ` ${currency}`}
          </div>
          <div className='record__date'>{date}</div>
          <button type='button' onClick={() => setPopup()} to={{ pathname: id }} state={{ category, amount, id, type }} className='record__button'><img className='record__icon' src='/icons/pencil.png' alt='icon' /></button>
      </div>
    )
  }
  
export default Record;


