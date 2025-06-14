import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import api from "../services/api";

const TenantDashboard = () => {
  const { user } = useAuth();

  const [tenantDetail, setTenantDetail] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTenantDetail = async () => {
      try {
        const response = await api.get("/tenant");
        setTenantDetail(response.data);
      } catch (err) {
        setError("Failed to fetch tenants.");
      }
    };
    fetchTenantDetail();
  }, []);

  return (
    <div>
      <h2>Hi, {user.name}!</h2>
      <p>Email, {user.email}</p>
      <p>Role: {user.role}</p>

      <h3>Tenant Detail</h3>
      <p>company name: {tenantDetail?.name}</p>
      <p>Subdomain: {tenantDetail?.subdomain}</p>

      {user.role === "Admin" &&
        tenantDetail.users &&
        tenantDetail.users.length && (
          <div>
            <strong>Company Users:</strong>
            <ul>
              {tenantDetail.users.map((user) => (
                <li key={user.id}>
                  <p>
                    {user?.name} (Role: {user?.role})
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
};

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await api.get("/superadmin/tenants");
        setTenants(response.data);
      } catch (err) {
        setError("Failed to fetch tenants.");
      }
    };
    fetchTenants();
  }, []);

  return (
    <div>
      <h2>Hi, {user.name}!</h2>
      <p>Email, {user.email}</p>
      <p>Role: {user.role}</p> {error && <p className="error">{error}</p>}
      <h3>All Tenants:</h3>
      <ul>
        {tenants.map((tenant) => (
          <li key={tenant.id}>
            <strong>{tenant.name}</strong> (Subdomain: {tenant.subdomain})
            <br />
            <br />
            <strong>Users:</strong>
            <ul>
              {tenant.users.map((user) => (
                <li key={user.id}>
                  <p>
                    {user.name} (Role: {user.role})
                  </p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="form-container">
      {user.role === "SuperAdmin" ? (
        <SuperAdminDashboard />
      ) : (
        <TenantDashboard />
      )}
    </div>
  );
};

export default DashboardPage;
