import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001')
      .then(result => setUsers(result.data))
      .catch(err => console.log(err))
  }, [])

  const handleDelete = (id) => {
    axios.delete('http://localhost:3001/deleteUser/' + id)  
      .then(res => {
        console.log(res)
        setUsers(users.filter(user => user._id !== id)) // avoid reload
      })
      .catch(err => console.log(err))
  }

  return (
    // <div>
    //   <button onClick={()=><Link to="/">Logout</Link>}</button>
    // </div>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 p-6">
      
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">


        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">User Management</h1>
          <Link 
            to="/createUser" 
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition">
            Add User
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Age</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">{user.name}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">{user.age}</td>
                    <td className="px-6 py-3 text-center space-x-2">
                      <Link 
                        to={`/updateUser/${user._id}`} 
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition">
                        Update
                      </Link>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No users found 👤
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
      <Link to="/login"><button className='fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow'>Logout</button></Link>
    </div>
  )
}

export default Users
