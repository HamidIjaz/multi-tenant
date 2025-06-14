import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    tenantName: "",
    subdomain: "",
    adminName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await register(
        formData.tenantName,
        formData.subdomain,
        formData.adminName,
        formData.email,
        formData.password
      );
      setMessage("Registration successful! Please log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="form-container">
      <h1>Register Your Company</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Company Name</label>
          <input
            type="text"
            name="tenantName"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Subdomain (e.g., "test" for test.localhost)</label>
          <input
            type="text"
            name="subdomain"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Your Name</label>
          <input
            type="text"
            name="adminName"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default RegisterPage;
