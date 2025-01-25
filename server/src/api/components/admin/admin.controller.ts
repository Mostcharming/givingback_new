import { NextFunction, Request, Response } from 'express'
import xlsx from 'xlsx'
import db from '../../../config'
import { fetchDonations } from '../../../helper/getTransac'
import { hash } from '../../../middleware/general'

export const getCounts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ngoUsersCount = await db('users')
      .count('id as count')
      .where('role', 'NGO')
      .first()

    const projectCount = await db('project').count('id as count').first()

    const donationCount = await db('donations').count('id as count').first()

    res.status(200).json({
      ngoUsersCount: ngoUsersCount?.count || 0,
      projectCount: projectCount?.count || 0,
      donationCount: donationCount?.count || 0
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching counts.',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

interface UpdateUserByAdminRequest extends Request {
  params: {
    id: string
  }
  body: {
    name?: string
    phone?: string
    website?: string
    interest_area?: string
    cac?: string
    bankName?: string
    accountName?: string
    accountNumber?: string
    state?: string
    city_lga?: string
    active?: boolean
    address?: string
  }
}

export const updateUserByAdmin = async (
  req: UpdateUserByAdminRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const transaction = await db.transaction()

  try {
    const {
      name,
      phone,
      website,
      interest_area,
      cac,
      bankName,
      accountName,
      accountNumber,
      state,
      city_lga,
      active,
      address
    } = req.body

    const userDataToUpdate = {
      name,
      phone,
      website,
      interest_area,
      cac,
      bankName,
      accountName,
      accountNumber,
      state,
      city_lga,
      active,
      address
    }

    const user = await db('organizations').where({ id }).first()

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const orgUpdateData: Partial<typeof userDataToUpdate> = {}
    const addressUpdateData: Partial<typeof userDataToUpdate> = {}
    const banksUpdateData: Partial<typeof userDataToUpdate> = {}

    if (userDataToUpdate.name) orgUpdateData.name = userDataToUpdate.name
    if (userDataToUpdate.active !== undefined)
      orgUpdateData.active = userDataToUpdate.active

    if (userDataToUpdate.phone) orgUpdateData.phone = userDataToUpdate.phone
    if (userDataToUpdate.website)
      orgUpdateData.website = userDataToUpdate.website
    if (userDataToUpdate.interest_area)
      orgUpdateData.interest_area = userDataToUpdate.interest_area
    if (userDataToUpdate.cac) orgUpdateData.cac = userDataToUpdate.cac

    if (userDataToUpdate.address)
      addressUpdateData.address = userDataToUpdate.address
    if (userDataToUpdate.state) addressUpdateData.state = userDataToUpdate.state
    if (userDataToUpdate.city_lga)
      addressUpdateData.city_lga = userDataToUpdate.city_lga

    if (userDataToUpdate.bankName)
      banksUpdateData.bankName = userDataToUpdate.bankName
    if (userDataToUpdate.accountName)
      banksUpdateData.accountName = userDataToUpdate.accountName
    if (userDataToUpdate.accountNumber)
      banksUpdateData.accountNumber = userDataToUpdate.accountNumber

    if (Object.keys(orgUpdateData).length > 0) {
      await db('organizations').where({ id }).update(orgUpdateData)
    }
    if (Object.keys(addressUpdateData).length > 0) {
      await db('address')
        .where({ user_id: user.user_id })
        .update(addressUpdateData)
    }

    if (Object.keys(banksUpdateData).length > 0) {
      await db('banks').where({ user_id: user.user_id }).update(banksUpdateData)
    }

    await transaction.commit()
    res.status(200).json({ message: 'User details updated successfully' })
  } catch (error) {
    await transaction.rollback()
    console.error(error) // Log error for debugging
    res.status(500).json({ error: 'Internal server error' })
  }
}

function generateRandomPassword(length: any) {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}

const bulkUploadDonors = async (fileBuffer: Buffer) => {
  try {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rows: any[] = xlsx.utils.sheet_to_json(sheet)

    const donors: any[] = rows.filter(
      (row) =>
        row.Name &&
        row.PhoneNumber &&
        row.Email &&
        row.Interest_Area &&
        row.State &&
        row.City_LGA &&
        row.Address &&
        row.Image &&
        row.Website
    )

    await db.transaction(async (trx: any) => {
      for (const donor of donors) {
        const mail = donor.Email.trim()
        const generatedPassword = generateRandomPassword(8)
        const password = hash(generatedPassword.trim())
        const newUser = {
          email: mail,
          password,
          active: 1,
          role: 'NGO',
          status: 1,
          token: 0
        }

        const [id] = await trx('users').insert(newUser).returning('id')

        await trx('organizations').insert({
          name: donor.Name,
          phone: donor.PhoneNumber,
          website: donor.Website,
          interest_area: donor.Interest_Area,
          user_id: id
        })

        await trx('address').insert({
          city_lga: donor.City_LGA,
          state: donor.State,
          address: donor.Address,
          user_id: id
        })

        await trx('userimg').insert({
          filename: donor.Image,
          user_id: id
        })

        // const emailService = new Email(mail, '', generatedPassword)
        // await emailService.sendWelcomeNGO()
      }
    })

    return { success: true, message: 'Bulk upload successful' }
  } catch (error) {
    console.error('Error occurred during bulk upload:', error)
    return { success: false, error: `Unable to perform bulk upload: ${error}` }
  }
}

export const sample = async (req: Request, res: Response): Promise<void> => {
  try {
    const workbook = xlsx.utils.book_new()
    const sampleData = [
      [
        'Name',
        'PhoneNumber',
        'Email',
        'Interest_Area',
        'State',
        'City_LGA',
        'Address',
        'Image',
        'Website'
      ],
      [
        'John Doe',
        '1234567890',
        'johndoe@example.com',
        'Education,Art,Welfare',
        'California',
        'Los Angeles',
        '123 Main St',
        'https://mayowafadeni.vercel.app/may.jpg',
        'https://sample.com'
      ]
    ]

    const sheet = xlsx.utils.aoa_to_sheet(sampleData)
    xlsx.utils.book_append_sheet(workbook, sheet, 'Sample Donors')

    const buffer = xlsx.write(workbook, { type: 'buffer' })

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=sample_ngos_bulk.xlsx'
    )
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.send(Buffer.from(buffer))
    // res.status(200).json(output)
  } catch (error) {
    console.error('Error generating sample file:', error)
    res.status(500).json({ error: 'Unable to fetch data' })
  }
}

export const bulk = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file || !req.file.buffer) {
      res.status(400).json({ error: 'File is required' })
      return
    }

    const fileBuffer = req.file.buffer
    const result = await bulkUploadDonors(fileBuffer)

    if (result.success) {
      res.json(result)
    } else {
      res.status(500).json({ error: result.error })
    }
  } catch (error) {
    console.error('Error in bulk upload route:', error)
    res.status(500).json({ error: 'Unable to upload data' })
  }
}

