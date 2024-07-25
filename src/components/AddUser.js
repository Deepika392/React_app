import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';

export function AddUser() {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        if (userId) {
          fetchUser(userId);
        }
      }, [userId]);

    useEffect(() => {
        // Fetch options (if needed) or set them directly here
        setOptions([
            { key: '1', value: 'USERADMIN', label: 'User Admin' },
            { key: '2', value: 'SALESADMIN', label: 'Sales Admin' },
            { key: '3', value: 'REPORTADMIN', label: 'Report Admin' }
        ]);
    }, []);

    const fetchUser = async (userId) => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`);
          setFirstname(response.data.firstName);
          setLastname(response.data.lastName);
          setEmail(response.data.email);
          setUsername(response.data.username);
          setSelectedOption(response.data.role);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!firstname.trim()) {
            errors.firstname = 'First Name is required';
        }
        if (!lastname.trim()) {
            errors.lastname = 'Last Name is required';
        }
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }
        if (!username.trim()) {
            errors.username = 'User name is required';
        }
        if (!selectedOption) {
            errors.selectedOption = 'Role is required';
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
                role: selectedOption
            });
            if (response.statusText == "Created") {
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
                role: selectedOption
            };
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/${userId}`, userdata);
            if (response.statusText == "OK") {
                Swal.fire({
                    icon: 'success',
                    title: 'User updated',
                    text: 'User updated successfully',
                }).then(() => {
                    navigate("/dashboard/user");
                });
            }
            else{
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
        <>
            <div className="container mx-auto p-4">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={collectData}>
                    <div className="mb-4">
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
                        />
                        {errors.firstname && <p className="text-red-500 text-xs italic">{errors.firstname}</p>}
                    </div>
                    <div className="mb-4">
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
                        />
                        {errors.lastname && <p className="text-red-500 text-xs italic">{errors.lastname}</p>}
                    </div>
                    <div className="mb-4">
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
                        />
                        {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
                    </div>
                    <div className="mb-4">
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
                        />
                        {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                            Role
                        </label>
                        <select
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.selectedOption ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select a Role</option>
                            {options.map(option => (
                                <option key={option.key} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        {errors.selectedOption && <p className="text-red-500 text-xs italic">{errors.selectedOption}</p>}
                    </div>
                    <div className="flex items-center  space-x-4">
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
        </>
    );
}
