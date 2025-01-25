export const stickyNav = (): void => {
  const offset = window.scrollY
  const stickys = document.querySelectorAll<HTMLElement>('#header-sticky')
  stickys.forEach((sticky) => {
    if (offset > 60) {
      sticky.classList.add('sticky-on')
    } else {
      sticky.classList.remove('sticky-on')
    }
  })
}

export const aTagClick = (): void => {
  const aTags = document.querySelectorAll<HTMLAnchorElement>("[href='#']")
  aTags.forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault()
    })
  })
}

export const activeNavMenu = (path: string): void => {
  const navItems = document.querySelectorAll<HTMLAnchorElement>('#menu li a')
  navItems.forEach((nav) => {
    if (nav.pathname === path && !nav.href.includes('#')) {
      // Add your custom logic here, such as setting the class name
      // Example:
      // nav.parentElement?.classList.add('current');
    }
  })
}

export const dataProgress = (): void => {
  const bars = document.querySelectorAll<HTMLElement>('.stats-bar')
  bars.forEach((bar) => {
    const value = bar.getAttribute('data-value')
    if (value) {
      const barLine = bar.querySelector<HTMLElement>('.bar-line')
      if (barLine) {
        barLine.style.width = `${value}%`
      }
    }
  })
}

export const pagination = (
  listClass: string,
  sort: number,
  active: number
): void => {
  const list = document.querySelectorAll<HTMLElement>(listClass)
  list.forEach((element, i) => {
    if (active === 1) {
      if (i < sort) {
        element.classList.remove('d-none')
      } else {
        element.classList.add('d-none')
      }
    } else {
      if (i >= (active - 1) * sort && i < active * sort) {
        element.classList.remove('d-none')
      } else {
        element.classList.add('d-none')
      }
    }
  })
}

export const getPagination = (totalNumber: number, sort: number): number[] => {
  return Array.from(
    { length: Math.ceil(totalNumber / sort) },
    (_, idx) => idx + 1
  )
}
