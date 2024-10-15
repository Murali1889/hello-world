import React from "react";
import './App.css';
// import DashboardTabs from "./components/DashboardTabs";
import CompanyDashboard from "./components/dashboard/CompanyDashboard";

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <CompanyDashboard/>
    </div>
  );
}

export default App;