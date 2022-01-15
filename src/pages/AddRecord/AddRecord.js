//thirtparty 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
//components
import FormInput from '../../components/FormInput/FormInput';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
//pages
//others
import history from '../../history';
//styles
import './AddRecord.scss';
import '../../styles/buttons.scss';

const AddRecord = () => {
    const [category, setCategory] = useState('sallary');
    const [amount, setAmout] = useState(0);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
      getCategories();
    }, [])

    const getCategories = () => {
      if (Cookies.get('login')) {
          let data = {
            query: `
              query {
                getCategories {
                  _id
                  name
                }
              }
            `
          };
        
          axios({
            method: 'POST',
            url: `http://localhost:3005/graphql`,
            data: data,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Cookies.get('login'),
            }
            })
            .then(resData => {
              setCategories(resData.data.data.getCategories)
            })
            .catch(err => console.log(err));
      }
  }

    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            query: `
            mutation {
                createRecord(recordInput: {type: "income", category: "${category}", amount: ${parseInt(amount)}, date: "${new Date().toISOString()}"}) {
                    _id
                    }
                }
            `
          };

        axios({
            method: 'POST',
            url: `http://localhost:3005/graphql`,
            data: data,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Cookies.get('login'),
            }
            })
            .then(resData => {
                if (!resData.data.data.createRecord._id) {
                    throw new Error('Something went wrong');
                }
                history.push('/income');
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    const renderCategories = () => {
      return categories.map((category, i) => {
        return <option value={category.name} key={i}>{category.name}</option>
      })
    }

    return (
      <div className='addrecord'>
        <form className='addrecord__form' onSubmit={(e) => handleSubmit(e)} >
        <h2 className='addrecord__header'>Create record</h2>
        <div className='addrecord__form-box'>
        <div className='addrecord__form-section'>
        <label className='addrecord__form-label'>Category</label>
            <select className='addrecord__form-select' name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {renderCategories()}
            </select>
        </div>
            <FormInput type='number' label='Amount' setValue={setAmout} value={amount} />
        </div>
        <div className='addrecord__box'>
          <SubmitButton text='Add +' />
          <Link className='cancelbutton' to='/income'>Cancel</Link>
        </div>
        </form>
      </div>
    )
  }
  
  export default AddRecord;