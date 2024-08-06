import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';

export function AddUser() {
    let authToken = localStorage.getItem('authToken');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { userId } = useParams();

    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        if (userId) {
            fetchUser(userId);
        }
    }, [userId]);

    useEffect(() => {
        getRole();
    }, []);

    const getRole = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/role`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`, 
                    'Content-Type': 'application/json'
                }
            });
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    }

    const fetchUser = async (userId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`,{
                headers: {
                    'Authorization': `Bearer ${authToken}`, 
                    'Content-Type': 'application/json'
                }
            });
            setFirstname(response.data.firstName);
            setLastname(response.data.lastName);
            setEmail(response.data.email);
            setUsername(response.data.username);
            setRoleId(response.data.roleId); // Set the roleId based on fetched user data
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!firstname.trim()) {
            errors.firstname = 'First Name is required';
        } else if (firstname.length > 50) {
            errors.firstname = 'First Name cannot exceed 50 characters';
        }
        if (!lastname.trim()) {
            errors.lastname = 'Last Name is required';
        } else if (lastname.length > 50) {
            errors.lastname = 'Last Name cannot exceed 50 characters';
        }
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (email.length > 60) {
            errors.email = 'Email cannot exceed 60 characters';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }
        if (!username.trim()) {
            errors.username = 'User Name is required';
        } else if (username.length > 50) {
            errors.username = 'User Name cannot exceed 50 characters';
        }
        if (!roleId) {
            errors.roleId = 'Role is required';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const collectData = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            if (!userId) {
                addUser();
            } else {
                updateUser(userId);
            }
        }
    };

    const addUser = async () => {
        try {
           
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user`, {
                firstName: firstname,
                lastName: lastname,
                email: email,
                username: username,
                roleId: roleId
            },{
                headers: {
                    'Authorization': `Bearer ${authToken}`, 
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'User Added',
                    text: 'User registered successfully',
                }).then(() => {
                    navigate("/dashboard/user");
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
        }
    };

    const updateUser = async (userId) => {
        try {
            const userdata = {
                firstName: firstname,
                lastName: lastname,
                email: email,
                roleId: roleId
            };
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/${userId}`, userdata,{
                headers: {
                    'Authorization': `Bearer ${authToken}`, 
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'User updated',
                    text: 'User updated successfully',
                }).then(() => {
                    navigate("/dashboard/user");
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
        }
    };

    return (
        <div className="container mx-auto p-4">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={collectData}>
                <div className="mb-4 relative">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
                        First Name
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.firstname ? 'border-red-500' : ''}`}
                        id="firstname"
                        type="text"
                        value={firstname}
                        placeholder="Enter first name"
                        onChange={(e) => setFirstname(e.target.value)}
                        maxLength="50" // Restrict input length
                    />
                    <p className="absolute top-0 right-0 text-gray-600 text-xs mt-2 mr-3">
                        {firstname.length}/50
                    </p>
                    {errors.firstname && <p className="text-red-500 text-xs italic">{errors.firstname}</p>}
                </div>
                <div className="mb-4 relative">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
                        Last Name
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.lastname ? 'border-red-500' : ''}`}
                        id="lastname"
                        type="text"
                        value={lastname}
                        placeholder="Enter last name"
                        onChange={(e) => setLastname(e.target.value)}
                        maxLength="50" // Restrict input length
                    />
                    <p className="absolute top-0 right-0 text-gray-600 text-xs mt-2 mr-3">
                        {lastname.length}/50
                    </p>
                    {errors.lastname && <p className="text-red-500 text-xs italic">{errors.lastname}</p>}
                </div>
                <div className="mb-4 relative">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        User Name
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'border-red-500' : ''}`}
                        id="username"
                        type="text"
                        value={username}
                        placeholder="Enter user name"
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength="50" // Restrict input length
                    />
                    <p className="absolute top-0 right-0 text-gray-600 text-xs mt-2 mr-3">
                        {username.length}/50
                    </p>
                    {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
                </div>
                <div className="mb-4 relative">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                        id="email"
                        type="email"
                        value={email}
                        placeholder="Enter email address"
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength="60" // Restrict input length
                    />
                    <p className="absolute top-0 right-0 text-gray-600 text-xs mt-2 mr-3">
                        {email.length}/60
                    </p>
                    {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        Role
                    </label>
                    <select
                        id="role"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.roleId ? 'border-red-500' : ''}`}
                    >
                        <option value="">Select Role</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.roleName}</option>
                        ))}
                    </select>
                    {errors.roleId && <p className="text-red-500 text-xs italic">{errors.roleId}</p>}
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        {userId ? 'Update User' : 'Add User'}
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => navigate("/dashboard/user")}
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
}
