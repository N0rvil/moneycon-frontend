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
import './EditRecordPopup.scss';

const EditRecordPopup = ({closePopup, id, removeRecord, changeRecord, type, cat, amt}) => {

    const [category, setCategory] = useState(cat);
    const [categories, setCategories] = useState([]);
    const [amount, setAmount] = useState(amt);

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
      }, [type]);

    const deleteRecord = () => {
        if (Cookies.get('login')) {
          let data = {
            query: `
            mutation {
                deleteRecord(recordId: "${id}") {
                    _id
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
              if (!resData.data.data.deleteRecord._id) {
                throw new Error('Something went wrong');
              }
              removeRecord(id);
              closePopup();
            })
            .catch(err => console.log(err));
        }
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Cookies.get('login')) {
          let data = {
            query: `
            mutation {
                editRecord(recordInput: {_id: "${id}", category: "${category}", amount: ${parseFloat(amount)}}) {
                    _id
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
                if (!resData.data.data.editRecord) {
                    throw new Error('Something went wrong');
                }
                changeRecord(id, amount, category);
                closePopup();
            })
            .catch(err => console.log(err));
        }
      }

      const renderCategories = () => {
        return categories.map((category, i) => {
          return <option value={category.name} key={i}>{category.name}</option>
        })
      }
    
    return (
        <div className='editrecordpopup' ref={popupRef}>
            <form className='editrecordpopup__form' onSubmit={(e) => handleSubmit(e)} >
                <h2 className='editrecordpopup__header'>Create record</h2>
                <div className='editrecordpopup__form-box'>
                <div className='editrecordpopup__form-section'>
                <label className='editrecordpopup__form-label'>Category</label>
                <select className='editrecordpopup__form-select' name="category" id="category" alue={category} onChange={(e) => setCategory(e.target.value)}>
                    {renderCategories()}
                </select>
                </div>
                    <FormInput type='number' label='Amount' setValue={setAmount} value={amount} />
                </div>
                <div className='editrecordpopup__box'>
                    <SubmitButton text='Edit' />
                    <button className='cancelbutton' onClick={() => closePopup()} type='button' >Cancel</button>
                </div>
                <button type='button' className='deletebutton' onClick={() => deleteRecord()}>Delete</button>
            </form>
        </div>
    ) 
}

export default EditRecordPopup;