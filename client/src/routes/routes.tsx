import {
  ChartNoAxesCombined,
  Clipboard,
  FolderDot,
  FolderOpenDot,
  FolderPlus,
  FolderSearch2,
  HandCoins,
  House,
  Landmark,
  Mails,
  Settings,
  ShieldUser,
  User,
  UserRoundSearch,
  UsersRound,
  WalletCards,
} from "lucide-react";
import FundWallets from "../pages";
import Admin_projects from "../pages/admin_projects";
import ForgotPassword from "../pages/auth/forgotPassword";
import Login from "../pages/auth/login";
import Register from "../pages/auth/ngoregister";
import SignUp from "../pages/auth/oldsignup";
import OtpVerification from "../pages/auth/otp";
import ResetPassword from "../pages/auth/ResetPassword";
import Briefs from "../pages/briefs";
import Dashboard from "../pages/Dashboard";
import DN_Projects from "../pages/donor_ngo_projects";
import FundsM from "../pages/fundsM";
import MessageDonor from "../pages/messages";
import AddPastProject from "../pages/ngo/pastproject/past-projects";
import NGODetails from "../pages/ngo_details";
import Ngo from "../pages/ngodirectory";
import Profile from "../pages/profile";
import CreateProject from "../pages/project/create-project-options";
import ProjectViewDetail from "../pages/project/single";
import AdminDashboard from "../pages/report/dashboard";
import SendMoney from "../pages/send";

const routes = [
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/forgot_password",
    name: "ForgotPassword",
    icon: "ni ni-key-25 text-info",
    component: <ForgotPassword />,
    layout: "/auth",
  },
  {
    path: "/resetPassword/:token",
    name: "ResetPassword",
    icon: "ni ni-key-25 text-info",
    component: <ResetPassword />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-key-25 text-info",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/verify",
    name: "Verification",
    icon: "ni ni-key-25 text-info",
    component: <OtpVerification />,
    layout: "/auth",
  },
  {
    path: "/donor",
    name: "Signup",
    icon: "ni ni-align-center",
    component: <SignUp ngo={null} />,
    layout: "/signup",
  },
  {
    path: "/organization",
    name: "NGO_Signup",
    icon: "ni ni-align-center",
    component: <SignUp ngo={1} />,
    layout: "/signup",
  },
  //Donor
  {
    path: "/dashboard",
    name: "Home",
    icon: <House />,
    component: <Dashboard />,
    layout: "/donor",
  },
  {
    path: "/projects",
    name: "Explore Projects",
    icon: <FolderSearch2 />,
    component: <DN_Projects />,
    layout: "/donor",
  },
  {
    path: "/projects/brief_initiate",
    name: "Create Project",
    icon: <FolderPlus />,
    component: <CreateProject />,
    layout: "/donor",
  },
  {
    path: "/ngo_directory",
    name: "Find NGOs",
    icon: <UserRoundSearch />,
    component: <Ngo />,
    layout: "/donor",
  },
  {
    path: "/fund_management",
    name: "My Contributions",
    icon: <WalletCards />,
    component: <FundsM />,
    layout: "/donor",
  },
  {
    path: "/reports",
    name: "Reports",
    icon: <ChartNoAxesCombined />,
    component: <AdminDashboard donor={1} />,
    layout: "/donor",
  },
  {
    path: "/messages",
    name: "Messages",
    icon: <Mails />,
    component: <MessageDonor />,
    layout: "/donor",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: <User />,
    component: <Profile />,
    layout: "/donor",
  },

  //NGOs
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <House />,
    component: <Dashboard />,
    layout: "/ngo",
  },
  {
    path: "/projects",
    name: "Projects",
    icon: <FolderOpenDot />,
    component: <DN_Projects />,
    layout: "/ngo",
  },
  {
    path: "/fund_management",
    name: "Funds",
    icon: <HandCoins />,
    component: <FundsM />,
    layout: "/ngo",
  },
  {
    path: "/briefs",
    name: "Briefs",
    icon: <Clipboard />,
    component: <Briefs />,
    layout: "/ngo",
  },
  {
    path: "/messages",
    name: "Messages",
    icon: <Mails />,
    component: <MessageDonor />,
    layout: "/ngo",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: <User />,
    component: <Profile />,
    layout: "/ngo",
  },

  //Admins
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <House />,
    component: <Dashboard />,
    layout: "/admin",
  },

  {
    path: "/ngo_directory",
    name: "NGOs",
    icon: <UsersRound />,
    component: <Ngo />,
    layout: "/admin",
  },
  {
    path: "/projects",
    name: "Donors",
    icon: <HandCoins />,
    component: <Admin_projects />,
    layout: "/admin",
  },
  {
    path: "/projects",
    name: "Projects & Briefs",
    icon: <FolderDot />,
    component: <Admin_projects />,
    layout: "/admin",
  },
  {
    path: "/fund_management",
    name: "Transactions",
    icon: <Landmark />,
    component: <FundsM />,
    layout: "/admin",
  },
  {
    path: "/reports",
    name: "Reports",
    icon: <ChartNoAxesCombined />,
    component: <AdminDashboard />,
    layout: "/admin",
  },
  {
    path: "/projects",
    name: "Support",
    icon: <User />,
    component: <Admin_projects />,
    layout: "/admin",
  },
  {
    path: "/projects",
    name: "Admin users",
    icon: <ShieldUser />,
    component: <Admin_projects />,
    layout: "/admin",
  },
  {
    path: "/projects",
    name: "Settings",
    icon: <Settings />,
    component: <Admin_projects />,
    layout: "/admin",
  },

  //viewing one ngo
  {
    path: "/ngo/:id",
    icon: "ni ni-circle-08",
    component: <NGODetails />,
    layout: "/donor",
  },
  {
    path: "/ngo/:id",
    icon: "ni ni-circle-08",
    component: <NGODetails />,
    layout: "/admin",
  },

  ///projectdetails
  {
    path: "/projects/:id",
    icon: "ni ni-circle-08",
    component: <ProjectViewDetail />,
    layout: "/donor",
  },
  {
    path: "/projects/:id",
    icon: "ni ni-circle-08",
    component: <ProjectViewDetail />,
    layout: "/ngo",
  },
  {
    path: "/projects/:id",
    icon: "ni ni-circle-08",
    component: <ProjectViewDetail />,
    layout: "/admin",
  },

  ///upload prev project
  {
    path: "/projects/add_past",
    icon: "ni ni-settings-gear-65",
    component: <AddPastProject />,
    layout: "/ngo",
  },

  {
    path: "/fund_wallet",
    icon: "ni ni-settings-gear-65",
    component: <FundWallets />,
    layout: "/ngo",
  },
  {
    path: "/send_money",
    icon: "ni ni-settings-gear-65",
    component: <SendMoney />,
    layout: "/ngo",
  },
  {
    path: "/fund_wallet",
    icon: "ni ni-settings-gear-65",
    component: <FundWallets />,
    layout: "/donor",
  },
  {
    path: "/send_money",
    icon: "ni ni-settings-gear-65",
    component: <SendMoney />,
    layout: "/donor",
  },
  //////breif initiate
  {
    path: "/projects/brief_initiate",
    icon: "ni ni-chart-bar-32",
    component: <CreateProject />,
    layout: "/admin",
  },
  {
    path: "/projects/brief_initiate",
    icon: "ni ni-chart-bar-32",
    component: <CreateProject />,
    layout: "/ngo",
  },
];

export default routes;
