import { NextFunction, Request, Response } from 'express'
import db from '../../../config'
import { getProjects } from '../../../helper/getProjects'

export const getAllProjectsForAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
      donor_id,
      organization_id,
      projectType,
      title,
      description,
      objectives,
      category,
      scope,
      status,
      startDate,
      endDate
    } = req.query

    const filters = {
      donor_id: donor_id as string,
      organization_id: organization_id as string,
      projectType: projectType as 'present' | 'previous',
      title: title as string,
      description: description as string,
      objectives: objectives as string,
      category: category as string,
      scope: scope as string,
      status: status as string,
      startDate: startDate as string,
      endDate: endDate as string
    }

    const { previousProjects, presentProjects } = await getProjects(
      db,
      filters,
      parseInt(page as string),
      parseInt(limit as string)
    )

    const totalItems = previousProjects.length + presentProjects.length
    const totalPages = Math.ceil(totalItems / parseInt(limit as string))

    res.status(200).json({
      projects: [...previousProjects, ...presentProjects],
      totalItems,
      totalPages,
      currentPage: parseInt(page as string)
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'Unable to fetch all projects for all users' })
  }
}
