/* eslint-disable react/prop-types */

import { Navigate } from "react-router-dom";
import { UserAuth } from "../utils/AuthContext";

const Protected = ({ children }) => {
    const {user} = UserAuth();
    if (!user) {
        return <Navigate to="/" />;
    }

    return children;
};

export default Protected;