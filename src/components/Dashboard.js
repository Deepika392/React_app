import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { checkDashboardPermission } from './common/api';
import api from './utils/api';

export function Dashboard() {
    let authToken = localStorage.getItem('authToken')
 
    const [userCount, setUserCount] = useState(0);
    const [catCount, setCatCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [roleCount, setRoleCount] = useState(0);

    const [user, setUser] = useState(false);
    const [cat, setCat] = useState(false);
    const [product, setProduct] = useState(false);
    const [role, setRole] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check dashboard permissions
                const permissionData = await checkDashboardPermission();

                // Set permissions based on fetched data
                setUser(permissionData.some(p => p.moduleName === 'User' && p.can_read === 1));
                setCat(permissionData.some(p => p.moduleName === 'Category' && p.can_read === 1));
                setProduct(permissionData.some(p => p.moduleName === 'Product' && p.can_read === 1));
                setRole(permissionData.some(p => p.moduleName === 'Role' && p.can_read === 1));

                // Fetch the count data
                await fetchCount();
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const fetchCount = async () => {
        try {
            const response = await api.get('/records');
            const data = response.data;
            setUserCount(data.userCount || 0);
            setCatCount(data.categoryCount || 0);
            setProductCount(data.productCount || 0);
            setRoleCount(data.roleCount || 0);
        } catch (error) {
            console.error('Error fetching count data:', error);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <div className="flex flex-wrap -mx-4">
                {role && (
                    <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
                        <Link to='/dashboard/role'>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Role</h2>
                                <div className="flex items-center justify-center">
                                    <div className="text-5xl font-bold text-indigo-600">{roleCount}</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {user && (
                    <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
                        <Link to='/dashboard/user'>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">User</h2>
                                <div className="flex items-center justify-center">
                                    <div className="text-5xl font-bold text-indigo-600">{userCount}</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {cat && (
                    <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
                        <Link to='/dashboard/category'>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Category</h2>
                                <div className="flex items-center justify-center">
                                    <div className="text-5xl font-bold text-indigo-600">{catCount}</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {product && (
                    <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
                        <Link to='/dashboard/product'>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Product</h2>
                                <div className="flex items-center justify-center">
                                    <div className="text-5xl font-bold text-indigo-600">{productCount}</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
