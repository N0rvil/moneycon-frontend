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
                <h2 className='info__header'>1. Sing Up</h2>
                <p className='info__text'>
                    First thing you have to do is create your own account. You only need two things.
                    Your e-mail address and some strong password. Please keep in mind the stronger your password is 
                    the more secure is your account is. E-mail verification is not required. 
                </p>
            </div>
            <img src='./images/signup.png' alt='image' className='info__image' />
        </div>
        <div className='info__container'>
            <img src='./images/categories.png' alt='image' className='info__image' />
            <div className='info__box'>
                <h2 className='info__header'>2. Create categories</h2>
                <p className='info__text'>
                    In default setting you have just one category in income which is sallary.
                    If you want to create records in spendings or records with different names of 
                    categories you have to create them. After clic on button add in settings just put the name of the 
                    category and select the color. In this color the category will show in chart. You can easily delete 
                    them just by clicking on small delete button.
                </p>
            </div>
        </div>
        <div className='info__container'>
            <div className='info__box'>
                <h2 className='info__header'>3. Create records</h2>
                <p className='info__text'>
                    After you create your categories you can go to the income or spendings page and 
                    finally create your records. Just select category and type amount of money. You will 
                    see records from last 30 days. You can easily edit them by clicking on a small pen icon.
                </p>
            </div>
            <img src='./images/records.png' alt='image' className='info__image' />
        </div>
        <div className='info__container'>
        <img src='./images/settings.png' alt='image' className='info__image' />
            <div className='info__box'>
                <h2 className='info__header'>4. Settings</h2>
                <p className='info__text'>
                    In Settings you can easily change currency in wich you want application show your 
                    records and balance. You have to click on set button if you want to set new currency.
                    If you will need you can change your password by just type your old 
                    password and two times your new and you are good to go.
                </p>
            </div>
        </div>
    </div>
  )
}

export default Info;
