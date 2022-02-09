//thirtparty 
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'
//components
import FormInput from '../../components/FormInput/FormInput';
//pages
//others
//styles
import './Settings.scss'
import '../../styles/buttons.scss';

const Settings = ({ userData, setGlobalCurrency }) => {

  const [incomeCategories, setIncomeCategories] = useState([]);
  const [spendingsCategories, setSpendingsCategories] = useState([]);
  const [currency, setCurrency] = useState(userData.currency);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');
  const [message, setMessage] = useState('');

    useEffect(() => {
      getSpendingsCategories();
      getIncomeCategories();
    }, [])


    const getIncomeCategories = () => {
        if (Cookies.get('login')) {
            let data = {
              query: `
                query {
                  getIncomeCategories {
                    _id
                    name
                    type
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
                setIncomeCategories(resData.data.data.getIncomeCategories)
              })
              .catch(err => console.log(err));
        }
    }

    const getSpendingsCategories = () => {
      if (Cookies.get('login')) {
          let data = {
            query: `
              query {
                getSpendingsCategories {
                  _id
                  name
                  type
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
              setSpendingsCategories(resData.data.data.getSpendingsCategories)
            })
            .catch(err => console.log(err));
      }
  }

  const deleteCategory = (categoryId, type) => {
    if (Cookies.get('login')) {
      let data = {
        query: `
        mutation {
            deleteCategory(deleteCategoryInput: {id: "${categoryId}", type: "${type}"}) {
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
            if (!resData.data.data.deleteCategory) {
                throw new Error('Something went wrong');
            }
            if (type === 'income') {
              setIncomeCategories(resData.data.data.deleteCategory)
            } else {
              setSpendingsCategories(resData.data.data.deleteCategory)
            }
        })
        .catch(err => console.log(err));
      }
    }

  const changeCurrency = (e) => {
    e.preventDefault();
    if (Cookies.get('login')) {
      let data = {
        query: `
        mutation {
            changeCurrency(changeCurrencyInput: {currency: "${currency}"}) {
                _id
                currency
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
           setCurrency(resData.data.data.changeCurrency.currency);
           setGlobalCurrency(resData.data.data.changeCurrency.currency);
        })
        .catch(err => console.log(err));
      }
    }

    const setMesageInterval = (text) => {
      setMessage(text)
      setTimeout(() => {
        setMessage('');
      }, 5000)
    }

    const changePassword = (e) => {
      e.preventDefault();
      if (Cookies.get('login')) {
        console.log(newPassword.length)
        if (newPassword.length !== 0) {
          if (newPassword === newPasswordAgain) {
            let data = {
              query: `
              mutation {
                  changePassword(changePasswordInput: {oldPassword: "${oldPassword}", newPassword: "${newPassword}"}) {
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
                console.log(resData.data.data)
                if (resData.data.data.changePassword) {
                  setOldPassword('')
                  setNewPassword('')
                  setNewPasswordAgain('')
                  setMesageInterval('password changed')
                } else {
                  setMesageInterval('wrong password')
                }
                
              })
              .catch(err => console.log(err));
          } else {
            setMesageInterval('new password does not match')
          }
        } else {
          setMesageInterval('please enter new password')
        }
      }
    }

    const renderIncomeCategories = () => {
      return incomeCategories.map((category, i) => {
        return (
          <div className='settings__category' key={i}>
            <h3 className='settings__category-name'>{category.name}</h3>
            <button onClick={() => deleteCategory(category._id, 'income')} className='btn__small-red'>delete</button>
          </div>
        )
      })
    }

    const renderSpendingsCategories = () => {
      return spendingsCategories.map((category, i) => {
        return (
          <div className='settings__category' key={i}>
            <h3 className='settings__category-name'>{category.name}</h3>
            <button onClick={() => deleteCategory(category._id, 'spendings')} className='btn__small-red'>delete</button>
          </div>
        )
      })
    }
  
    return (
      <div className='settings'>
        <div className='settings__box'>
          <form className='settings__box-currency' onSubmit={e => changeCurrency(e)}>
            <h3 className='settings__box-currency--header'>Currency</h3>
            <div className='settings__box-currency--box'>
              <select className='settings__box-currency--select' name="category" id="category" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value='$'>USD $</option>
                <option value='€'>EUR €</option>
                <option value='Kč'>CZK Kč</option>
                <option value='₽'>RUB ₽</option>
              </select>
              <button type='submit' className='setbutton'>set</button>
            </div>
          </form>
          <form className='settings__box-password' onSubmit={e => changePassword(e)}>
            <h3 className='settings__box-password--header'>Change password</h3>
            <FormInput type='password' placeholder='Old password' size='small' setValue={setOldPassword} value={oldPassword} />
            <FormInput type='password' placeholder='New password' size='small' setValue={setNewPassword} value={newPassword} />
            <FormInput type='password' placeholder='New password again' size='small' setValue={setNewPasswordAgain} value={newPasswordAgain} />
            <button type='submit' className='settings__box-password--button'>Change password</button>
            <h3 className='settings__box-password--message'>{message}</h3>
          </form>
        </div>
        <div className='settings__box settings__box-categories'>
          <h3 className='settings__header'>Income categories</h3>
          <div className='settings__list'>{renderIncomeCategories()}</div>
          <Link to={{ pathname: 'addcategory' }} state={{ type: 'income' }} className='btn__small-lightorange'>Add +</Link>
        </div>
        <div className='settings__box settings__box-categories'>
          <h3 className='settings__header'>Spendings categories</h3>
          <div className='settings__list'>{renderSpendingsCategories()}</div>
          <Link to={{ pathname: 'addcategory' }} state={{ type: 'spendings' }} className='btn__small-lightorange'>Add +</Link>
        </div>
      </div>
    )
  }
  
  export default Settings;