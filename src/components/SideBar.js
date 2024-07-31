import { FcBullish } from "react-icons/fc";
import { Link } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineViewGridAdd,
  HiOutlinePlusSm
} from 'react-icons/hi';
import React, { useState, useEffect } from 'react';

const linkClass =
  'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base';

export function SideBar() {
  const [roleArray, setRoleArray] = useState([]);

  useEffect(() => {
    let token = localStorage.getItem('token');
    token = JSON.parse(token);
    let userRole = token ? token.role : '';

    if (userRole === 'SUPERADMIN') {
      setRoleArray([
        {
          key: 'dashboard',
          label: 'Dashboard',
          path: '/dashboard',
          icon: <HiOutlineViewGrid />
        },
        {
          key: 'role',
          label: 'Role',
          path: '/dashboard/role',
          icon: <HiOutlinePlusSm />
        },
        {
          key: 'persmission',
          label: 'Persmission',
          path: '/dashboard/permission',
          icon: <HiOutlinePlusSm />
        },
        {
          key: 'users',
          label: 'Users',
          path: '/dashboard/user',
          icon: <HiOutlineUsers />
        },
        {
          key: 'category',
          label: 'Category',
          path: '/dashboard/category',
          icon: <HiOutlineViewGridAdd />
        },
        {
          key: 'product',
          label: 'Product',
          path: '/dashboard/product',
          icon: <HiOutlinePlusSm />
        }
      ]);
    } else if (userRole === 'SALESADMIN') {
      setRoleArray([
        {
          key: 'dashboard',
          label: 'Dashboard',
          path: '/dashboard',
          icon: <HiOutlineViewGrid />
        },
        {
          key: 'category',
          label: 'Category',
          path: '/dashboard/category',
          icon: <HiOutlineViewGridAdd />
        },
        {
          key: 'product',
          label: 'Product',
          path: '/dashboard/product',
          icon: <HiOutlinePlusSm />
        }
      ]);
    }
  }, []);

  return (
    <div className="bg-neutral-900 w-60 p-3 flex flex-col text-white">
      <div className="flex items-center gap-2 px-1 py-3">
        <FcBullish fontSize={30} />
        <span className="text-neutral-100">User Management</span>
      </div>
      <div className="flex-1">
        {roleArray.map((link, i) => (
          <SidebarLink key={link.key} link={link} />
        ))}
      </div>
    </div>
  );
}

function SidebarLink({ link }) {
  return (
    <Link to={link.path} className={linkClass}>
      <span className="text-xl">{link.icon}</span>
      {link.label}
    </Link>
  );
}


