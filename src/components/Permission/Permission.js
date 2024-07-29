import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

export function Permission() {
    const [permissions, setPermission] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(Number(process.env.REACT_APP_PAGE_SIZE)); // Initialize with environment variable
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        fetchPermission();
    }, [currentPage, pageSize, searchTerm]);

    async function fetchPermission() {
        try {

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/permission/`);
            const totalPermissions = response.data.length;
            setTotalPages(Math.ceil(totalPermissions / pageSize));

            // Apply search filter
            const filteredPermissions = response.data.filter(permission =>
                permission.Module.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                permission.Role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalPermissions);

            const permissionsForCurrentPage = filteredPermissions.slice(startIndex, endIndex);
            setPermission(permissionsForCurrentPage);
        } catch (error) {
            console.error('Error fetching permission:', error);
        }
    }

    const handleDelete = async (permissionId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this permission!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {

                await axios.delete(`${process.env.REACT_APP_API_URL}/permission/${permissionId}`);
                Swal.fire(
                    'Deleted!',
                    'Permission has been deleted.',
                    'success'
                );
                fetchPermission(); // Refresh products after deletion
            }
        } catch (error) {
            console.error('Error deleting permission:', error);
            Swal.fire(
                'Error!',
                'Failed to delete permission.',
                'error'
            );
        }
    };

    const columns = [

        {
            name: 'Role',
            selector: 'Role.roleName',
            sortable: false,
            cell: row => <div className="text-gray-600">{row.Role.roleName}</div>
        },
        {
            name: 'Module',
            selector: 'module',
            sortable: false,
            cell: row => <div className="text-gray-600">{row.Module.moduleName}</div>
        },
        {
            name: 'Can Read',
            selector: 'can_read',
            sortable: false,
            cell: row => <div className="text-gray-600">{row.can_read ? 'Yes' : 'No'}</div>
        },
        {
            name: 'Can Write',
            selector: 'can_write',
            sortable: false,
            cell: row => <div className="text-gray-600">{row.can_write ? 'Yes' : 'No'}</div>
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex">
                    <Link to={`/dashboard/addpermission/${row.id}`} className="mr-2 text-blue-500 hover:text-blue-700">
                        <FaEdit className="text-xl" />
                    </Link>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <FaTrash className="text-xl" />
                    </button>
                </div>
            )
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                textAlign: 'center',
            },
        },
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (<>


        <div className="container mx-auto p-4">
            <div className="container mx-auto p-4 flex items-center justify-between">
                <h1 className="p-4 mr-4 text-3xl font-bold">Permission</h1>
                <div className="p-4">
                    <Link to='/dashboard/addpermission'>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Permission
                        </button>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto p-4">
                <input
                    type="text"
                    placeholder="Search by Role, Module"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                />
            </div>

            <DataTable
                columns={columns}
                data={permissions}
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
    </>
    );
}
