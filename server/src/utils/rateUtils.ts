import axios from 'axios'
import db from '../config'

export const fetchRateFromGoogle = async (): Promise<void> => {
  try {
    const response = await axios.get(
      'https://api.exchangerate-api.com/v4/latest/USD'
    )
    const rate = response.data.rates.NGN
    await saveRateToDB(rate)
  } catch (error) {
    console.error('Error fetching rate from Google:', error)
  }
}

const saveRateToDB = async (rate: number): Promise<void> => {
  try {
    const latestRate = await db('rates').orderBy('updated_at', 'desc').first()

    if (latestRate && latestRate.mode !== 'automatic') {
      console.log('Last rate entry is not automatic. Skipping update.')
      return
    }

    if (!latestRate || latestRate.mode === 'automatic') {
      await db('rates').del()
      await db('rates').insert({ rate, mode: 'automatic' })
      console.log('Rate updated automatically.')
    }
    console.log('Rate saved to DB successfully.')
  } catch (error) {
    console.error('Error saving rate to DB:', error)
  }
}
