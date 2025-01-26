import { NextFunction, Response } from 'express'
import db from '../../../config'
import { User } from '../../../interfaces'
import Email from '../../../utils/mail'

export const create = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user_id = (req.user as User)?.id

    const { name, phone, website, interest_area, cac } = req.body

    const missingFields: string[] = []
    if (!name) missingFields.push('name')
    if (!phone) missingFields.push('phone')
    // if (!website) missingFields.push('website');
    if (!interest_area) missingFields.push('interest_area')
    if (!cac) missingFields.push('cac')

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'fail',
        error: `Missing required field(s): ${missingFields.join(', ')}`
      })
    }

    const newOrg = {
      name,
      phone,
      website,
      interest_area,
      cac,
      user_id
    }

    const [id] = await db('organizations').insert(newOrg).returning('id')
    const org = await db('organizations').where({ id }).first()
    const banksDetails = await db('banks')
      .select('bankName', 'accountNumber', 'accountName')
      .where('user_id', user_id)
      .first()

    const addressDetails = await db('address')
      .select('state', 'city_lga', 'address')
      .where('user_id', user_id)
      .first()

    const response = {
      Details: org,
      Bank: {
        bank_name: banksDetails?.bankName,
        account_number: banksDetails?.accountNumber,
        account_name: banksDetails?.accountName
      },
      Address: {
        city: addressDetails?.city_lga,
        state: addressDetails?.state,
        address: addressDetails?.address
      }
    }

    //email
    const userData = await db('users').where('id', user_id).first()
    if (!userData) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found.'
      })
    }
    const email = userData.email

    const token = 0
    const url = name
    const additionalData = { role: 'NGO' }
    await new Email({ email: email, url, token, additionalData }).sendEmail(
      'donoronboard',
      'Welcome to the GivingBack Family!'
    )
    await new Email({
      email: 'info@givingbackng.org',
      url,
      token,
      additionalData
    }).sendEmail('adminonb', 'New User')
    res.status(200).json(response)
  } catch (error) {
    console.error('Error in create organization:', error)
    res.status(500).json({
      status: 'fail',
      message: 'An error occurred while creating the organization.'
    })
  }
}

interface Sponsor {
  name?: string
  sponsorDescription?: string
}

interface Beneficiary {
  name?: string
  contact?: string
  location?: string
}

export const createp = async (req: any, res: Response) => {
  const transaction = await db.transaction()

  try {
    const {
      title,
      category,
      duration,
      description,
      cost,
      raised,
      sponsors,
      beneficiaries
    } = req.body

    const missingFields: string[] = []

    const userData = await db('organizations')
      .where('user_id', req.user.id)
      .first()
    if (!userData) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found.'
      })
    }

    if (!title) missingFields.push('title')
    if (!category) missingFields.push('category')
    if (!duration) missingFields.push('duration')
    if (!description) missingFields.push('description')
    if (!cost) missingFields.push('cost')
    if (!sponsors) missingFields.push('sponsors')
    if (!beneficiaries) missingFields.push('beneficiaries')

    if (sponsors && !Array.isArray(sponsors)) {
      return res.status(400).json({
        status: 'fail',
        error: 'Sponsors must be an array'
      })
    }

    if (beneficiaries && !Array.isArray(beneficiaries)) {
      return res.status(400).json({
        status: 'fail',
        error: 'Beneficiaries must be an array'
      })
    }

    if (sponsors && sponsors.length > 0) {
      sponsors.forEach((sponsor: Sponsor, index: number) => {
        const sponsorImage = req.files.find(
          (file: any) => file.fieldname === `sponsors[${index}][image]`
        )
        if (!sponsorImage) {
          missingFields.push(`sponsors[${index}][image]`)
        }
      })
    }

    const mainImage = req.files.find((file: any) => file.fieldname === 'image')
    if (!mainImage) {
      missingFields.push('image')
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'fail',
        error: `Missing required field(s): ${missingFields.join(', ')}`
      })
    }

    const [projectId] = await db('previousprojects')
      .insert({
        title,
        category,
        duration,
        status: 'unverified',
        description,
        cost,
        raised,
        organization_id: userData.id
      })
      .returning('id')

    if (sponsors && sponsors.length > 0) {
      await Promise.all(
        sponsors.map(async (sponsor: Sponsor, index: number) => {
          const { name, sponsorDescription } = sponsor
          const sponsorImage = req.files.find(
            (file: any) => file.fieldname === `sponsors[${index}][image]`
          )

          const sponsorData = {
            project_id: projectId,
            name: name || '',
            image: sponsorImage ? sponsorImage.location : '',
            description: sponsorDescription || ''
          }

          await db('previousprojects_sponsors').insert(sponsorData)
        })
      )
    }

    if (beneficiaries && beneficiaries.length > 0) {
      await Promise.all(
        beneficiaries.map(async (beneficiary: Beneficiary) => {
          const { name, contact, location } = beneficiary

          const beneficiaryData = {
            project_id: projectId,
            name: name || '',
            contact: contact || '',
            location: location || ''
          }

          await db('previousprojects_beneficiaries').insert(beneficiaryData)
        })
      )
    }

    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(async (file: any) => {
          if (file.fieldname === 'image') {
            const filename = file.location
            await db('previousprojects_images').insert({
              image: filename,
              project_id: projectId
            })
          }
        })
      )
    }

    await transaction.commit()

    const token = 0
    const url = ''
    const additionalData = {
      ngoName: userData.name,
      projectTitle: title,
      projectDescription: description
    }

    await new Email({
      // email: 'mostcharming920@yahoo.com',

      email: 'info@givingbackng.org',
      url,
      token,
      additionalData
    }).sendEmail('pastpadmin', 'New Past Project')
    res.status(201).json({ message: 'Previous Project created successfully' })
  } catch (error) {
    await transaction.rollback()

    console.error('Error creating project:', error)
    res.status(500).json({ error: 'Unable to create project' })
  }
}

