import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';

export function Addpermission() {
    const [roleId, setRoleId] = useState('');
    const [moduleId, setModuleId] = useState('');
    const [canRead, setCanRead] = useState(false);
    const [canWrite, setCanWrite] = useState(false);
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [errors, setErrors] = useState({});

    const { permissionId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (permissionId) {
            fetchPermission(permissionId);
        }
    }, [permissionId]);

    useEffect(() => {
        getRoles();
        getModules();
        if (permissionId) {
            getPermission();
        }
    }, [permissionId]);

    const getRoles = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/role`);
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const getModules = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/module`);
            setModules(response.data);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };
    const fetchPermission = async()=>{
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/module`);
            // setModules(response.data);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    }

    const getPermission = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/permission/${permissionId}`);
            const { roleId, moduleId, can_read, can_write } = response.data;
            setRoleId(roleId);
            setModuleId(moduleId);
            setCanRead(can_read === 1); // Assuming 1 means true
            setCanWrite(can_write === 1); // Assuming 1 means true
        } catch (error) {
            console.error('Error fetching permission:', error);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!roleId) newErrors.roleId = 'Role is required';
        if (!moduleId) newErrors.moduleId = 'Module is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function collectData(e) {
        e.preventDefault();

        if (validateForm()) {
            permissionId ? updatePermission() : addPermission();
        }
    }

    async function addPermission() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/permission`, {
                roleId,
                moduleId,
                can_read: canRead ? 1 : 0,
                can_write: canWrite ? 1 : 0,
            });

            if (response.status === 201) { // Check for correct status code
                Swal.fire({
                    icon: 'success',
                    title: 'Permission Added',
                    text: 'Permission registered successfully',
                }).then(() => {
                    navigate("/dashboard/permission");
                });
            } else if (response.status === 204) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Permission with this Role and Module already exists.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again later.',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again later.',
            });
        }
    }

    async function updatePermission() {
        try {
            const updateData = {
                roleId,
                moduleId,
                can_read: canRead ? 1 : 0,
                can_write: canWrite ? 1 : 0,
            };
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/permission/${permissionId}`, updateData);

            if (response.status === 200) { // Check for correct status code
                Swal.fire({
                    icon: 'success',
                    title: 'Permission Updated',
                    text: 'Permission updated successfully',
                }).then(() => {
                    navigate("/dashboard/permission");
                });
            } else if (response.status === 201) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Permission with this Role and Module already exists.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again later.',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again later.',
            });
        }
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 p-4">
            <div className="container max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-4">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={collectData}>
                    <h2 className="text-2xl font-bold mb-6 text-center">{permissionId ? 'Update Permission' : 'Create Permission'}</h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                            Role
                        </label>
                        <select
                            id="role"
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.roleId ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.roleName}
                                </option>
                            ))}
                        </select>
                        {errors.roleId && <p className="text-red-500 text-xs italic">{errors.roleId}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="module">
                            Module
                        </label>
                        <select
                            id="module"
                            value={moduleId}
                            onChange={(e) => setModuleId(e.target.value)}
                            className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.moduleId ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select Module</option>
                            {modules.map((module) => (
                                <option key={module.id} value={module.id}>
                                    {module.moduleName}
                                </option>
                            ))}
                        </select>
                        {errors.moduleId && <p className="text-red-500 text-xs italic">{errors.moduleId}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="inline-flex items-center text-gray-700 text-sm font-bold">
                            <input
                                type="checkbox"
                                checked={canRead}
                                onChange={(e) => setCanRead(e.target.checked)}
                                className="form-checkbox text-blue-600"
                            />
                            <span className="ml-2">Can Read</span>
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="inline-flex items-center text-gray-700 text-sm font-bold">
                            <input
                                type="checkbox"
                                checked={canWrite}
                                onChange={(e) => setCanWrite(e.target.checked)}
                                className="form-checkbox text-blue-600"
                            />
                            <span className="ml-2">Can Write</span>
                        </label>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
                            type="submit"
                        >
                            {permissionId ? 'Update Permission' : 'Add Permission'}
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => navigate("/dashboard/permission")}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}