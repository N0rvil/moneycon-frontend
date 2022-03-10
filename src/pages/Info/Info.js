//thirtparty 
import React from 'react';
//components
//pages
//others
//styles
import './Info.scss';

const Info = () => {

  return (
    <div className='info'>
        <div className='info__container'>
            <div className='info__box'>
                <h2 className='info__header'>1. Sign Up</h2>
                <p className='info__text'>
                    The first thing you have to do is create your account. 
                    You only need two things: your e-mail address and a strong password.
                    Please keep in mind the stronger your password is, the more secure is your account is. 
                    E-mail verification is not required. 
                </p>
            </div>
            <img src='./images/signup.PNG' alt='info-img' className='info__image' />
        </div>
        <div className='info__container'>
            <img src='./images/categories.PNG' alt='info-img' className='info__image' />
            <div className='info__box'>
                <h2 className='info__header'>2. Create categories</h2>
                <p className='info__text'>
                    In the default setting, you have just one category in income, which is salary. 
                    If you want to create records in spendings or records with different categories, 
                    you have to create them. After clicking on the button add in settings, 
                    just put the category's name and select the color. In this color, 
                    the category will show in the chart. You can easily delete them just by 
                    clicking on the small delete button.
                </p>
            </div>
        </div>
        <div className='info__container'>
            <div className='info__box'>
                <h2 className='info__header'>3. Create records</h2>
                <p className='info__text'>
                    After creating your categories, 
                    you can go to the income or spendings page and create your records: 
                    just select category and type the amount of money. 
                    You will see records from the last 30 days. 
                    You can easily edit them by clicking on a small pen icon.
                </p>
            </div>
            <img src='./images/records.PNG' alt='info-img' className='info__image' />
        </div>
        <div className='info__container'>
        <img src='./images/settings.PNG' alt='info-img' className='info__image' />
            <div className='info__box'>
                <h2 className='info__header'>4. Settings</h2>
                <p className='info__text'>
                    In Settings, you can easily change the application's 
                    currency to show you your records and balance. 
                    You have to click on the set button to set the new currency. 
                    If you need to, you can change your password by just typing your 
                    old password and then typing the new one twice, and you are good to go.
                </p>
            </div>
        </div>
    </div>
  )
}

export default Info;
