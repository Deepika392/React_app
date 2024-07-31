// AppRouter.js
import React, { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { getPermissionByRole } from './components/common/api';
import { Dashboard } from './components/Dashboard';
import { AddUser } from './components/AddUser';
import { Category } from './components/Catgeory/Catgeory';
import { AddCatgegory } from './components/Catgeory/AddCatgeory';
import { Product } from './components/Product/Product';
import { Addproduct } from './components/Product/Addproduct';
import { Login } from './components/Login/Login';
import { User } from './components/User';
import { Role } from './components/Role/Role';
import { Addrole } from './components/Role/Addrole';
import { Addpermission } from './components/Permission/Addpermission';
import { Permission } from './components/Permission/Permission';
import { ModuleAccess } from './components/ModuleAccess';
import App from './App';

const AppRouter = () => {
    const [router, setRouter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                // Fetch permissions and determine role
                const permissionData = await getPermissionByRole();
                const roleName = permissionData.length ? permissionData[0].roleName : 'public';

                // Define common routes
                const commonRouteData = [
                    {
                        path: '/dashboard',
                        loader: () => redirect('dashboard'),
                    },
                    {
                        path: "dashboard",
                        element: <Dashboard />
                    }
                ];

                // Map permissions to routes
                const newCommonRouteData = permissionData.map(data => {
                    let element;

                    if (data.route_elm && data.rpath != null) {
                        switch (data.route_path) {
                            case 'role': element = <Role />; break;
                            case 'addrole': element = <Addrole />; break;
                            case 'addrole/:roleId': element = <Addrole />; break;
                            case 'category': element = <Category />; break;
                            case 'addcategory': element = <AddCatgegory />; break;
                            case 'addcategory/:catId': element = <AddCatgegory />; break;
                            case 'Permission': element = <Permission />; break;
                            case 'addpermission': element = <Addpermission />; break;
                            case 'addpermission/:permissionId': element = <Addpermission />; break;
                            case 'user': element = <User />; break;
                            case 'adduser': element = <AddUser />; break;
                            case 'adduser/:userId': element = <AddUser />; break;
                            case 'product': element = <Product />; break;
                            case 'addproduct': element = <Addproduct />; break;
                            case 'addproduct/:productId': element = <Addproduct />; break;
                            default: element = <ModuleAccess />;
                        }
                    } else {
                        element = <ModuleAccess />;
                    }

                    return {
                        path: data.route_path || '*',
                        element: element
                    };
                });

                // Define routes without access
                const noAccessRouteData = [
                    {
                        path: "*",
                        element: <ModuleAccess />
                    }
                ];

                // Create route configuration
                const routes = {
                    public: [
                        { path: '/', element: <Login /> },
                    ],
                    [roleName]: [
                        {
                            path: "/",
                            element: <Login />
                        },
                        {
                            path: "dashboard",
                            element: <App />,
                            children: [...commonRouteData, ...newCommonRouteData, ...noAccessRouteData]
                        }
                    ]
                };

                // Update router
                setRouter(createBrowserRouter(routes[roleName] || routes.public));
            } catch (err) {
                console.error('Error fetching routes:', err);
                setError('Failed to fetch routes');
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []); // No dependencies to refetch routes on role change

    // Handle loading and error states
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Render router if available
    return router ? <RouterProvider router={router} /> : null;
};

export default AppRouter;
