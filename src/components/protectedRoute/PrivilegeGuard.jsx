import { Navigate } from "react-router-dom";

export default function PrivilegeGuard({ children, requiredPrivilege }) {
    const privileges = JSON.parse(localStorage.getItem("priviligies") || "[]");

    if (requiredPrivilege && !privileges.includes(requiredPrivilege)) {
        return <Navigate to="/home" replace />;
    }

    return children;
}
