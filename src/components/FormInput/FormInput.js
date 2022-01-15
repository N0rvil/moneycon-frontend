//thirtparty 
//components
//pages
//styles
import './FormInput.scss';

const FormInput = (props) => {
  
    return (
      <div className='forminput'>
        <label className='forminput__label'>{props.label}</label>
        <input 
            className='forminput__input' 
            type={props.type} 
            placeholder={props.placeholder} 
            value={props.value} 
            onChange={e => props.setValue(e.target.value)} 
        />
      </div>
    )
  }
  
  export default FormInput;