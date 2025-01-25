import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { UpdateNGOIcon } from '../assets/images/svgs'
import useBackendService from '../services/backend_service'
import FormModalInput from './form_modal_input'

export default function UpdateNGO({ open, handleClose, id }) {
  const [ngoData, setNgoData] = useState<any>(null)
  const [updatedNgoData, setUpdatedNgoData] = useState<any>()

  const { mutate: updateUser } = useBackendService(
    `/admin/users/${id}`,
    'POST',
    {
      onSuccess: (res2: any) => {
        toast.success('NGO details updated successfully')
        handleClose()
      },
      onError: (error: any) => {
        toast.error(error.message)
      }
    }
  )

  const { mutate: getUSer } = useBackendService('/donor/users', 'GET', {
    onSuccess: (res2: any) => {
      setNgoData(res2.users[0])
    },
    onError: () => {}
  })

  useEffect(() => {
    getUSer({ organization_id: id })
  }, [id])

  const onInputChange = (value: string, name: string) => {
    setUpdatedNgoData({
      ...updatedNgoData,
      [name]: value
    })
  }

  const closeModal = () => {
    setNgoData(null)
    handleClose()
  }

  const onSubmit = async () => {
    updateUser(updatedNgoData)
  }

  return (
    <>
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
        <div className='d-flex justify-content-center mt-3'>
          <UpdateNGOIcon />
        </div>
        <div className='d-flex justify-content-center'>
          <DialogTitle>Update NGO's Details</DialogTitle>
        </div>
        <DialogContent
          style={{
            width: '449px',
            paddingBottom: '0px'
          }}
        >
          <FormModalInput
            label='Name of Organization'
            type='text'
            initialValue={ngoData?.name}
            onChange={(e) => onInputChange(e.target.value, 'name')}
          />
          <FormModalInput
            label='Category'
            type='text'
            initialValue={ngoData?.interest_area}
            onChange={(e) => onInputChange(e.target.value, 'interest_area')}
          />
          <FormModalInput
            label='Address'
            type='text'
            initialValue={ngoData?.address[0].address}
            onChange={(e) => onInputChange(e.target.value, 'address')}
          />
          <FormModalInput
            label='State'
            type='text'
            initialValue={ngoData?.address[0].state}
            onChange={(e) => onInputChange(e.target.value, 'state')}
          />
          <FormModalInput
            label='Phone Number'
            type='text'
            initialValue={ngoData?.phone}
            onChange={(e) => onInputChange(e.target.value, 'phone')}
          />
        </DialogContent>
        <DialogActions
          style={{
            padding: '10px'
          }}
        >
          <button className='btn-modal' onClick={onSubmit}>
            Update Details
          </button>
        </DialogActions>
      </Dialog>
    </>
  )
}
