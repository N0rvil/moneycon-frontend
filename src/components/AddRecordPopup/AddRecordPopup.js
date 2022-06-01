//thirtparty 
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
//components
import FormInput from '../FormInput/FormInput';
import SubmitButton from '../SubmitButton/SubmitButton';
//pages
//others
import { url } from '../../url';
//styles
import './AddRecordPopup.scss';

const AddRecordPopup = ({closePopup, type, addRecord}) => {
    const [category, setCategory] = useState('');
    const [amount, setAmout] = useState(0);
    const [categories, setCategories] = useState([]);


    let popupRef = useRef();
    useEffect(() => {
        let handler = (event) =>{
            if (!popupRef.current.contains(event.target)) {
                closePopup();
            };
        };

        document.addEventListener('mousedown', handler);

       
        return () => {
            document.removeEventListener('mousedown', handler);
        }
    })

    useEffect(() => {
        const getCategories = () => {
          if (Cookies.get('login')) {
            let data
            if (type === 'income') {
              data = {
                query: `
                  query {
                    getIncomeCategories {
                      _id
                      name
                    }
                  }
                `
              };
            } else {
              data = {
                query: `
                  query {
                    getSpendingsCategories {
                      _id
                      name
                    }
                  }
                `
              };
            }
              
            
              axios({
                method: 'POST',
                url: `${url}/graphql`,
                data: data,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + Cookies.get('login'),
                }
                })
                .then(resData => {
                  setCategory(type === 'income' ? resData.data.data.getIncomeCategories[0].name : resData.data.data.getSpendingsCategories[0].name)
                  setCategories(type === 'income' ? resData.data.data.getIncomeCategories : resData.data.data.getSpendingsCategories)
                })
                .catch(err => console.log(err));
          }
      }
        getCategories();
      }, [type])

      const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            query: `
            mutation {
                createRecord(recordInput: {type: "${type}", category: "${category}", amount: ${parseFloat(amount)}, date: "${new Date().toISOString()}"}) {
                    _id
                    type
                    category
                    amount
                    date
                    }
                }
            `
          };

        axios({
            method: 'POST',
            url: `${url}/graphql`,
            data: data,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Cookies.get('login'),
            }
            })
            .then(resData => {
                addRecord(resData.data.data.createRecord);
                closePopup();
            })
            .catch(err => console.log(err));
    }

    

    const renderCategories = () => {
        return categories.map((category, i) => {
          return <option value={category.name} key={i}>{category.name}</option>
        })
      }

  return (
    <div className='addrecordpopup' ref={popupRef}>
        <form className='addrecordpopup__form' onSubmit={(e) => handleSubmit(e)} >
        <h2 className='addrecordpopup__header'>Create record</h2>
        <div className='addrecordpopup__form-box'>
        <div className='addrecordpopup__form-section'>
        <label className='addrecordpopup__form-label'>Category</label>
        <select className='addrecordpopup__form-select' name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {renderCategories()}
            </select>
        </div>
            <FormInput type='number' label='Amount' setValue={setAmout} value={amount} />
        </div>
        <div className='addrecordpopup__box'>
          <SubmitButton text='Add +' />
          <button className='cancelbutton' onClick={() => closePopup()} type='button' >Cancel</button>
        </div>
        </form>
    </div>
  )
}

export default AddRecordPopup;