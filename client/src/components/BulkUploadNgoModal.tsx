import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { toast } from 'react-toastify'
import upload from '../assets/images/upload.svg'
import useBackendService from '../services/backend_service'
import FileUplaod from './file_upload'
import Loading from './home/loading'

interface BulkUploadNgoModalProps {
  open: boolean
  handleClose: () => void
}

export default function BulkUploadNgoModal({
  open,
  handleClose
}: BulkUploadNgoModalProps) {
  const [file, setFile] = useState<File | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const closeModal = () => {
    handleClose()
  }

  const onSelected = (file: File) => setFile(file)

  const { mutate: downloadSampl } = useBackendService('/admin/bulk', 'GET', {
    onSuccess: (res2: any) => {
      const blob = new Blob([res2], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'ngo_upload_sample.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    onError: (error: any) => {
      toast.error(error.message)
    }
  })

  const { mutate: uploadNGO } = useBackendService('/admin/bulk', 'POST', {
    onSuccess: (res2: any) => {
      setIsLoading(false)
      toast.success('NGOs uploaded successfully')
    },
    onError: (error: any) => {
      setIsLoading(false)
      toast.error(error.message)
    }
  })

  const downloadSample = async () => {
    downloadSampl({})
  }

  const handleBulkUpload = async () => {
    const formData = new FormData()
    formData.append('bulk', file)
    if (!file) {
      toast.error('Please select a file to upload')
      return
    }

    const extension = file.name.split('.').pop()
    if (extension !== 'xlsx') {
      toast.error('Please upload an excel file')
      return
    }

    setIsLoading(true)
    uploadNGO(formData)

    closeModal()
  }

  return (
    <>
      {isLoading && <Loading type={'inline'} />}
      <Dialog
        open={open}
        onClose={closeModal}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: 'rgba(123, 128, 221, 0.71)'
            }
          }
        }}
      >
        <Container className='px-4 pt-3 comment-modal-body'>
          <div className='row comment-modal-title mb-3'>
            <div className='col-6'>
              <DialogTitle className='ps-0'>Upload NGO</DialogTitle>
            </div>
            <div className='col-6'>
              <a
                className='btn-link mt-4 float-end cursor-pointer'
                onClick={downloadSample}
              >
                Download CSV Structure
              </a>
            </div>
          </div>
          <FileUplaod
            file={file}
            width='350px'
            height='150px'
            onFile={onSelected}
            backgroundColor='white'
          >
            <img src={upload} alt='upload icon' width='25px' />
            <label
              className='text-center mb-2 mx-1'
              style={{ fontSize: '13px' }}
            >
              Upload File
            </label>
          </FileUplaod>
        </Container>
        <DialogActions className='px-4 justify-content-center pt-0 mt-4'>
          <button
            className='btn-modal px-4'
            style={{}}
            onClick={handleBulkUpload}
          >
            Upload
          </button>
        </DialogActions>
      </Dialog>
    </>
  )
}