export const addMilestoneUpdate = async (req: any, res: Response) => {
  try {
    const { achievement, position, status, narration, milestone_id } = req.body
    let filename: string | null = null

    const missingFields: string[] = []
    if (!achievement) missingFields.push('achievement')
    if (!status) missingFields.push('status')
    if (!narration) missingFields.push('narration')
    if (!milestone_id) missingFields.push('milestone_id')

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      if ((req.files[0] as any).fieldname === 'image') {
        filename = (req.files[0] as any).location
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'fail',
        error: `Missing required field(s): ${missingFields.join(', ')}`
      })
    }

    const [newMilestoneUpdateId] = await db('milestone_update').insert({
      achievement,
      position,
      status,
      narration,
      image: filename,
      milestone_id
    })

    const newMilestoneUpdate = await db('milestone_update')
      .where({ id: newMilestoneUpdateId })
      .first()

    res.status(201).json({ newMilestoneUpdate })
  } catch (error) {
    console.error('Error adding milestone update:', error)
    res.status(500).json({ error: 'Unable to add milestone update' })
  }
}

export const withdraw = async (req: any, res: Response) => {
  try {
    const { subject, amount, message } = req.body

    const trx = await db.transaction()

    let userData = await db('organizations')
      .where('user_id', req.user.id)
      .first()
    let userData1 = await db('users').where('id', req.user.id).first()

    const [donationId] = await trx('donations')
      .insert({
        amount,
        ngo_id: userData.id,
        type: 'Withdrawal Request'
      })
      .returning('id')

    await trx('transactions').insert({
      donation_id: donationId,
      payment_gateway: 'Paystack',
      status: 'pending'
    })
    await trx('donation_messages').insert({
      donation_id: donationId,
      message,
      subject
    })
    trx.commit()
    const token = 0
    const url = 'name'
    const currentDate = new Date()
    const additionalData = {
      ngoName: userData.name,
      amount,
      currency: 'NGN',
      requestDate: currentDate
    }
    await new Email({
      email: userData1.email,
      url,
      token,
      additionalData
    }).sendEmail('ngowithdraw', 'Withdrawal Request submitted')
    await new Email({
      email: 'info@givingbackng.org',
      url,
      token,
      additionalData
    }).sendEmail('adminwithdraw', 'New withdrawal Request')

    res.status(201).json({ message: 'Request Submitted' })
  } catch (error) {
    console.error('Error creating withdrawal request', error)
    res.status(500).json({ error: 'Unable to complete process' })
  }
}

export const respondBrief = async (req: any, res: Response) => {
  try {
    const projectId = req.params.id
    const { message } = req.body

    await db('project').where({ id: projectId }).update({
      status: 'active'
    })

    res.status(200).json({ message: 'Project accepted' })
  } catch (error) {
    res.status(500).json({ error: 'Unable to update project' })
  }
}
