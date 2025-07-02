import { createContext, useContext, useState } from 'react'

interface BriefContextProps {
  brief: Record<string, any>
  addToBrief: (value: any) => void
  executingNGOs: any[]
  addExecutingNGOs: (ngo: any[]) => void
}

const BriefContext = createContext<BriefContextProps>({
  brief: {},
  addToBrief: (value) => {},
  executingNGOs: [],
  addExecutingNGOs: (ngo: any[]) => {}
})

export const useBriefContext = () => {
  const context = useContext(BriefContext)
  if (!context) {
    throw new Error('useBriefContext must be used within a PageProvider')
  }
  return context
}

export default function AddBriefProvider({ children }) {
  const [brief, setBrief] = useState({})
  const [executingNGOs, setExecutingNGOs] = useState<any[]>([])

  const addToBrief = (value) => {
    setBrief((prevBrief) => {
      return { ...prevBrief, ...value }
    })
  }

  const addExecutingNGOs = (value: any[]) => {
    setExecutingNGOs((prevExecutingNGOs) => {
      return [...prevExecutingNGOs, ...value]
    })
  }

  const getLatestBrief = () => {
    // get the latest brief after a setExecutingNGOs call
    // return the latest brief
  }

  const ctxValue = {
    brief,
    addToBrief,
    executingNGOs,
    addExecutingNGOs
  }

  return (
    <BriefContext.Provider value={ctxValue}>{children}</BriefContext.Provider>
  )
}
