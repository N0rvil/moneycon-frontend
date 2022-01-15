//thirtparty 
import React from 'react';
//components
//pages
//others
//styles
import './Category.scss';

const Category = ({ category, amount, percentage, color }) => {
    return (
        <div className='category'>
            <div className='category__section category__section-category' style={ color ? {background: `${color}`} : {background: `#FF7121`} }>{category}</div>
            <div className='category__section category__section-amount'>{amount ? amount : 0}</div>
            <div className='category__section category__section-percentage'>{percentage ? percentage : 0} %</div>
        </div>
    )
  }
  
  export default Category;