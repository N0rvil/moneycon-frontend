//thirtparty 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Tooltip, ResponsiveContainer } from 'recharts';
//components
import MoneyBar from '../../components/MoneyBar/MoneyBar';
//pages
//others
import { euDate } from '../../dateFormater';
//styles
import './OverallLook.scss'

const OverallLook = ({ userData }) => {
  const [records, setRecords] = useState([]);
  const [fristRecord, setFirstRecord] = useState({});
  const [lastRecord, setLastRecord] = useState({});

  useEffect(() => {
    getLastMonthRecords();
  }, [])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="tooltip">
          <p className="tooltip__text">{ payload ? `To Balance : ${payload[0].value} ${userData.currency}` : '0'}</p>
          <p className="tooltip__text">{label}</p>
        </div>
      );
    }
    return null;
  };


  const getLastMonthRecords = () => {
    if (Cookies.get('login')) {
      let authData = {
        query: `
          query {
            getLastMonthRecords {
              toBalance
              amount
              type
              date
            }
          }
        `
      };
    
      axios({
        method: 'POST',
        url: `http://localhost:3005/graphql`,
        data: authData,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('login'),
        }
        })
        .then(resData => {
          let lastMonthRecords = [];
          resData.data.data.getLastMonthRecords.map((record, i) => {
            if (i === 0) {
              record.date = euDate(record.date)
              lastMonthRecords.push(record)
              return setFirstRecord(record)
            } else if (i+1 === resData.data.data.getLastMonthRecords.length) {
              record.date = euDate(record.date)
              lastMonthRecords.push(record)
              return setLastRecord(record)
            } else {
              record.date = euDate(record.date)
              return lastMonthRecords.push(record)
            }
          })
          setRecords(lastMonthRecords)
        })
        .catch(err => console.log(err));
    }
  }
  
  const countMoney = (type) => {
    let money = 0;
    records.map((record) => {
     
      if (record.type === type) {
        return money = money + record.amount
      } else {
        return null
      }
    })
    return money
  }

  const moneyPercentage = () => {
    let result = 0
    if (Object.keys(lastRecord).length && Object.keys(fristRecord).length > 0) {
      result = (((lastRecord.toBalance - fristRecord.toBalance) / fristRecord.toBalance) * 100).toFixed(0) + ' %';
    } 
    if (result === 'Infinity %' || result === '-Infinity %') {
      result = '-- %'
    }
    return result
  }

  console.log(Math.abs(100 - ((countMoney('income') / countMoney('spendings')) * 100)).toString() + '%')

    return (
      <div className='overalllook'>
        <section className='overalllook__balance'>
          <h3 className='overalllook__balance-header'>Your balance last 30 days</h3>
          <ResponsiveContainer width="95%" height="50%">
            <LineChart data={records}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeWidth={0} />
              <XAxis fontSize={'15'} dataKey="date" strokeWidth={3.5} stroke='#fff' />
              <YAxis fontSize={'15'} dataKey="toBalance" strokeWidth={3.5} stroke='#fff' />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Line type="linear" dataKey="toBalance" stroke="#FF7121" strokeWidth={5} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className='overalllook__balance-box'>
            <h3 style={ lastRecord.toBalance - fristRecord.toBalance > 0 ? { color: '#00FF19' } : { color: '#ff2222' } }>{ Object.keys(lastRecord).length && Object.keys(fristRecord).length > 0 ? (lastRecord.toBalance - fristRecord.toBalance) + ` ${userData.currency}` : 0}</h3>
            <h3 style={((lastRecord.toBalance - fristRecord.toBalance) / fristRecord.toBalance) * 100 > 0 ? { color: '#00FF19' } : { color: '#ff2222' } }>{moneyPercentage()}</h3> 
          </div>
        </section>
        <section className='overalllook__money'>
          <div className='overalllook__money-cashflow'>
            <MoneyBar header={'Income last 30 days'} fill={countMoney('income') > countMoney('spendings') ? '100%' : ((countMoney('income') / countMoney('spendings')) * 100).toString() + '%' } color={'#00FF19'} money={countMoney('income') + ` ${userData.currency}`}  />
            <MoneyBar header={'Spendings last 30 days'} fill={countMoney('income') < countMoney('spendings') ? '100%' : ((countMoney('spendings') / countMoney('income')) * 100).toString() + '%' } color={'#ff2222'} money={countMoney('spendings') + ` ${userData.currency}`}  />
            <MoneyBar header={'Cash flow last 30 days'} fill={ countMoney('income') < countMoney('spendings') ? Math.abs(100 - ((countMoney('income') / countMoney('spendings')) * 100)).toString() + '%' : Math.abs(100 - ((countMoney('spendings') / countMoney('income')) * 100)).toString() + '%'} color={'#3F8CFF'} money={(countMoney('income') - countMoney('spendings')) + ` ${userData.currency}`}  />
          </div>
          <div className='overalllook__money-balance'>
            <h3 className='overalllook__money-balance--header'>Balance:</h3>
            <h1 className='overalllook__money-balance--amount' style={userData.balance > 0 ? { color: '#00FF19' } : { color: '#ff2222' }}>{userData.balance + ` ${userData.currency}`}</h1>
          </div>
        </section>
      </div>
    )
  }
  
  export default OverallLook;