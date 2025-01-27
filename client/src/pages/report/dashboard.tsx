import { Button, Tooltip } from '@mui/material'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { useState } from 'react'

import Loading from '../../components/home/loading'
import AppCurrentVisits from './dashboard/app-current-visits'
import AppNewsUpdate from './dashboard/app-news-update'
import AppOrderTimeline from './dashboard/app-order-timeline'
import AppWebsiteVisits from './dashboard/app-website-visits'
import AppWidgetSummary from './dashboard/app-widget-summary'
import Mapper from './dashboard/mapbox/Map'
import FilterModal from './filter'

function AdminDashboard({ donor = null }) {
  const [loading, setLoading] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const handleShow = () => setShowModal(true)
  const handleClose = () => setShowModal(false)

  const data = [
    {
      State: 'Abia',
      LocalGovt: 'Aba South',
      Community: '6',
      Donor: '7',
      Project: 'Gender-Based Violence',
      NoOfProjects: '23',
      NGO: '18',
      Funding: 'N23,069,085',
      Beneficiaries: '1092',
      Gender: 'Women',
      EthnicityRace: 'Arochukwu',
      Frequency: '3878',
      Duration: '12'
    },
    {
      State: 'Abia',
      LocalGovt: 'Aba North',
      Community: '4',
      Donor: '5',
      Project: 'Child Mortality',
      NoOfProjects: '38',
      NGO: '24',
      Funding: 'N12,904,126',
      Beneficiaries: '3798',
      Gender: 'Women',
      EthnicityRace: 'Aro Oke-Igbo',
      Frequency: '12892',
      Duration: '12'
    },
    {
      State: 'Abia',
      LocalGovt: 'Isiala Ngwa North',
      Community: '8',
      Donor: '9',
      Project: 'Girl Child Labour',
      NoOfProjects: '12',
      NGO: '16',
      Funding: 'N64,049,005',
      Beneficiaries: '9127',
      Gender: 'Women',
      EthnicityRace: 'Ibini-Ukpai',
      Frequency: '23788',
      Duration: '12'
    },
    {
      State: 'Abia',
      LocalGovt: 'Isiala Ngwa South',
      Community: '2',
      Donor: '11',
      Project: 'Primary Education',
      NoOfProjects: '17',
      NGO: '21',
      Funding: 'N39,069,085',
      Beneficiaries: '576',
      Gender: 'Women',
      EthnicityRace: 'Ututu',
      Frequency: '17627',
      Duration: '12'
    },
    {
      State: 'Adamawa',
      LocalGovt: 'Aba South',
      Community: '6',
      Donor: '7',
      Project: 'Gender-Based Violence',
      NoOfProjects: '23',
      NGO: '18',
      Funding: 'N23,069,085',
      Beneficiaries: '1092',
      Gender: 'Women',
      EthnicityRace: 'Arochukwu',
      Frequency: '3878',
      Duration: '12'
    },
    {
      State: 'Adamawa',
      LocalGovt: 'Aba North',
      Community: '4',
      Donor: '5',
      Project: 'Child Mortality',
      NoOfProjects: '38',
      NGO: '24',
      Funding: 'N12,904,126',
      Beneficiaries: '3798',
      Gender: 'Women',
      EthnicityRace: 'Aro Oke-Igbo',
      Frequency: '12892',
      Duration: '12'
    },
    {
      State: 'Adamawa',
      LocalGovt: 'Isiala Ngwa North',
      Community: '8',
      Donor: '9',
      Project: 'Girl Child Labour',
      NoOfProjects: '12',
      NGO: '16',
      Funding: 'N64,049,005',
      Beneficiaries: '9127',
      Gender: 'Women',
      EthnicityRace: 'Ibini-Ukpai',
      Frequency: '23788',
      Duration: '12'
    },
    {
      State: 'Adamawa',
      LocalGovt: 'Isiala Ngwa South',
      Community: '2',
      Donor: '11',
      Project: 'Primary Education',
      NoOfProjects: '17',
      NGO: '21',
      Funding: 'N39,069,085',
      Beneficiaries: '576',
      Gender: 'Women',
      EthnicityRace: 'Ututu',
      Frequency: '17627',
      Duration: '12'
    },
    {
      State: 'Akwa-Ibom',
      LocalGovt: 'Aba South',
      Community: '6',
      Donor: '7',
      Project: 'Gender-Based Violence',
      NoOfProjects: '23',
      NGO: '18',
      Funding: 'N23,069,085',
      Beneficiaries: '1092',
      Gender: 'Women',
      EthnicityRace: 'Arochukwu',
      Frequency: '3878',
      Duration: '12'
    },
    {
      State: 'Akwa-Ibom',
      LocalGovt: 'Aba North',
      Community: '4',
      Donor: '5',
      Project: 'Child Mortality',
      NoOfProjects: '38',
      NGO: '24',
      Funding: 'N12,904,126',
      Beneficiaries: '3798',
      Gender: 'Women',
      EthnicityRace: 'Aro Oke-Igbo',
      Frequency: '12892',
      Duration: '12'
    },
    {
      State: 'Akwa-Ibom',
      LocalGovt: 'Isiala Ngwa North',
      Community: '8',
      Donor: '9',
      Project: 'Girl Child Labour',
      NoOfProjects: '12',
      NGO: '16',
      Funding: 'N64,049,005',
      Beneficiaries: '9127',
      Gender: 'Women',
      EthnicityRace: 'Ibini-Ukpai',
      Frequency: '23788',
      Duration: '12'
    },
    {
      State: 'Akwa-Ibom',
      LocalGovt: 'Isiala Ngwa South',
      Community: '2',
      Donor: '11',
      Project: 'Primary Education',
      NoOfProjects: '17',
      NGO: '21',
      Funding: 'N39,069,085',
      Beneficiaries: '576',
      Gender: 'Women',
      EthnicityRace: 'Ututu',
      Frequency: '17627',
      Duration: '12'
    },
    {
      State: 'Anambra',
      LocalGovt: 'Aba South',
      Community: '6',
      Donor: '7',
      Project: 'Gender-Based Violence',
      NoOfProjects: '23',
      NGO: '18',
      Funding: 'N23,069,085',
      Beneficiaries: '1092',
      Gender: 'Women',
      EthnicityRace: 'Arochukwu',
      Frequency: '3878',
      Duration: '12'
    },
    {
      State: 'Anambra',
      LocalGovt: 'Aba North',
      Community: '4',
      Donor: '5',
      Project: 'Child Mortality',
      NoOfProjects: '38',
      NGO: '24',
      Funding: 'N12,904,126',
      Beneficiaries: '3798',
      Gender: 'Women',
      EthnicityRace: 'Aro Oke-Igbo',
      Frequency: '12892',
      Duration: '12'
    },
    {
      State: 'Anambra',
      LocalGovt: 'Isiala Ngwa North',
      Community: '8',
      Donor: '9',
      Project: 'Girl Child Labour',
      NoOfProjects: '12',
      NGO: '16',
      Funding: 'N64,049,005',
      Beneficiaries: '9127',
      Gender: 'Women',
      EthnicityRace: 'Ibini-Ukpai',
      Frequency: '23788',
      Duration: '12'
    },
    {
      State: 'Anambra',
      LocalGovt: 'Isiala Ngwa South',
      Community: '2',
      Donor: '11',
      Project: 'Primary Education',
      NoOfProjects: '17',
      NGO: '21',
      Funding: 'N39,069,085',
      Beneficiaries: '576',
      Gender: 'Women',
      EthnicityRace: 'Ututu',
      Frequency: '17627',
      Duration: '12'
    },
    {
      State: 'Bauchi',
      LocalGovt: 'Aba South',
      Community: '6',
      Donor: '7',
      Project: 'Gender-Based Violence',
      NoOfProjects: '23',
      NGO: '18',
      Funding: 'N23,069,085',
      Beneficiaries: '1092',
      Gender: 'Women',
      EthnicityRace: 'Arochukwu',
      Frequency: '3878',
      Duration: '12'
    },
    {
      State: 'Bauchi',
      LocalGovt: 'Aba North',
      Community: '4',
      Donor: '5',
      Project: 'Child Mortality',
      NoOfProjects: '38',
      NGO: '24',
      Funding: 'N12,904,126',
      Beneficiaries: '3798',
      Gender: 'Women',
      EthnicityRace: 'Aro Oke-Igbo',
      Frequency: '12892',
      Duration: '12'
    },
    {
      State: 'Bauchi',
      LocalGovt: 'Isiala Ngwa North',
      Community: '8',
      Donor: '9',
      Project: 'Girl Child Labour',
      NoOfProjects: '12',
      NGO: '16',
      Funding: 'N64,049,005',
      Beneficiaries: '9127',
      Gender: 'Women',
      EthnicityRace: 'Ibini-Ukpai',
      Frequency: '23788',
      Duration: '12'
    },
    {
      State: 'Bauchi',
      LocalGovt: 'Isiala Ngwa South',
      Community: '2',
      Donor: '11',
      Project: 'Primary Education',
      NoOfProjects: '17',
      NGO: '21',
      Funding: 'N39,069,085',
      Beneficiaries: '576',
      Gender: 'Women',
      EthnicityRace: 'Ututu',
      Frequency: '17627',
      Duration: '12'
    },
    {
      State: 'Bayelsa',
      LocalGovt: 'Aba South',
      Community: '6',
      Donor: '7',
      Project: 'Gender-Based Violence',
      NoOfProjects: '23',
      NGO: '18',
      Funding: 'N23,069,085',
      Beneficiaries: '1092',
      Gender: 'Women',
      EthnicityRace: 'Arochukwu',
      Frequency: '3878',
      Duration: '12'
    },
    {
      State: 'Bayelsa',
      LocalGovt: 'Aba North',
      Community: '4',
      Donor: '5',
      Project: 'Child Mortality',
      NoOfProjects: '38',
      NGO: '24',
      Funding: 'N12,904,126',
      Beneficiaries: '3798',
      Gender: 'Women',
      EthnicityRace: 'Aro Oke-Igbo',
      Frequency: '12892',
      Duration: '12'
    },
    {
      State: 'Bayelsa',
      LocalGovt: 'Isiala Ngwa North',
      Community: '8',
      Donor: '9',
      Project: 'Girl Child Labour',
      NoOfProjects: '12',
      NGO: '16',
      Funding: 'N64,049,005',
      Beneficiaries: '9127',
      Gender: 'Women',
      EthnicityRace: 'Ibini-Ukpai',
      Frequency: '23788',
      Duration: '12'
    },
    {
      State: 'Bayelsa',
      LocalGovt: 'Isiala Ngwa South',
      Community: '2',
      Donor: '11',
      Project: 'Primary Education',
      NoOfProjects: '17',
      NGO: '21',
      Funding: 'N39,069,085',
      Beneficiaries: '576',
      Gender: 'Women',
      EthnicityRace: 'Ututu',
      Frequency: '17627',
      Duration: '12'
    },
    {
      State: 'Benue',
      LocalGovt: 'Aba South',
      Community: '6',
      Donor: '7',
      Project: 'Gender-Based Violence',
      NoOfProjects: '23',
      NGO: '18',
      Funding: 'N23,069,085',
      Beneficiaries: '1092',
      Gender: 'Women',
      EthnicityRace: 'Arochukwu',
      Frequency: '3878',
      Duration: '12'
    },
    {
      State: 'Benue',
      LocalGovt: 'Aba North',
      Community: '4',
      Donor: '5',
      Project: 'Child Mortality',
      NoOfProjects: '38',
      NGO: '24',
      Funding: 'N12,904,126',
      Beneficiaries: '3798',
      Gender: 'Women',
      EthnicityRace: 'Aro Oke-Igbo',
      Frequency: '12892',
      Duration: '12'
    },
    {
      State: 'Benue',
      LocalGovt: 'Isiala Ngwa North',
      Community: '8',
      Donor: '9',
      Project: 'Girl Child Labour',
      NoOfProjects: '12',
      NGO: '16',
      Funding: 'N64,049,005',
      Beneficiaries: '9127',
      Gender: 'Women',
      EthnicityRace: 'Ibini-Ukpai',
      Frequency: '23788',
      Duration: '12'
    },
    {
      State: 'Benue',
      LocalGovt: 'Isiala Ngwa South',
      Community: '2',
      Donor: '11',
      Project: 'Primary Education',
      NoOfProjects: '17',
      NGO: '21',
      Funding: 'N39,069,085',
      Beneficiaries: '576',
      Gender: 'Women',
      EthnicityRace: 'Ututu',
      Frequency: '17627',
      Duration: '12'
    }
  ]

  const sampleData = {
    donations: {
      total: data.reduce(
        (sum, item) => sum + parseInt(item.Funding.replace(/[^0-9]/g, '')),
        0
      ),
      history: data.slice(0, 10).map((item, index) => ({
        id: index + 1,
        title: `Donation to ${item.Project} in ${item.LocalGovt}`,
        type: 'order' + (index + 1),
        time: '2024-08-01'
      }))
    },
    ngos: {
      total: data.reduce((total, item) => total + parseInt(item.NGO), 0),
      chart: data.reduce((acc, item) => {
        const existing = acc.find((entry) => entry.label === item.State)
        if (existing) {
          existing.value += parseInt(item.NGO)
        } else {
          acc.push({ label: item.State, value: parseInt(item.NGO) })
        }
        return acc
      }, [])
    },
    p: {
      total: data.reduce(
        (total, item) => total + parseInt(item.NoOfProjects),
        0
      ),
      chart: {
        labels: [...new Set(data.map((item) => item.Project))],
        series: [
          {
            name: 'Projects',
            type: 'column',
            fill: 'solid',
            data: data.reduce((acc, item) => {
              const index = acc.findIndex(
                (entry) => entry.label === item.Project
              )
              if (index >= 0) {
                acc[index].value += parseInt(item.NoOfProjects)
              } else {
                acc.push({
                  label: item.Project,
                  value: parseInt(item.NoOfProjects)
                })
              }
              return acc
            }, []),
            thematicAreas: ['Various']
          }
        ]
      }
    },
    milestones: {
      total: data.length,
      updates: data.slice(0, 10).map((item, index) => ({
        id: index + 1,
        title: `${item.Project} Project in ${item.LocalGovt}`,
        description: `A project focusing on ${item.Project} was executed in ${item.LocalGovt}.`,
        image: '/images/covers/cover_' + ((index % 5) + 1) + '.jpg',
        postedAt: '2024-08-01'
      }))
    },
    mapData: data.map((item) => ({
      id: item.State + '-' + item.LocalGovt,
      state: item.State,
      ngos: parseInt(item.NGO),
      donations: parseInt(item.Funding.replace(/[^0-9]/g, '')),
      projects: parseInt(item.NoOfProjects),
      lat: 0,
      long: 0,
      thematicAreas: [item.Gender]
    }))
  }

  const mapData = [
    {
      id: 1,
      state: 'Abia',
      ngos: 18,
      donations: 23069085,
      projects: 23,
      lat: 5.5228,
      long: 7.488,
      thematicAreas: ['Gender-Based Violence', 'Education']
    },
    {
      id: 2,
      state: 'Adamawa',
      ngos: 18,
      donations: 23069085,
      projects: 23,
      lat: 9.3326,
      long: 12.6473,
      thematicAreas: ['Gender-Based Violence', 'Education']
    },
    {
      id: 3,
      state: 'Akwa-Ibom',
      ngos: 18,
      donations: 23069085,
      projects: 23,
      lat: 5.0141,
      long: 7.9275,
      thematicAreas: ['Gender-Based Violence', 'Education']
    },
    {
      id: 4,
      state: 'Anambra',
      ngos: 18,
      donations: 23069085,
      projects: 23,
      lat: 6.2109,
      long: 7.3809,
      thematicAreas: ['Gender-Based Violence', 'Education']
    },
    {
      id: 5,
      state: 'Bauchi',
      ngos: 18,
      donations: 23069085,
      projects: 23,
      lat: 10.3157,
      long: 9.8476,
      thematicAreas: ['Gender-Based Violence', 'Education']
    },
    {
      id: 6,
      state: 'Bayelsa',
      ngos: 18,
      donations: 23069085,
      projects: 23,
      lat: 5.6078,
      long: 6.0897,
      thematicAreas: ['Gender-Based Violence', 'Education']
    },
    {
      id: 7,
      state: 'Benue',
      ngos: 18,
      donations: 23069085,
      projects: 23,
      lat: 7.1958,
      long: 9.7828,
      thematicAreas: ['Gender-Based Violence', 'Education']
    }
  ]
  const fundingData = (data) => {
    const parseFunding = (fundingStr) =>
      parseInt(fundingStr.replace(/[^0-9]/g, ''), 10)

    const assignMonth = (index) => {
      const monthIndex = index % 12
      return new Date(2024, monthIndex, 1).toISOString().split('T')[0]
    }

    const aggregateByArea = (area) => {
      const monthlyFunding = Array(12).fill(0)
      data.forEach((item, index) => {
        if (item.Project === area) {
          const monthIndex = new Date(assignMonth(index)).getMonth()
          monthlyFunding[monthIndex] += parseFunding(item.Funding)
        }
      })
      return monthlyFunding
    }

    return {
      total: data.length,
      chart: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ].map(
          (month, index) => `2024-${String(index + 1).padStart(2, '0')}-01`
        ),
        series: [
          {
            name: 'Gender-Based Violence',
            type: 'column',
            fill: 'solid',
            data: aggregateByArea('Gender-Based Violence')
          },
          {
            name: 'Child Mortality',
            type: 'area',
            fill: 'gradient',
            data: aggregateByArea('Child Mortality')
          },
          {
            name: 'Girl Child Labour',
            type: 'line',
            fill: 'solid',
            data: aggregateByArea('Girl Child Labour')
          }
        ]
      }
    }
  }

  const projects = fundingData(data)
  const { donations, ngos, milestones, p } = sampleData

  return (
    <>
      {loading && <Loading type={'full'} />}
      <Container maxWidth='xl'>
        {!donor && (
          <Typography variant='h4' sx={{ mb: 5 }}>
            <span> Hi, Welcome back 👋</span>

            <Tooltip title={<span>Data Query Panel</span>} placement='bottom'>
              <Button onClick={handleShow} className='pulse-button'>
                Advanced Filter
              </Button>
            </Tooltip>
          </Typography>
        )}

        <Grid container spacing={3}>
          <Grid xs={6} sm={6} md={3}>
            <AppWidgetSummary
              title='Donations'
              total={donations.total}
              color='success'
              icon={
                <img
                  alt='icon'
                  style={{ width: '150px', height: '50px' }}
                  src='/images/donations.png'
                />
              }
            />
          </Grid>

          <Grid xs={7} sm={6} md={3}>
            <AppWidgetSummary
              title='NGOs'
              total={ngos.total}
              color='info'
              icon={
                <img
                  alt='icon'
                  style={{ width: '150px', height: '50px' }}
                  src='/images/ngo.png'
                />
              }
            />
          </Grid>

          <Grid xs={6} sm={6} md={3}>
            <AppWidgetSummary
              title='Projects'
              total={p.total}
              color='warning'
              icon={
                <img
                  alt='icon'
                  style={{ width: '150px', height: '50px' }}
                  src='/images/pro.png'
                />
              }
            />
          </Grid>

          <Grid xs={6} sm={6} md={3}>
            <AppWidgetSummary
              title='Milestones'
              total={milestones.total}
              color='error'
              icon={
                <img
                  alt='icon'
                  style={{ width: '150px', height: '50px' }}
                  src='/images/mile.png'
                />
              }
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title='Top Projects'
              subheader='Donations'
              chart={projects.chart}
            />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title='Top States with NGOs'
              chart={{
                series: ngos.chart.slice(0, 5).map((item) => ({
                  label: item.label,
                  value: item.value
                }))
              }}
            />
          </Grid>
          {!donor && (
            <Grid xs={12} md={6} lg={8}>
              <AppNewsUpdate
                title='Recent Milestone Updates'
                list={milestones.updates}
              />
            </Grid>
          )}
          {!donor && (
            <Grid xs={12} md={6} lg={4}>
              <AppOrderTimeline
                title='Donation History'
                list={donations.history}
              />
            </Grid>
          )}

          <Mapper mapData={mapData} />
        </Grid>

        <FilterModal show={showModal} handleClose={handleClose} />
      </Container>
    </>
  )
}

export default AdminDashboard
