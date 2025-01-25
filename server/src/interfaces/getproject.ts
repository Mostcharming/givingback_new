export interface ProjectFilter {
  donor_id?: string
  organization_id?: string
  projectType?: 'present' | 'previous'
  title?: string
  description?: string
  objectives?: string
  category?: string
  scope?: string
  status?: string
  startDate?: string
  endDate?: string
  id?: number
}
