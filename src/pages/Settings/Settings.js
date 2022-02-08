//thirtparty 
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'
//components
//pages
//others
//styles
import './Settings.scss'
import '../../styles/buttons.scss';

const Settings = ({ userData, setGlobalCurrency }) => {

  const [incomeCategories, setIncomeCategories] = useState([]);
  const [spendingsCategories, setSpendingsCategories] = useState([]);
  const [currency, setCurrency] = useState(userData.currency);

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
            <h3 className='settings__box-currency--header'>Měna</h3>
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