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

const Settings = () => {

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

    const deleteCategory = (categoryId) => {
      console.log(categoryId)
      let data = {
        query: `
        mutation {
            deleteCategory(categoryId: "${categoryId}") {
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
          setCategories(resData.data.data.deleteCategory)
        })
        .catch(err => console.log(err));
    }

    const renderCategories = () => {
      return categories.map((category, i) => {
        return (
          <div className='settings__category' key={i}>
            <h3 className='settings__category-name'>{category.name}</h3>
            <button onClick={() => deleteCategory(category._id)} className='btn__small-red'>delete</button>
          </div>
        )
      })
    }
  
    return (
      <div className='settings'>
        <div className='settings__box settings__box-categories'>
          <h3 className='settings__header'>Categories</h3>
          <div className='settings__list'>{renderCategories()}</div>
          <Link to='addcategory' className='btn__small-lightorange'>Add +</Link>
        </div>
        <div className='settings__box'>
          
        </div>
        <div className='settings__box'>
          
        </div>
      </div>
    )
  }
  
  export default Settings;