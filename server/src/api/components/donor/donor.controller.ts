import { NextFunction, Response } from 'express'
import db from '../../../config'
import { getCounts } from '../../../helper/dash'
import { fetchUsers } from '../../../helper/getusers'
import { User, UserRequest } from '../../../interfaces'
import Email from '../../../utils/mail'

export const getCountsHandler = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as User)?.id

    const donor = await db('donors')
      .where({ user_id: userId })
      .select('id')
      .first()

    let isDonor = !!donor
    let orgId: string | undefined

    if (!donor) {
      const organization = await db('organizations')
        .where({ user_id: userId })
        .select('id')
        .first()
      if (!organization) {
        return res.status(404).json({
          status: 'fail',
          message: 'No donor or organization found for this user.'
        })
      }
      orgId = organization.id
    }

    const counts = await getCounts(userId, isDonor, orgId)

    res.status(200).json(counts)
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch dashboard data' })
  }
}

export const newDonor = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const transaction = await db.transaction()

  try {
    const user_id = (req.user as User)?.id

    // Fetch user data
    const userData = await db('users').where('id', user_id).first()
    if (!userData) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found.'
      })
    }
    const email = userData.email

    // Destructure required fields from request body
    const {
      name,
      phoneNumber,
      industry,
      interest_area,
      state,
      city_lga,
      address,
      about
    } = req.body

    // Validate missing fields
    const missingFields: string[] = []
    if (!name) missingFields.push('name')
    if (!phoneNumber) missingFields.push('phoneNumber')

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'fail',
        error: `Missing required field(s): ${missingFields.join(', ')}`
      })
    }

    const additionalFields: any = { ...req.body }
    const requiredFields = [
      'name',
      'phoneNumber',
      'industry',
      'interest_area',
      'state',
      'city_lga',
      'address',
      'about'
    ]
    requiredFields.forEach((field) => delete additionalFields[field])

    const [donorId] = await db('donors').insert({
      name,
      phoneNumber,
      industry,
      email,
      interest_area,
      state,
      city_lga,
      address,
      about,
      user_id,
      additional_information: JSON.stringify(additionalFields)
    })

    const newDonor = await db('donors').where('id', donorId).first()

    await db('users').where('id', user_id).update({
      role: 'donor',
      status: 1,
      token: 0
    })

    await transaction.commit()

    //email
    const token = 0
    const url = name
    const additionalData = { role: 'Donor' }
    await new Email({ email: email, url, token, additionalData }).sendEmail(
      'donoronboard',
      'Welcome to the GivingBack Family!'
    )
    await new Email({
      email: 'info@givingbackng.org',
      url,
      token,
      additionalData
    }).sendEmail('adminonb', 'New user')

    res.status(201).json({
      message: 'Donor created successfully',
      donor: newDonor
    })
  } catch (error) {
    await transaction.rollback()
    console.error(error)

    res.status(500).json({
      error: 'Unable to create donor',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const getAllUsers = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await fetchUsers(req.query)
    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const sendMessageToNGO = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as User)?.id

    const ngoId = req.params.id
    const { subject, message }: any = req.body

    const org = await db('organizations').where('id', ngoId).first()

    if (!org) {
      return res.status(404).json({
        message: 'NGO not found'
      })
    }

    const newDonor = await db('messages').insert({
      subject,
      message,
      sender_id: userId,
      sender_type: 'donor',
      user_id: org.user_id
    })

    res.status(200).json({
      message: 'Message sent successfully',
      newDonor
    })
  } catch (error: any) {
    res.status(500).json({
      message: 'Failed to send message',
      error: error.message
    })
  }
}

export const feedBack = async (
  req: any,
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

    await db('donor_comment').insert({
      project_id: id,
      comment: comment
    })

    res.status(201).json({ message: 'Comment Submitted' })
  } catch (error) {
    console.error('Error creating projects:', error)
    res.status(500).json({ error: 'Unable to submit comment' })
  }
}

