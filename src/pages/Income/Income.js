//thirtparty 
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
//components
import Record from '../../components/Record/Record';
import Category from '../../components/Category/Category';
import AddRecordPopup from '../../components/AddRecordPopup/AddRecordPopup';
//pages
//others
import { euDate } from '../../dateFormater';
import { url } from '../../url';
import history from '../../history';
//styles
import './Income.scss';


const Income = ({ userData }) => {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [width, setWidth] = useState(null);
  const [isPopupActive, setIsPopupActive] = useState(false);


  useEffect(() => {
    history.push('/income')
    getRecords();
    getCategories();
    setWidth(window.innerWidth);
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
        url: `${url}/graphql`,
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
              getIncomeCategories {
                _id
                name
                color
              }
            }
          `
        };
      
        axios({
          method: 'POST',
          url: `${url}/graphql`,
          data: data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get('login'),
          }
          })
          .then(resData => {
            const newData = resData.data.data.getIncomeCategories.map(x => ({
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
        return <Record 
        changeRecord={changeRecord} 
        removeRecord={removeRecord} 
        index={i} id={record._id} 
        type={record.type} 
        category={record.category} 
        amount={record.amount} 
        date={euDate(record.date)} 
        key={i}  
        currency={userData.currency} 
        />
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
      return <Category 
      category={category.name} 
      amount={category.amount} 
      percentage={Math.round((100/(count/category.amount)) * 10) / 10} 
      color={category.color} 
      key={i} 
      currency={userData.currency} 
      />
    })
  }

  const setPopup = () => {
    setIsPopupActive(!isPopupActive)
  }

  const addRecord = (record) =>{
    setRecords([...records, record]);
  }

  const removeRecord = (id) => { 
    let newList = [];
    records.forEach((record) => {
      if (record._id !== id) {
        return newList.push(record)
      } 
    })
    return setRecords(newList);
  }

  const changeRecord = (id, amount, category) => {
    let newList = [];
    records.forEach((record) => {
      if (record._id !== id) {
        return newList.push(record)
      } else {
        const rec = record
        rec['amount'] = parseFloat(amount);
        rec['category'] = category;
        console.log(rec)
        return newList.push(rec);
      }
    })
    return setRecords(newList);
  }
  console.log(records)

    return (
      <div className='income'>
        {isPopupActive ? <AddRecordPopup closePopup={setPopup} addRecord={addRecord} type='income' /> : null}
        <div className='income__box'>
        <section className='income__chart'>
          <h1 className='income__chart-header'>Last 30 days</h1>
          <ResponsiveContainer width={'90%'} height={'60%'}>
          <PieChart className='income__chart-container'>
          <text x={'50%'} y={'50%'} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '30px', fontWeight: 'bold' }} fill='white'>
            {overallCount() + ` ${userData.currency}`}
          </text>
            <Pie
              fontSize={'100'}
              data={records.length === 0 ? [{amount: 1}] : categories}
              labelLine={false}
              // label={renderCustomizedLabel}
              cx={'50%'}
              cy={'50%'}
              innerRadius={width < 1800 ? width < 1500 ? 70 : 90 : 120}
              outerRadius={width < 1800 ? width < 1500 ? 130 : 160 : 200}
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
          </ResponsiveContainer>
        </section>
        <section className='income__category'>
          {renderCategories()}
        </section>
        <section className='income__record'>
          {renderRecords()}
          <button onClick={() => setPopup(!isPopupActive)} className='income__add-button btn__small-lightorange'>Add +</button>
        </section>
        </div>
      </div>
    )
  }
  
export default Income;