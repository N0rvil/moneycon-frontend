//thirtparty 
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
//components
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import FormInput from '../../components/FormInput/FormInput';
//pages
//others
import history from '../../history';
//styles
import './EditRecord.scss';
import '../../styles/buttons.scss';

const EditRecord = () => {
  const { state } = useLocation();
  const [id, setId] = useState(state.id);
  const [amount, setAmount] = useState(state.amount);
  const [category, setCategory] = useState(state.category);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

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

  const renderCategories = () => {
    return categories.map((category, i) => {
      return <option value={category.name} key={i}>{category.name}</option>
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Cookies.get('login')) {
      let data = {
        query: `
        mutation {
            editRecord(recordInput: {_id: "${id}", category: "${category}", amount: ${parseInt(amount)}}) {
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
          console.log(resData.data)
          if (!resData.data.data.editRecord) {
            throw new Error('Something went wrong');
        }
          history.push('/income')
          window.location.reload();
        })
        .catch(err => console.log(err));
  }

  }

  const deleteRecord = () => {
    console.log(id)
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
        url: `http://localhost:3005/graphql`,
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
          setId('x');
          history.push('/income')
          window.location.reload();
        })
        .catch(err => console.log(err));
  }
  }
  
  return (
    <div className='editrecord'>
      <form className='editrecord__form' onSubmit={(e) => handleSubmit(e)} >
      <h2 className='editrecord__header'>Edit Record</h2>
      <div className='editrecord__form-box'>
      <div className='editrecord__form-section'>
      <label className='editrecord__form-label'>Category</label>
          <select className='editrecord__form-select' name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {renderCategories()}
          </select>
      </div>
          <FormInput type='number' label='Amount' setValue={setAmount} value={amount} />
      </div>
      <div className='editrecord__box'>
        <SubmitButton text='Edit' />
        <Link className='cancelbutton' to='/income'>Cancel</Link>
      </div>
      <button className='deletebutton' onClick={() => deleteRecord()}>Delete</button>
      </form>
    </div>
  )
}

export default EditRecord;