//thirtparty 
//components
//pages
//styles
import './SubmitButton.scss';

const FormButton = (props) => {
  
    return (
      <button className='submitbutton' type='submit'>{props.text}</button>
    )
  }
  
  export default FormButton;