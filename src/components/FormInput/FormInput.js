//thirtparty 
//components
//pages
//styles
import './FormInput.scss';

const FormInput = (props) => {
  
    return (
      <div className='forminput'>
        <label className={ props.size === ' small' ? 'forminput__label forminput__label-small' : 'forminput__label forminput__label-normal' } >{props.label}</label>
        <input 
            className={ props.size === 'small' ? 'forminput__input forminput__input-small' : 'forminput__input forminput__input-normal' } 
            type={props.type} 
            placeholder={props.placeholder} 
            value={props.value} 
            onChange={e => props.setValue(e.target.value)} 
        />
      </div>
    )
  }
  
  export default FormInput;