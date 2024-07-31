import React, { useState, useEffect } from 'react';
import axios from 'axios';


    export function ModuleAccess() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    return (
        <div className="container mx-auto p-4">
            <div className="container mx-auto p-4 flex items-center justify-between">
                <p className="text-lg font-medium text-gray-800">
                
                <h1 className="text-3xl font-bold">"Access Denied" </h1>

You do not have permission to access this module. Please contact your administrator to request access or resolve this issue
                </p>
            </div>

        </div>
    );
};
