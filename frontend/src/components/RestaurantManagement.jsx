// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchRestaurants,
//   createRestaurant,
//   updateRestaurant,
//   deleteRestaurant,
//   clearError
// } from '../store/slices/restaurantSlice';

// const RestaurantManagement = () => {
//   const dispatch = useDispatch();
//   const { restaurants, status, error } = useSelector((state) => state.restaurant);
//   const [formData, setFormData] = useState({
//     name: '',
//     address: '',
//     city: '',
//     phone: '',
//     email: '',
//     description: '',
//     openingHours: ''
//   });
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     dispatch(fetchRestaurants());
//   }, [dispatch]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (editingId) {
//       await dispatch(updateRestaurant({ id: editingId, data: formData }));
//     } else {
//       await dispatch(createRestaurant(formData));
//     }
//     resetForm();
//   };

//   const handleEdit = (restaurant) => {
//     setEditingId(restaurant._id);
//     setFormData({
//       name: restaurant.name,
//       address: restaurant.address,
//       city: restaurant.city,
//       phone: restaurant.phone,
//       email: restaurant.email,
//       description: restaurant.description || '',
//       openingHours: restaurant.openingHours
//     });
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this restaurant?')) {
//       await dispatch(deleteRestaurant(id));
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       address: '',
//       city: '',
//       phone: '',
//       email: '',
//       description: '',
//       openingHours: ''
//     });
//     setEditingId(null);
//   };

//   if (error) {
//     setTimeout(() => dispatch(clearError()), 5000);
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Restaurant Management</h1>
      
//       {/* Form */}
//       <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Name
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </label>
//           </div>
//           <div>
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Address
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </label>
//           </div>
//           <div>
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               City
//               <input
//                 type="text"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleInputChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </label>
//           </div>
//           <div>
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Phone
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </label>
//           </div>
//           <div>
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Email
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </label>
//           </div>
//           <div>
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Opening Hours
//               <input
//                 type="text"
//                 name="openingHours"
//                 value={formData.openingHours}
//                 onChange={handleInputChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//                 placeholder="e.g., Mon-Fri: 9AM-10PM"
//               />
//             </label>
//           </div>
//           <div className="col-span-2">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Description
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 rows="3"
//               />
//             </label>
//           </div>
//         </div>
        
//         <div className="flex items-center justify-between mt-4">
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             {editingId ? 'Update Restaurant' : 'Add Restaurant'}
//           </button>
//           {editingId && (
//             <button
//               type="button"
//               onClick={resetForm}
//               className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Cancel Edit
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Status and Error Messages */}
//       {status === 'loading' && (
//         <div className="text-center py-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//         </div>
//       )}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {error}
//         </div>
//       )}

//       {/* Restaurants List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {restaurants.map((restaurant) => (
//           <div key={restaurant._id} className="bg-white shadow-md rounded-lg p-6">
//             <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
//             <p className="text-gray-600 mb-2">{restaurant.address}, {restaurant.city}</p>
//             <p className="text-gray-600 mb-2">{restaurant.phone}</p>
//             <p className="text-gray-600 mb-2">{restaurant.email}</p>
//             <p className="text-gray-600 mb-2">{restaurant.openingHours}</p>
//             {restaurant.description && (
//               <p className="text-gray-600 mb-4">{restaurant.description}</p>
//             )}
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => handleEdit(restaurant)}
//                 className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(restaurant._id)}
//                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RestaurantManagement; 