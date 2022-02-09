//thirtparty 
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie' 
//components
import FormInput from '../../components/FormInput/FormInput';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
//pages
//others 
import history from '../../history';
import { url } from '../../url';
//styles
import './SignUp.scss';
//others 

const SingUp = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault()

    let signupData = {
      query: `
          mutation {
              createUser(userInput: {email: "${email}", password: "${password}"}) {
                  _id
                  email
              }
          }
      `
    };

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

    if (password !== passwordAgain) {
      return setError('passwords does not match')
    }

      axios({
        method: 'POST',
        url: `${url}/graphql`,
        data: signupData,
        })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
          }
          if (!res.data.errors) {
            setError('')
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
          } else {
            setError('user with this email addres already exist');
            return
          }
      })
      .catch(err => console.log(err));
  }
  
    return (
      <div className='signup'>
        <form className='signup__form' onSubmit={(e) => handleSubmit(e)}>
          <h2 className='signup__header'>sign up</h2>
          <div className='signup__form-box'>
            <FormInput type='email' label='E-mail' setValue={setEmail} value={email} />
            <FormInput type='password' label='Password' setValue={setPassword} value={password} />
            <FormInput type='password' label='Password again' setValue={setPasswordAgain} value={passwordAgain} />
          </div>
          <h3 className='signup__error'>{error}</h3>
          <SubmitButton text='Sign up' />
        </form>
      </div>
    )
  }
  
  export default SingUp;