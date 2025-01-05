import ForgotPassword from '../pages/auth/forgotPassword'
import Login from '../pages/auth/login'
import Register from '../pages/auth/ngoregister'
import OtpVerification from '../pages/auth/otp'
import DonorDash from '../pages/Donor/dash'

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
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'ni ni-align-center',
    component: <DonorDash />,
    layout: '/donor'
  }
]

export default routes
