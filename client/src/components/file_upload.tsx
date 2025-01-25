import { useState } from 'react'
import { FormGroup } from 'reactstrap'
import Util from '../services/utils'

const FileUplaod = (props: {
  file?: File
  className?: string
  width: string | number
  height: number | string
  onFile?: (file: File) => void
  backgroundColor?: string
  children: JSX.Element[]
}) => {
  const [file, setFile] = useState<File | undefined>(props.file)

  async function takePicture() {
    let file = await Util.selectFile('*', false)
    setFile(file)
    if (file && props.onFile) {
      props.onFile(file)
    }
  }

  return (
    <label
      className={props.className}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <FormGroup
        className='text-center'
        style={{
          position: 'relative',
          display: 'inline-block',
          width: props.width,
          height: props.height,
          cursor: 'pointer'
        }}
      >
        <div
          className='text-center py-3 px-2'
          onClick={takePicture}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: props.width,
            height: props.height,
            border: 'dashed 2px grey',
            borderRadius: '6px',
            backgroundColor: '#F0F1FB'
          }}
        >
          <div>
            {props.children.map((element) => {
              return element
            })}
          </div>
        </div>
      </FormGroup>
      <span className='ms-2'>{file && file.name}</span>
    </label>
  )
}

export default FileUplaod
