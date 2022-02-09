//thirtparty 
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
//components
import FormInput from '../../components/FormInput/FormInput';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
//pages
//others
import history from '../../history';
import { url } from '../../url';
//styles
import './SignIn.scss';



const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()

    let signinData = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
              userId
              token
              tokenExpiration
          }
        }
      `
  };

    if (email.trim().length === 0) {
      return setError('please enter email address')
    }

    if (password.trim().length === 0) {
      return setError('please enter password')
    }

    axios({
      method: 'POST',
      url: `${url}/graphql`,
      data: signinData,
      headers: {
        'Content-Type': 'application/json'
      }
      })
      .then(resData => {
        Cookies.set("login", resData.data.data.login.token, { expires: 1/24 })
        history.push('/income')
        window.location.reload();
      })
      .catch(err => console.log(err));     
  }

    return (
      <div className='signin'>
        <form className='signin__form' onSubmit={(e) => handleSubmit(e)}>
          <h2 className='signin__header'>sign in</h2>
          <div className='signin__form-box'>
            <FormInput type='email' label='E-mail' setValue={setEmail} value={email} />
            <FormInput type='password' label='Password' setValue={setPassword} value={password} />
          </div>
          <h3 className='signin__error'>{error}</h3>
          <SubmitButton text='Sign in' />
        </form>
      </div>
    )
  }
  
  export default SignIn;