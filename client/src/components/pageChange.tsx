import { useState } from 'react'

function usePageChange(initialPage = 1) {
  const [page, setPage] = useState(initialPage)

  const changePage = (changeValue: string) => {
    if (changeValue === 'Back') {
      setPage((prevPage) => prevPage - 1)
    } else if (changeValue === 'Next') {
      setPage((prevPage) => prevPage + 1)
    }
    return page
  }

  const setPageNumber = (pageNumer: number) => {
    setPage(pageNumer)
  }

  return { page, changePage, setPageNumber }
}

export default usePageChange
