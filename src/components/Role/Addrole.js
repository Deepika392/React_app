import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';

export function  Addrole() {
  const [roleName, setRoleName] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { roleId } = useParams();

  const validateForm = () => {
    let errors = {};
    if (!roleName.trim()) {
        errors.roleName = 'Role Name is required';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
};


  const collectData = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
        if (!roleId) {
            addRole();
        } else {
            updateRole(roleId);
        }
    }
};

useEffect(() => {
    if (roleId) {
        fetchRole(roleId);
    }
}, [roleId]);
  
const addRole = async () => {
    try {
       

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/role`, {
            roleName
        });

        if (response.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Role Added',
                text: 'Role registered successfully',
            }).then(() => {
                navigate("/dashboard/role");
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

const fetchRole = async (roleId) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/role/${roleId}`);
        setRoleName(response.data.roleName);
      
    } catch (error) {
        console.error('Error fetching role:', error);
    }
};

const updateRole = async (roleId) => {
    try {
        const roledata = {
            roleName
        };
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/role/${roleId}`, roledata);
        if (response.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Role updated',
                text: 'Role updated successfully',
            }).then(() => {
                navigate("/dashboard/role");
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
    <>
    <div className="container mx-auto p-4">
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={collectData}>
    
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
            Role Name
            </label>
            <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.firstname ? 'border-red-500' : ''}`}
                id="rolename"
                type="text"
                value={roleName}
                placeholder="Enter role name"
                onChange={(e) => setRoleName(e.target.value)}
            />
            {errors.roleName && <p className="text-red-500 text-xs italic">{errors.roleName}</p>}
        </div>
        <div className="flex items-center space-x-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        {roleId ? 'Update Role' : 'Add Role'}
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
};


