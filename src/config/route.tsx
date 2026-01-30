import { Routes, Route, BrowserRouter } from "react-router";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Dashboard from "../pages/dashboard";
import Attendence from "../pages/attendence";

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />        
      <Route path="/signup" element={<Signup />} />  
      <Route path="/dashboard" element={<Dashboard />} /> 
      <Route path="/attendence" element={<Attendence/>} /> 
    </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
