import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';

export default function PrivateRoute({ children }) {
    const location = useLocation();
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
} 