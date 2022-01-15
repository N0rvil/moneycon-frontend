//thirtparty 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
//components
import Record from '../../components/Record/Record';
import Category from '../../components/Category/Category';
//pages
//others
import { euDate } from '../../dateFormater';
import history from '../../history';
//styles
import './Income.scss';


const Income = () => {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    history.push('/income')
    getRecords();
    getCategories();
  }, [])

  const getRecords = () => {
    if (Cookies.get('login')) {
      let data = {
        query: `
          query {
            getIncomeRecords {
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
        url: `http://localhost:3005/graphql`,
        data: data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('login'),
        }
        })
        .then(resData => {
          setRecords(resData.data.data.getIncomeRecords);
        })
        .catch(err => console.log(err));
    }
  }

  const getCategories = () => {
    if (Cookies.get('login')) {
        let data = {
          query: `
            query {
              getCategories {
                _id
                name
                color
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


  const renderRecords = () => {
    if (records) {
      return records.map((record, i) => {
        return <Record id={record._id} type={record.type} category={record.category} amount={record.amount} date={euDate(record.date)} key={i} />
      })
    } else {
      return
    }
  }

  const countCategories = () => {
    if (records) {
      const recordMatch = (rec) => {
        if (categories.some(cat => cat.name === rec.category)) {
          return categories.filter(category => {
            return [category.name === rec.category]
          })
        } else {
          return
        }
      }

      return records.map((record, i) => { 
        //if (categories.length === 0) {
        //  return setCategories([{ name: record.category, amount: record.amount }])
        //} else {
          if (recordMatch(record)) {    
            const result = records.filter(obj => {
              return obj.category === record.category
            })
            let amount = 0;
            result.map((rec) => {
              return amount = amount + rec.amount
            })
            return categories.find(v => v.name === record.category).amount = amount;
          }
          else {
            return setCategories([...categories, {name: record.category, amount: record.amount}])
          }
        //}
      })
    } else {
      return 
    }
  }

  const renderCategories = () => {
    countCategories();
    console.log(categories)
    let count = 0
    categories.map((category, i) => {
      if (category.amount) {
         return count = count + category.amount
      } else {
        return count = count + 0
      }
    })
    return categories.sort((categoryA, categoryB) => (categoryA.amount < categoryB.amount) ? 1 : -1).map((category, i) => {
      return <Category category={category.name} amount={category.amount} percentage={Math.round((100/(count/category.amount)) * 10) / 10} color={category.color} key={i} />
    })
  }
  
    return (
      <div className='income'>
        <section className='income__section'>CHART</section>
        <div className='income__category'>
          {renderCategories()}
          
        </div>
        <div className='income__record'>
          {renderRecords()}
          <Link className='income__add-button btn__small-lightorange' to='/addrecord'>Add +</Link>
        </div>
      </div>
    )
  }
  
export default Income;