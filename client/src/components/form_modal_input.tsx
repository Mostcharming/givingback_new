import { FormGroup, Input, Label } from 'reactstrap'

const FormModalInput = ({
  label,
  type,
  initialValue,
  onChange,
  rows = 1,
  disabled = false
}) => {
  return (
    <FormGroup
      className='mb-1'
      style={{
        borderColor: '#7B80DD',
        borderWidth: '1px',
        borderStyle: 'solid',
        padding: '10px',
        borderRadius: '4px'
      }}
    >
      <Label className='form-modal-label'>{label}</Label>
      {type === 'textarea' ? (
        <Input
          as='textarea'
          rows={rows}
          defaultValue={initialValue}
          style={{
            boxShadow: 'none',
            border: 'none',
            padding: '8px 12px',
            width: '100%'
          }}
          onChange={onChange}
          disabled={disabled}
        />
      ) : (
        <Input
          type={type}
          defaultValue={initialValue}
          style={{
            boxShadow: 'none',
            border: 'none',
            padding: '8px 12px',
            width: '100%'
          }}
          onChange={onChange}
          disabled={disabled}
        />
      )}
    </FormGroup>
  )
}

export default FormModalInput