export const addRecipient = async (req: any, res: Response) => {
  const {
    ngoId,
    name,
    donorId
  }: { ngoId: string; name: string; donorId: string } = req.body

  try {
    // Check if the recipient already exists
    const existingRecipient = await db('donor_beneficiary')
      .where({
        ngo_id: ngoId,
        name: name,
        donor_id: donorId
      })
      .first()

    if (existingRecipient) {
      return res.status(400).json({ message: 'Recipient already exists' })
    }

    // Insert the new recipient
    const [newRecipient] = await db('donor_beneficiary').insert(
      {
        ngo_id: ngoId,
        name: name,
        donor_id: donorId
      },
      ['id']
    )

    res.status(201).json(newRecipient)
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipient', error })
  }
}

// GetRecipient
export const getRecipient = async (req: any, res: Response) => {
  try {
    const donor = await db('donors')
      .where({ user_id: req.user.id })
      .select('id')
      .first()

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found.' })
    }

    const ngoIds = await db('donor_beneficiary')
      .select('ngo_id')
      .where('donor_id', donor.id)

    if (ngoIds.length === 0) {
      return res
        .status(404)
        .json({ message: 'No NGOs found for this donor ID.' })
    }

    const ids = ngoIds.map((ngo) => ngo.ngo_id)

    const ngosWithAddresses = await db('organizations as org')
      .select('org.*', 'addr.*')
      .leftJoin('address as addr', 'org.user_id', 'addr.user_id')
      .whereIn('org.id', ids)

    return res.json(ngosWithAddresses)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'An error occurred while fetching NGOs.', error })
  }
}

// Donate
export const donate = async (req: any, res: Response) => {
  const trx = await db.transaction()

  try {
    const {
      amount,
      project_id,
      ngo_id,
      donor_id,
      type = 'Donated'
    }: {
      amount: string
      project_id: string
      ngo_id: string
      donor_id: string
      type?: string
    } = req.body

    const donationAmount = parseFloat(amount)

    const wallet = await trx('wallet').where('user_id', donor_id).first()

    if (!wallet) {
      return res
        .status(404)
        .json({ message: 'Wallet not found for this donor' })
    }

    if (wallet.balance < donationAmount) {
      return res.status(400).json({ message: 'Insufficient balance in wallet' })
    }

    const updatedBalance = wallet.balance - donationAmount
    await trx('wallet')
      .where('user_id', donor_id)
      .update({ balance: updatedBalance })

    const dono = await trx('donors')
      .where({ user_id: donor_id })
      .select('id')
      .first()

    const [donationId] = await trx('donations').insert(
      {
        amount,
        project_id,
        ngo_id,
        donor_id: dono?.id,
        type
      },
      ['id']
    )

    const ngoWallet = await trx('wallet').where('user_id', ngo_id).first()

    if (!ngoWallet) {
      return res.status(404).json({ message: 'Wallet not found for this NGO' })
    }

    const updatedNgoBalance = ngoWallet.balance + donationAmount
    await trx('wallet')
      .where('user_id', ngo_id)
      .update({ balance: updatedNgoBalance })

    await trx.commit()

    //email

    let userData = await db('organizations').where('user_id', ngo_id).first()
    let userData4 = await db('users').where('user_id', ngo_id).first()
    const userData2 = await db('donors').where('user_id', donor_id).first()
    const userData3 = await db('project').where('id', project_id).first()
    if (!userData2) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found.'
      })
    }
    const email = userData2.email
    const currentDate = new Date()

    const token = 0
    const url = userData.name
    const additionalData = {
      projectTitle: userData3.title,
      currency: 'NGN',
      ngoName: userData.name,
      amount: amount,
      donorName: userData2.name,
      donationDate: currentDate
    }
    await new Email({
      email: userData4.email,
      url,
      token,
      additionalData
    }).sendEmail('receivengo', 'Donation Received')
    await new Email({ email: email, url, token, additionalData }).sendEmail(
      'donatengo',
      'Donation Received'
    )
    await new Email({
      email: 'info@givingbackng.org',
      url,
      token,
      additionalData
    }).sendEmail('admindonate', 'New Donation')

    res.status(201).json({
      message: 'Donation added successfully',
      donationId,
      updatedBalance
    })
  } catch (error) {
    await trx.rollback()
    console.error(error)
    res.status(500).json({ message: 'Error adding donation' })
  }
}