export const getDonations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract filters from query parameters
    const {
      page,
      limit,
      project_id,
      ngo_id,
      donor_id,
      type,
      min_amount,
      max_amount,
      payment_gateway,
      status
    } = req.query

    // Fetch donations using the helper function
    const result = await fetchDonations({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      project_id: project_id ? parseInt(project_id as string, 10) : undefined,
      ngo_id: ngo_id ? parseInt(ngo_id as string, 10) : undefined,
      donor_id: donor_id ? parseInt(donor_id as string, 10) : undefined,
      type: type as string,
      min_amount: min_amount ? parseFloat(min_amount as string) : undefined,
      max_amount: max_amount ? parseFloat(max_amount as string) : undefined,
      payment_gateway: payment_gateway as string,
      status: status as string
    })

    // Return the result
    res.status(200).json(result)
  } catch (error) {
    console.error('Error fetching donations:', error)
    res.status(500).json({ message: 'Failed to fetch donations', error })
  }
}

export const feedBack = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { comment } = req.body

    if (!id || !comment) {
      res.status(400).json({ error: 'Project ID and comment are required' })
      return
    }

    await db('admin_feedback').insert({
      project_id: id,
      feedback: comment
    })

    res.status(201).json({ message: 'Comment Submitted' })
  } catch (error) {
    console.error('Error creating projects:', error)
    res.status(500).json({ error: 'Unable to submit comment' })
  }
}

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const transaction = await db.transaction()
  try {
    const projectId = req.params.id as string

    const { status }: { status?: string } = req.body

    if (!projectId) {
      res.status(400).json({ status: 'fail', error: 'Project ID is required.' })
      return
    }
    if (status === undefined) {
      // Check if status is explicitly provided
      res.status(400).json({ status: 'fail', error: 'Status is required.' })
      return
    }

    // Update the project in the database
    await db('previousprojects').where({ id: projectId }).update({
      status
    })

    // Uncomment and type further logic if required, e.g., sponsors or beneficiaries updates

    await transaction.commit()
    res.status(200).json({ message: 'Previous Project updated successfully' })
  } catch (error) {
    await transaction.rollback()
    console.error('Error updating project:', error)
    res.status(500).json({ error: 'Unable to update project' })
  }
}

export const addPaymentGateway = async (
  req: any,
  res: Response
): Promise<void> => {
  const { name, publicKey, category, secretKey, status } = req.body

  try {
    const [id] = await db('payment_gateways').insert({
      name,
      public_key: publicKey,
      secret_key: secretKey,
      category,
      status
    })

    res.status(201).json({
      id,
      name,
      public_key: publicKey,
      secret_key: secretKey,
      category,
      status
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to add payment gateway' })
  }
}

// Update a payment gateway
export const updatePaymentGateway = async (
  req: any,
  res: Response
): Promise<void> => {
  const { id } = req.params
  const { name, publicKey, category, secretKey, status } = req.body

  try {
    const updatedRows = await db('payment_gateways').where({ id }).update({
      name,
      public_key: publicKey,
      secret_key: secretKey,
      category,
      status
    })

    if (updatedRows === 0) {
      res.status(404).json({ error: 'Payment gateway not found' })
      return
    }

    res.status(200).json({
      id,
      name,
      public_key: publicKey,
      secret_key: secretKey,
      category,
      status
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update payment gateway' })
  }
}

// Delete a payment gateway
export const deletePaymentGateway = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params

  try {
    const deletedRows = await db('payment_gateways').where({ id }).del()

    if (deletedRows === 0) {
      res.status(404).json({ error: 'Payment gateway not found' })
      return
    }

    res.status(200).json({ message: 'Payment gateway deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete payment gateway' })
  }
}

// Get the latest rate
export const getRates = async (req: Request, res: Response): Promise<void> => {
  try {
    const latestRate = await db('rates').orderBy('updated_at', 'desc').first()
    res.json(latestRate || { rate: 0 })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch payment gateways' })
  }
}

// Add rates
export const addRates = async (req: any, res: Response): Promise<void> => {
  const { rate, mode } = req.body

  try {
    await db('rates').del()
    await db('rates').insert({ rate, mode })
    res.send('Rate saved successfully.')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to add rates' })
  }
}

export const getPaymentGateways = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const rows = await db('payment_gateways').select('*')
    res.status(200).json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch payment gateways' })
  }
}
