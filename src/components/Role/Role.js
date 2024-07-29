import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

export function Role() {
    const [roles, setRole] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(Number(process.env.REACT_APP_PAGE_SIZE)); // Initialize with environment variable
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRole();
    }, [currentPage, pageSize, searchTerm]); // Include searchTerm in dependencies to trigger search on change

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // const handleDelete = (roleId) => {
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: 'You will not be able to recover this role!',
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, delete it!'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             axios.delete(`${process.env.REACT_APP_API_URL}/user/${userId}`)
    //                 .then(response => {
    //                     Swal.fire(
    //                         'Deleted!',
    //                         'User has been deleted.',
    //                         'success'
    //                     );
    //                     fetchUsers(); // Fetch updated users after deletion
    //                 })
    //                 .catch(error => {
    //                     console.error('Error deleting user:', error);
    //                     Swal.fire(
    //                         'Error!',
    //                         'Failed to delete user.',
    //                         'error'
    //                     );
    //                 });
    //         }
    //     });
    // };

    const columns = [
        {
            name: 'Role',
            selector: 'role',
            sortable: false,
            cell: row => <div className="text-gray-600  ">{row.roleName}</div>
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex">
                <Link to={`/dashboard/addrole/${row.id}`} className="mr-2 text-blue-500 hover:text-blue-700">
                    <FaEdit className="text-xl" />
                </Link>
                <button
                   
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

    return (
        <div className="container mx-auto p-4">
            <div className="container mx-auto p-4 flex items-center justify-between">
                <h1 className="text-3xl font-bold">User </h1>
                <Link to='/dashboard/addrole'>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add Role
                    </button>
                </Link>
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
                customStyles={customStyles} // Apply custom styles
            />
        </div>
    );
}
