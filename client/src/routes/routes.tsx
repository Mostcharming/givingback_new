import FundWallets from '../pages'
import Admin_projects from '../pages/admin_projects'
import ForgotPassword from '../pages/auth/forgotPassword'
import Login from '../pages/auth/login'
import Register from '../pages/auth/ngoregister'
import OtpVerification from '../pages/auth/otp'
import SignUp from '../pages/auth/signup'
import Briefs from '../pages/briefs'
import Dashboard from '../pages/Dashboard'
import DN_Projects from '../pages/donor_ngo_projects'
import FundsM from '../pages/fundsM'
import AddPastProject from '../pages/ngo/pastproject/past-projects'
import NGODetails from '../pages/ngo_details'
import Ngo from '../pages/ngodirectory'
import ProjectViewDetail from '../pages/project_details'
import SendMoney from '../pages/send'

var routes = [
  {
    path: '/login',
    name: 'Login',
    icon: 'ni ni-key-25 text-info',
    component: <Login />,
    layout: '/auth'
  },
  {
    path: '/forgot_password',
    name: 'ForgotPassword',
    icon: 'ni ni-key-25 text-info',
    component: <ForgotPassword />,
    layout: '/auth'
  },
  {
    path: '/register',
    name: 'Register',
    icon: 'ni ni-key-25 text-info',
    component: <Register isDonor={false} />,
    layout: '/auth'
  },
  {
    path: '/donor_register',
    name: 'DonorRegister',
    icon: 'ni ni-key-25 text-info',
    component: <Register isDonor />,
    layout: '/auth'
  },
  {
    path: '/verify',
    name: 'Verification',
    icon: 'ni ni-key-25 text-info',
    component: <OtpVerification />,
    layout: '/auth'
  },
  {
    path: '/donor',
    name: 'Signup',
    icon: 'ni ni-align-center',
    component: <SignUp ngo={null} />,
    layout: '/signup'
  },
  {
    path: '/organization',
    name: 'NGO_Signup',
    icon: 'ni ni-align-center',
    component: <SignUp ngo={1} />,
    layout: '/signup'
  },
  //Dash
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'ni ni-align-center',
    component: <Dashboard />,
    layout: '/donor'
  },
  ,
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'ni ni-align-center',
    component: <Dashboard />,
    layout: '/ngo'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'ni ni-align-center',
    component: <Dashboard />,
    layout: '/admin'
  },
  //ngo_directory
  {
    path: '/ngo_directory',
    name: 'NGO Directory',
    icon: 'ni ni-circle-08',
    component: <Ngo />,
    layout: '/donor'
  },
  {
    path: '/ngo_directory',
    name: 'NGO Directory',
    icon: 'ni ni-circle-08',
    component: <Ngo />,
    layout: '/admin'
  },
  //viewing one ngo
  {
    path: '/ngo/:id',
    icon: 'ni ni-circle-08',
    component: <NGODetails />,
    layout: '/donor'
  },
  {
    path: '/ngo/:id',
    icon: 'ni ni-circle-08',
    component: <NGODetails />,
    layout: '/admin'
  },
  ////projects
  {
    path: '/projects',
    name: 'Projects',
    icon: 'ni ni-building',
    component: <DN_Projects />,
    layout: '/ngo'
  },
  {
    path: '/projects',
    name: 'Projects',
    icon: 'ni ni-building',
    component: <DN_Projects />,
    layout: '/donor'
  },
  {
    path: '/projects',
    name: 'Projects',
    icon: 'ni ni-building',
    component: <Admin_projects />,
    layout: '/admin'
  },
  ///projectdetails
  {
    path: '/project/:id',
    icon: 'ni ni-circle-08',
    component: <ProjectViewDetail />,
    layout: '/donor'
  },
  {
    path: '/project/:id',
    icon: 'ni ni-circle-08',
    component: <ProjectViewDetail />,
    layout: '/ngo'
  },
  {
    path: '/project/:id',
    icon: 'ni ni-circle-08',
    component: <ProjectViewDetail />,
    layout: '/admin'
  },
  ////fund management
  {
    path: '/fund_management',
    name: 'FundsManagement',
    icon: 'ni ni-money-coins',
    component: <FundsM />,
    layout: '/donor'
  },
  ,
  {
    path: '/fund_management',
    name: 'FundsManagement',
    icon: 'ni ni-money-coins',
    component: <FundsM />,
    layout: '/ngo'
  },
  {
    path: '/fund_management',
    name: 'FundsManagement',
    icon: 'ni ni-money-coins',
    component: <FundsM />,
    layout: '/admin'
  },
  //////donor/briefs
  {
    path: '/briefs',
    name: 'Briefs',
    icon: 'ni ni-archive-2',
    component: <Briefs />,
    layout: '/donor'
  },
  ,
  {
    path: '/briefs',
    name: 'Briefs',
    icon: 'ni ni-archive-2',
    component: <Briefs />,
    layout: '/ngo'
  },
  /////admin Donor
  {
    path: '/dashboard',
    name: 'Donors',
    icon: 'ni ni-favourite-28',
    component: <Dashboard />,
    layout: '/admin'
  },
  //////report
  {
    path: '/dashboard',
    name: 'Report',
    icon: 'ni ni-chart-bar-32',
    component: <Dashboard />,
    layout: '/donor'
  },
  ,
  {
    path: '/dashboard',
    name: 'Report',
    icon: 'ni ni-chart-bar-32',
    component: <Dashboard />,
    layout: '/admin'
  },
  ////messages
  {
    path: '/dashboard',
    name: 'Messages',
    icon: 'ni ni-send',
    component: <Dashboard />,
    layout: '/donor'
  },
  ,
  {
    path: '/dashboard',
    name: 'Messages',
    icon: 'ni ni-send',
    component: <Dashboard />,
    layout: '/ngo'
  },
  ///////settings
  {
    path: '/dashboard',
    name: 'My Profile',
    icon: 'ni ni-settings-gear-65',
    component: <Dashboard />,
    layout: '/donor'
  },
  ,
  {
    path: '/dashboard',
    name: 'My Profile',
    icon: 'ni ni-settings-gear-65',
    component: <Dashboard />,
    layout: '/ngo'
  },
  {
    path: '/dashboard',
    name: 'Settings',
    icon: 'ni ni-settings-gear-65',
    component: <Dashboard />,
    layout: '/admin'
  },
  ///upload prev project
  {
    path: '/projects/add_past',
    icon: 'ni ni-settings-gear-65',
    component: <AddPastProject />,
    layout: '/ngo'
  },

  /////money

  {
    path: '/fund_wallet',
    icon: 'ni ni-settings-gear-65',
    component: <FundWallets />,
    layout: '/ngo'
  },
  {
    path: '/send_money',
    icon: 'ni ni-settings-gear-65',
    component: <SendMoney />,
    layout: '/ngo'
  },
  {
    path: '/fund_wallet',
    icon: 'ni ni-settings-gear-65',
    component: <FundWallets />,
    layout: '/donor'
  },
  {
    path: '/send_money',
    icon: 'ni ni-settings-gear-65',
    component: <SendMoney />,
    layout: '/donor'
  }
]

export default routes
