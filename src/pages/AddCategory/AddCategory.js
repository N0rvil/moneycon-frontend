//thirtparty 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
//components
import FormInput from '../../components/FormInput/FormInput';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
//pages
//others
import history from '../../history';
//styles
import './AddCategory.scss';
import '../../styles/buttons.scss';

const AddCategory = () => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('');
    const [err, setErr] = useState('');
    
    

    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            query: `
            mutation {
                createCategory(categoryInput: {name: "${name}", color: "${color}"}) {
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
                if (resData.data.errors) {
                    setErr('category already exist')
                    setTimeout(() => {
                        setErr('');
                    }, 5000)
                }
                if (!resData.data.data.createCategory._id) {
                    throw new Error('Something went wrong');
                }
                history.push('/settings');
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    return (
    <div className='addcategory'>
        <form className='addcategory__form' onSubmit={e => handleSubmit(e)} >
            <h2 className='addcategory__header'>Create category</h2>
            <div>
                <FormInput type='text' label='Name' setValue={setName} value={name} />
                <div className='addcategory__container'>
                    <label className='addcategory__label'>Color</label>
                    <input className='addcategory__color' type='color' onChange={e => setColor(e.target.value)} value={color} />
                </div>
                <h3 className='addcategory__err'>{err}</h3>
            </div>
            <div className='addcategory__box'>
                <SubmitButton text='Add +' />
                <Link className='cancelbutton' to='/income'>Cancel</Link>
            </div>
        </form>
      </div>
    )
  }
  
  export default AddCategory;