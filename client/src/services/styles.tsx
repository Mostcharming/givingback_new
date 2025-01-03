import { useEffect, useRef } from 'react'

const styles = {
  argon: [
    './src/assets/plugins/nucleo/css/nucleo.css',
    './src/assets/scss/argon-dashboard-react.scss'
  ],
  givingback: ['./src/assets/scss/home/App.scss']
}

export const useLoadStyles = (styleKeys) => {
  const loadedStyles = useRef(new Set())

  useEffect(() => {
    const selectedStyles = styleKeys.reduce((acc, key) => {
      return acc.concat(styles[key] || [])
    }, [])

    const styleSheets = []

    selectedStyles.forEach((style) => {
      // Skip if already loaded
      if (loadedStyles.current.has(style)) {
        return
      }

      const styleSheet = document.createElement('link')
      styleSheet.rel = 'stylesheet'
      styleSheet.href = style

      // Add to tracking set
      loadedStyles.current.add(style)

      // Add to DOM
      document.head.appendChild(styleSheet)
      styleSheets.push(styleSheet)
    })

    // Only clean up styles when component unmounts
    return () => {
      styleSheets.forEach((styleSheet) => {
        document.head.removeChild(styleSheet)
        loadedStyles.current.delete(styleSheet.href)
      })
    }
  }, []) // Empty dependency array - only run on mount
}
