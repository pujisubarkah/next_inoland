
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const AturRole = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]); // State for role list
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [editUser, setEditUser] = useState(null); // State for selected user to edit
    const [selectedRoleId, setSelectedRoleId] = useState(null); // State for selected role in modal
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // Fetch users
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select(`
                    id, 
                    nama_lengkap, 
                    email, 
                    instansi, 
                    role:role_id (role_name)
                `);

            // Fetch roles
            const { data: rolesData, error: rolesError } = await supabase
                .from('role')
                .select('*');

            if (usersError || rolesError) {
                console.error('Error fetching data:', usersError || rolesError);
            } else {
                setUsers(usersData);
                setRoles(rolesData);
            }

            setIsLoading(false);
        };

        fetchData();
    }, []);

    // Pagination handler
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Open edit modal
    const handleEditClick = (user) => {
        setEditUser(user);
        setSelectedRoleId(user.role?.id || null); // Set current role in modal
    };

    // Close edit modal
    const handleCloseEdit = () => {
        setEditUser(null);
        setSelectedRoleId(null);
    };

    // Handle role change
    const handleRoleChange = async () => {
        if (!editUser || !selectedRoleId) return;

        const { error } = await supabase
            .from('users')
            .update({ role_id: selectedRoleId }) // Update role_id
            .eq('id', editUser.id);

        if (error) {
            console.error('Error updating role:', error);
            alert('Gagal mengubah role pengguna.');
        } else {
            // Update role locally
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === editUser.id
                        ? { ...user, role: { role_name: roles.find((role) => role.id === selectedRoleId).role_name } }
                        : user
                )
            );
            alert('Role berhasil diubah.');
            handleCloseEdit(); // Close modal
        }
    };

    // Fungsi Delete
    const handleDeleteUser = async (id) => {
        const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?');
        if (!confirmDelete) return;

        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id); // Hapus pengguna berdasarkan ID

            if (error) {
                console.error('Error deleting user:', error);
                alert('Gagal menghapus pengguna.');
            } else {
                // Hapus pengguna dari state lokal
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                alert('Pengguna berhasil dihapus.');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('Terjadi kesalahan saat menghapus pengguna.');
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    return (
        <div className="w-full mt-24">
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', fontSize: '2rem', textAlign: 'center', margin: '20px 0 10px 0' }}>
      User List
    </h1>
    <hr style={{ width: '100px', border: 'none', height: '2px', background: 'linear-gradient(to right, red, black, red)', margin: '0 auto 20px auto' }} />
    
            {/* Table */}
            <div className="w-full flex justify-center mt-16">
                {isLoading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <table className="border-collapse table-auto w-11/12 text-sm self-center">
                        <thead>
                            <tr>
                                <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">No</th>
                                <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">Nama</th>
                                <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">Email</th>
                                <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">Instansi</th>
                                <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">Role</th>
                                <th className="border-b text-base font-medium p-4 text-slate-400 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="border-b p-4 font-bold">{indexOfFirstItem + index + 1}</td>
                                        <td className="border-b p-4 font-bold">{user.nama_lengkap}</td>
                                        <td className="border-b p-4 font-bold">{user.email}</td>
                                        <td className="border-b p-4 font-bold">{user.instansi}</td>
                                        <td className="border-b p-4 font-bold">{user.role?.role_name}</td>
                                        <td className="border-b p-4 font-bold flex space-x-4">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="text-blue-600 hover:text-blue-500"
                                                aria-label="Edit"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-500"
                                                aria-label="Delete"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-4">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 items-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="mx-2">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Edit Role Modal */}
            {editUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h3 className="text-lg font-bold mb-4">Edit Role for {editUser.nama_lengkap}</h3>
                        <select
                            className="w-full p-2 border rounded mb-4"
                            value={selectedRoleId || ''}
                            onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                        >
                            <option value="" disabled>
                                Select a role
                            </option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCloseEdit}
                                className="bg-red-500 text-white py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRoleChange}
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                            >
                                Rubah
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
       );
};

export default AturRole;
