import { createContext, useContext, useState } from 'react'

const PageContext = createContext({
  pastProjects: {},
  addPastProject: (value) => {}
})

export const usePastProjectContext = () => {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider')
  }
  return context
}

export default function AddPastProjectProvider({ children }) {
  //   const [page, setPage] = useState(1);
  const [pastProjects, setPastProjects] = useState({})

  // const changePage = (value) => {
  //   // Add any logic you need here
  //   setPage(value);
  // };

  const addPastProject = (value) => {
    setPastProjects((prevPastProjects) => {
      return { ...prevPastProjects, ...value }
    })
  }

  const ctxValue = {
    pastProjects,
    addPastProject
  }

  return (
    <PageContext.Provider value={ctxValue}>{children}</PageContext.Provider>
  )
}
