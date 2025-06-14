import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/register">Register</Link>}
      {user && user.role === "Admin" && (
        <Link to="/create-user">Add Company User</Link>
      )}
      {user && <button onClick={logout}>Logout</button>}
    </nav>
  );
};

export default Navigation;
