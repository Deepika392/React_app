import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { checkModulePermission } from './../common/api'; 

export function Role() {
    const [roles, setRole] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(Number(process.env.REACT_APP_PAGE_SIZE)); // Initialize with environment variable
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [canWrite, setCanWrite] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);


    useEffect(() => {
        checkPermission();
        fetchRole();
    }, [currentPage, pageSize, searchTerm]); 

    async function fetchRole() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/role`);
            const totalRoles = response.data.length;
            setTotalPages(Math.ceil(totalRoles / pageSize));

            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalRoles);

            const filteredRoles = response.data.filter(role =>
                role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const rolesForCurrentPage = filteredRoles.slice(startIndex, endIndex);
            setRole(rolesForCurrentPage);
        } catch (error) {
            console.error('Error fetching role:', error);
        }
    }

    async function checkPermission() {
        try {
            let moduleId = 2;
            const permissionData = await checkModulePermission(moduleId);
            setCanWrite(permissionData.can_write === 1);
            setCanEdit(permissionData.can_edit === 1);
            setCanDelete(permissionData.can_delete === 1);
        } catch (error) {
            console.error('Error fetching permission data:', error);
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const columns = [
        {
            name: 'Role',
            selector: 'role',
            sortable: false,
            cell: row => <div className="text-gray-600">{row.roleName}</div>
        },
        (canEdit || canDelete) && { // Conditionally add the "Actions" column
            name: 'Actions',
            cell: row => (
                <div className="flex">
                    {canEdit && (

                        <Link to={`/dashboard/addrole/${row.id}`} className="mr-2 text-blue-500 hover:text-blue-700">
                            <FaEdit className="text-xl" />
                        </Link>
                    )}
                    {canDelete && (
                        <button
                            onClick={() => handleDelete(row.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <FaTrash className="text-xl" />
                        </button>
                    )}
                </div>
            )
        }
    ].filter(column => column !== false); // Filter out any false values
    const customStyles = {
        headCells: {
            style: {
                textAlign: 'center',
            },
        },
    };

    const handleDelete = async (id) => {
        try {
            // Show confirmation dialog
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });
    
         
            if (result.isConfirmed) {
                // Fetch the permissions associated with the role
                let  permissions = await axios.get(`${process.env.REACT_APP_API_URL}/permission/role/${id}`);

              
                
                // Check if the role is associated with any users
                let roleDetails  = await axios.get(`${process.env.REACT_APP_API_URL}/user/role/${id}`);
                console.log('roleDetails',roleDetails);
                if ( roleDetails && roleDetails.data && roleDetails.data.length > 0) {
                    console.log('');
                    Swal.fire(
                        'Error!',
                        'This role is associated with users and cannot be deleted.',
                        'error'
                    );
                    return; // Abort deletion
                }
    
                // Delete permissions if they exist
                if (permissions && permissions.data && permissions.data.length > 0) {
                    await deletePermissions(permissions.data.map(permission => permission.id));
                }
    
                // Delete the role
                await axios.delete(`${process.env.REACT_APP_API_URL}/role/${id}`);
    
                // Notify the user of success
                await Swal.fire('Deleted!', 'Your role and associated permissions have been deleted.', 'success');
    
                // Refresh roles after deletion
                fetchRole();
            }
        } catch (error) {
            console.error('Error::', error);
            Swal.fire('Error!', 'There was an error deleting the role and/or permissions.', 'error');
        }
    };
    
    const deletePermissions = async (permissions) => {
        try {
            console.log('in deletePersimsiion bulk');
            const deleteRequests = permissions.map(permissionId => axios.delete(`${process.env.REACT_APP_API_URL}/permission/${permissionId}`));
            await Promise.all(deleteRequests);
        } catch (error) {
            console.error('Error deletePermissions:', error);
            Swal.fire('Error', 'Failed to deletePermissions.', 'error');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="container mx-auto p-4 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Role </h1>
                {canWrite && (
                <Link to='/dashboard/addrole'>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add Role
                    </button>
                </Link>
                )}
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Role Name"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <DataTable
                columns={columns}
                data={roles}
                pagination
                paginationServer
                paginationTotalRows={totalPages * pageSize}
                paginationPerPage={pageSize}
                paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                    setPageSize(currentRowsPerPage);
                    setCurrentPage(currentPage);
                }}
                paginationDefaultPage={currentPage}
                onChangePage={handlePageChange}
                customStyles={customStyles} 
            />
        </div>
    );
}
