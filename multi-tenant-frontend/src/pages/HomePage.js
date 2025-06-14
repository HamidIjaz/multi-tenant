import React from "react";
import useAuth from "../hooks/useAuth";
import DashboardPage from "./DashboardPage";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome to the Multi-Tenant SaaS Platform</h1>
      {!user ? (
        <p>Please register your company or log in.</p>
      ) : (
        <DashboardPage />
      )}
    </div>
  );
};

export default HomePage;
