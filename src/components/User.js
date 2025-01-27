import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

export function User() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(Number(process.env.REACT_APP_PAGE_SIZE)); // Initialize with environment variable
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [currentPage, pageSize, searchTerm]); // Include searchTerm in dependencies to trigger search on change

    async function fetchUsers() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`);
            const totalUsers = response.data.length;
            setTotalPages(Math.ceil(totalUsers / pageSize));

            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalUsers);

            const filteredUsers = response.data.filter(user =>
                user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const usersForCurrentPage = filteredUsers.slice(startIndex, endIndex);
            setUsers(usersForCurrentPage);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this user!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${process.env.REACT_APP_API_URL}/user/${userId}`)
                    .then(response => {
                        Swal.fire(
                            'Deleted!',
                            'User has been deleted.',
                            'success'
                        );
                        fetchUsers(); // Fetch updated users after deletion
                    })
                    .catch(error => {
                        console.error('Error deleting user:', error);
                        Swal.fire(
                            'Error!',
                            'Failed to delete user.',
                            'error'
                        );
                    });
            }
        });
    };

    const columns = [
        {
            name: 'Role',
            selector: 'role',
            sortable: false,
            cell: row => <div className="text-gray-600  ">{row.role}</div>
        },
        {
            name: 'Name',
            selector: 'firstName',
            sortable: false,
            cell: row => <div className="text-gray-600 ">{row.firstName} {row.lastName}</div>
        },
        {
            name: 'Email',
            selector: 'email',
            sortable: false,
            cell: row => <div className="text-gray-600 ">{row.email}</div>
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex">
                <Link to={`/dashboard/adduser/${row.id}`} className="mr-2 text-blue-500 hover:text-blue-700">
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

    return (
        <div className="container mx-auto p-4">
            <div className="container mx-auto p-4 flex items-center justify-between">
                <h1 className="text-3xl font-bold">User </h1>
                <Link to='/dashboard/adduser'>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add User
                    </button>
                </Link>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Role, Name, or Email"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <DataTable
                columns={columns}
                data={users}
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
