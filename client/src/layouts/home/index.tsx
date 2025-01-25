// @ts-ignore

import { Fragment, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router-dom'
import Footer from '../../components/home/Footer'
import Header from '../../components/home/Header'
import MobileHeader from '../../components/home/MobileHeader'
import {
  activeNavMenu,
  aTagClick,
  dataProgress
} from '../../components/home/util'

interface LayoutProps {
  children: React.ReactNode
  transparentTop?: boolean
  transparentHeader?: boolean
  topSecondaryBg?: boolean
  footerSolidBg?: boolean
}

const Layout = ({
  children,
  transparentTop,
  transparentHeader,
  topSecondaryBg,
  footerSolidBg
}: LayoutProps) => {
  const router = useLocation()
  useEffect(() => {
    activeNavMenu(router.pathname)
    // animation();
    // new WOW().init();
    aTagClick()
    dataProgress()
  })

  return (
    <Fragment>
      <Helmet>
        <link
          href='https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400&family=Shadows+Into+Light&display=swap'
          rel='stylesheet'
        />
        <title>World social responsibility platform</title>
        <link
          rel='shortcut icon'
          href='assets/img/favicon.ico'
          type='img/png'
        />
      </Helmet>
      <Header
        transparentTop={transparentTop}
        transparentHeader={transparentHeader}
        topSecondaryBg={topSecondaryBg}
      />
      <MobileHeader
        transparentTop={transparentTop}
        transparentHeader={transparentHeader}
        topSecondaryBg={topSecondaryBg}
      />
      {children}
      <Footer footerSolidBg={footerSolidBg} />
    </Fragment>
  )
}

export default Layout