export const getAllUserPresentProjects = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    // Fetch organization by user ID
    const user = await db('organizations')
      .where({ user_id: id })
      .select(
        'id',
        'name',
        'phone',
        'website',
        'interest_area',
        'cac',
        'active',
        'user_id'
      )
      .first()

    if (!user) {
      res.status(404).json({ error: 'User organization not found' })
      return
    }

    const {
      page = 1,
      limit = 10,
      status,
      title,
      startDate,
      endDate
    }: {
      page?: number
      limit?: number
      status?: string
      title?: string
      startDate?: string
      endDate?: string
    } = req.query

    const offset = (Number(page) - 1) * Number(limit)

    // Query for projects
    let query = db('project')
      .where({ organization_id: user.id })
      .select(
        'id',
        'title',
        db.raw('DATE_FORMAT(startDate, "%Y-%m-%d") AS startDate'),
        db.raw('DATE_FORMAT(endDate, "%Y-%m-%d") AS endDate'),
        'description',
        'objectives',
        'category',
        'donor_id',
        'cost',
        'scope',
        'allocated',
        'beneficiary_overview',
        'status',
        'createdAt',
        'updatedAt'
      )

    // Filter conditions
    if (status) {
      query = query.where(db.raw('LOWER(status)'), '=', status.toLowerCase())
    }
    if (title) {
      query = query.where(
        db.raw('LOWER(title)'),
        'LIKE',
        `%${title.toLowerCase()}%`
      )
    }
    if (startDate) {
      query = query.where('startDate', '>=', startDate)
    }
    if (endDate) {
      query = query.where('endDate', '<=', endDate)
    }

    // Get total items count
    const [totalItems] = await db('project')
      .where({ organization_id: user.id })
      .count('id as total')

    const count: number = parseInt(totalItems?.total as string, 10) || 0
    const totalPages = Math.ceil(count / Number(limit))

    // Paginate query
    query = query.limit(Number(limit)).offset(offset)

    const userPresentProjects = await query

    // Map project details
    const projectsWithDetails = await Promise.all(
      userPresentProjects.map(async (project: any) => {
        const projectId = project.id
        const donorId = project.donor_id

        // Fetch donor details
        const donorDetails = await db('donors')
          .where({ id: donorId })
          .select(
            'name',
            'phoneNumber',
            'industry',
            'email',
            'interest_area',
            'state',
            'city_lga',
            'address',
            'about',
            'image'
          )
          .first()

        // Fetch milestones and updates
        const milestones = await db('milestone')
          .where({ project_id: projectId })
          .select('id', 'milestone', 'target')

        const outputMilestones = await Promise.all(
          milestones.map(async (milestone: any) => {
            const updates = await db('milestone_update')
              .where({ milestone_id: milestone.id })
              .select(
                'achievement',
                'position',
                'status',
                'narration',
                'createdAt'
              )

            return {
              id: milestone.id,
              milestone: milestone.milestone,
              target: milestone.target,
              milestoneUpdates: updates.map((update: any) => ({
                achievement: update.achievement,
                position: update.position,
                status: update.status,
                narration: update.narration,
                createdAt: update.createdAt
              }))
            }
          })
        )

        // Fetch beneficiaries
        const beneficiary = await db('beneficiary')
          .where({ project_id: projectId })
          .select('state', 'city', 'community', 'contact')

        // Fetch project images
        const images = await db('project_images')
          .where({ project_id: projectId })
          .select('id', 'image')

        return {
          ...project,
          sponsor: donorDetails,
          milestones: outputMilestones,
          beneficiary,
          images
        }
      })
    )

    // Respond with results
    res.status(200).json({
      projects: projectsWithDetails,
      totalItems: count,
      totalPages,
      currentPage: Number(page)
    })
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch user's present projects" })
  }
}
