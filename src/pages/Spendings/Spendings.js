//thirtparty 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { PieChart, Pie, Cell } from 'recharts';
//components
import Record from '../../components/Record/Record';
import Category from '../../components/Category/Category';
//pages
//others
import { euDate } from '../../dateFormater';
//styles
import './Spendings.scss';

const Spendings = ({ userData }) => {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    getRecords();
    getCategories();
  }, [])

  console.log(records)

  const getRecords = () => {
    if (Cookies.get('login')) {
      let data = {
        query: `
          query {
            getSpendingsRecords {
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
          setRecords(resData.data.data.getSpendingsRecords);
        })
        .catch(err => console.log(err));
    }
  }

  const getCategories = () => {
    if (Cookies.get('login')) {
        let data = {
          query: `
            query {
              getSpendingsCategories {
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
            const newData = resData.data.data.getSpendingsCategories.map(x => ({
              ...x,
              amount: 0,
            }))
            setCategories(newData)
          })
          .catch(err => console.log(err));
    }
}

  const renderRecords = () => {
    if (records) {
      return records.map((record, i) => {
        return <Record id={record._id} type={record.type} category={record.category} amount={record.amount} date={euDate(record.date)} key={i} currency={userData.currency} />
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
      })
    } else {
      return 
    }
  }

  const overallCount = () => {
    let count = 0
    records.map((record) => {
      return count = count + record.amount
    })
    return count
  }

  const renderCategories = () => {
    countCategories();
    let count = 0
    categories.map((category, i) => {
      if (category.amount) {
         return count = count + category.amount
      } else {
        return count = count + 0
      }
    })
    return categories.map((category, i) => {
      return <Category category={category.name} amount={category.amount} percentage={Math.round((100/(count/category.amount)) * 10) / 10} color={category.color} key={i} currency={userData.currency} />
    })
  }
  
  return (
    <div className='spendings'>
      <div className='spendings__box'>
      <section className='spendings__chart'>
        <h1 className='spendings__chart-header'>Last 30 days</h1>
        <PieChart className='income__chart-container' width={500} height={400}>
          <text x={'50%'} y={'50%'} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '30px', fontWeight: 'bold' }} fill='white'>
            {overallCount() + ` ${userData.currency}`}
          </text>
            <Pie
              fontSize={'100'}
              data={records.length === 0 ? [{amount: 1}] : categories}
              labelLine={false}
              cx={'50%'}
              cy={'50%'}
              innerRadius={120}
              outerRadius={200}
              paddingAngle={0}
              dataKey="amount"
              stroke='none'
            >
            { records.length === 0 ? [{amount: 1}].map((category, index) => (
              <Cell key={`cell-${index}`} fill={'#FFF'} isAnimationActive={false} />
            )) : categories.map((category, index) => (
              <Cell key={`cell-${index}`} fill={ category.color ? category.color : '#FF7121'} isAnimationActive={false} />
            ))}
            </Pie>
          </PieChart>
      </section>
      <section className='spendings__category'>
        {renderCategories()}
      </section>
      <section className='spendings__record'>
        {renderRecords()}
        <Link to={{ pathname: '/addrecord' }} state={{ type: 'spendings' }} className='spendings__add-button btn__small-lightorange'>Add +</Link>
      </section>
      </div>
    </div>
  )
  }
  
  export default Spendings;