import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import propTypes from 'prop-types'

export default function AuthRequired({ isAuthenticatedSetter }) {
    console.log('Is authenticated:', isAuthenticatedSetter());

    return isAuthenticatedSetter() ? (
        <Outlet />
    ) : (
        <Navigate to="/" />
    );
}

AuthRequired.propTypes = {
}


