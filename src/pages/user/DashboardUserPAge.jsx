// import { useState } from 'react';
// import { 
//   ChevronDown, 
//   Menu, 
//   X, 
//   Building2, 
//   Package, 
//   Percent, 
//   Users, 
//   Calculator, 
//   Truck, 
//   DollarSign, 
//   Calendar, 
//   Shield, 
//   PieChart,
//   TrendingUp,
//   TrendingDown,
//   Eye,
//   Bell,
//   Search,
//   MoreVertical,
//   ArrowUpRight,
//   ArrowDownRight,
//   Home,
//   Target,
//   Clock
// } from 'lucide-react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// // Navbar Component
// function PegadaianNavbar() {
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const menuItems = [
//     {
//       title: 'Bisnis',
//       icon: <Building2 className="w-4 h-4" />,
//       submenu: [
//         { name: 'Produk', icon: <Package className="w-4 h-4" />, href: '/bisnis/produk' },
//         { name: 'Daftar Promosi', icon: <Percent className="w-4 h-4" />, href: '/bisnis/promosi' },
//         { name: 'Agen', icon: <Users className="w-4 h-4" />, href: '/bisnis/agen' },
//         { name: 'Simulasi Produk', icon: <Calculator className="w-4 h-4" />, href: '/bisnis/simulasi' }
//       ]
//     },
//     {
//       title: 'Logistik',
//       icon: <Truck className="w-4 h-4" />,
//       submenu: [
//         { name: 'Keuangan', icon: <DollarSign className="w-4 h-4" />, href: '/logistik/keuangan' }
//       ]
//     },
//     {
//       title: 'SDM',
//       icon: <Users className="w-4 h-4" />,
//       submenu: [
//         { name: 'Cuti', icon: <Calendar className="w-4 h-4" />, href: '/sdm/cuti' }
//       ]
//     },
//     {
//       title: 'Resiko',
//       icon: <Shield className="w-4 h-4" />,
//       href: '/resiko'
//     },
//     {
//       title: 'Keuangan',
//       icon: <PieChart className="w-4 h-4" />,
//       href: '/keuangan'
//     }
//   ];

//   const toggleDropdown = (index) => {
//     setActiveDropdown(activeDropdown === index ? null : index);
//   };

//   const handleMenuClick = (item) => {
//     if (item.href) {
//       console.log('Navigate to:', item.href);
//     }
//   };

//   return (
//     <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <div className="flex-shrink-0 flex items-center">
//               <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">P</span>
//               </div>
//               <span className="ml-3 text-xl font-bold text-gray-800">PT Pegadaian</span>
//             </div>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-1">
//               {menuItems.map((item, index) => (
//                 <div key={index} className="relative group">
//                   {item.submenu ? (
//                     <>
//                       <button
//                         onClick={() => toggleDropdown(index)}
//                         className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
//                       >
//                         {item.icon}
//                         <span className="ml-2">{item.title}</span>
//                         <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${
//                           activeDropdown === index ? 'rotate-180' : ''
//                         }`} />
//                       </button>

//                       {activeDropdown === index && (
//                         <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
//                           {item.submenu.map((subItem, subIndex) => (
//                             <button
//                               key={subIndex}
//                               onClick={() => handleMenuClick(subItem)}
//                               className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-150"
//                             >
//                               {subItem.icon}
//                               <span className="ml-3">{subItem.name}</span>
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <button
//                       onClick={() => handleMenuClick(item)}
//                       className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
//                     >
//                       {item.icon}
//                       <span className="ml-2">{item.title}</span>
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* User Profile & Mobile Menu */}
//           <div className="flex items-center space-x-4">
//             <div className="hidden md:flex items-center space-x-4">
//               <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Bell className="w-5 h-5" />
//               </button>
//               <div className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                   <span className="text-white text-sm font-medium">JD</span>
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">John Doe</span>
//               </div>
//             </div>

//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-yellow-600 hover:bg-gray-50 transition-colors duration-150"
//             >
//               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-gray-100 py-4">
//             <div className="space-y-2">
//               {menuItems.map((item, index) => (
//                 <div key={index}>
//                   {item.submenu ? (
//                     <>
//                       <button
//                         onClick={() => toggleDropdown(index)}
//                         className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
//                       >
//                         <div className="flex items-center">
//                           {item.icon}
//                           <span className="ml-3 font-medium">{item.title}</span>
//                         </div>
//                         <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
//                           activeDropdown === index ? 'rotate-180' : ''
//                         }`} />
//                       </button>
                      
//                       {activeDropdown === index && (
//                         <div className="ml-8 mt-2 space-y-1">
//                           {item.submenu.map((subItem, subIndex) => (
//                             <button
//                               key={subIndex}
//                               onClick={() => handleMenuClick(subItem)}
//                               className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-150"
//                             >
//                               {subItem.icon}
//                               <span className="ml-3">{subItem.name}</span>
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <button
//                       onClick={() => handleMenuClick(item)}
//                       className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
//                     >
//                       {item.icon}
//                       <span className="ml-3 font-medium">{item.title}</span>
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {activeDropdown !== null && (
//         <div 
//           className="fixed inset-0 z-40" 
//           onClick={() => setActiveDropdown(null)}
//         />
//       )}
//     </nav>
//   );
// }

// // Main Dashboard Component
// export default function PegadaianDashboard() {
//   // Sample data
//   const revenueData = [
//     { month: 'Jan', revenue: 45, target: 50 },
//     { month: 'Feb', revenue: 52, target: 55 },
//     { month: 'Mar', revenue: 48, target: 52 },
//     { month: 'Apr', revenue: 61, target: 58 },
//     { month: 'May', revenue: 55, target: 60 },
//     { month: 'Jun', revenue: 67, target: 65 },
//   ];

//   const productData = [
//     { name: 'Gadai Emas', value: 45, color: '#f59e0b' },
//     { name: 'Kredit Cepat', value: 25, color: '#3b82f6' },
//     { name: 'Tabungan Emas', value: 20, color: '#10b981' },
//     { name: 'Lainnya', value: 10, color: '#6b7280' },
//   ];

//   const stats = [
//     {
//       title: 'Total Nasabah',
//       value: '24,563',
//       change: '+12.5%',
//       changeType: 'increase',
//       icon: <Users className="w-6 h-6 text-blue-600" />
//     },
//     {
//       title: 'Pendapatan Bulan Ini',
//       value: 'Rp 67.2M',
//       change: '+8.2%',
//       changeType: 'increase',
//       icon: <DollarSign className="w-6 h-6 text-green-600" />
//     },
//     {
//       title: 'Produk Aktif',
//       value: '1,247',
//       change: '-2.1%',
//       changeType: 'decrease',
//       icon: <Package className="w-6 h-6 text-orange-600" />
//     },
//     {
//       title: 'Tingkat Kepuasan',
//       value: '94.8%',
//       change: '+1.2%',
//       changeType: 'increase',
//       icon: <TrendingUp className="w-6 h-6 text-purple-600" />
//     }
//   ];

//   const recentActivities = [
//     { id: 1, action: 'Gadai emas 50 gram', user: 'Ahmad Suryadi', time: '5 menit lalu', amount: 'Rp 28.5M', type: 'gadai' },
//     { id: 2, action: 'Pelunasan kredit', user: 'Siti Nurhaliza', time: '12 menit lalu', amount: 'Rp 15.2M', type: 'lunas' },
//     { id: 3, action: 'Pembukaan tabungan emas', user: 'Budi Santoso', time: '18 menit lalu', amount: 'Rp 5.0M', type: 'tabungan' },
//     { id: 4, action: 'Perpanjangan gadai', user: 'Maya Sari', time: '25 menit lalu', amount: 'Rp 12.8M', type: 'perpanjang' },
//     { id: 5, action: 'Pencairan kredit', user: 'Doni Prasetyo', time: '32 menit lagu', amount: 'Rp 35.0M', type: 'kredit' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navbar */}
//       <PegadaianNavbar />
      
//       {/* Dashboard Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//               <p className="text-gray-600 mt-2">Selamat datang kembali, John! Berikut ringkasan aktivitas hari ini.</p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Cari transaksi..."
//                   className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                 />
//               </div>
//               <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium">
//                 Export Data
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, index) => (
//             <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between mb-4">
//                 {stat.icon}
//                 <div className={`flex items-center text-sm font-medium ${
//                   stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
//                 }`}>
//                   {stat.changeType === 'increase' ? (
//                     <ArrowUpRight className="w-4 h-4 mr-1" />
//                   ) : (
//                     <ArrowDownRight className="w-4 h-4 mr-1" />
//                   )}
//                   {stat.change}
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
//                 <p className="text-gray-600 text-sm">{stat.title}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//           {/* Revenue Chart */}
//           <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">Tren Pendapatan</h2>
//                 <p className="text-gray-600 text-sm mt-1">Perbandingan target vs realisasi (dalam miliar Rp)</p>
//               </div>
//               <button className="text-gray-400 hover:text-gray-600">
//                 <MoreVertical className="w-5 h-5" />
//               </button>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={revenueData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="month" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" />
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: '#fff', 
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px',
//                     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                   }}
//                 />
//                 <Line 
//                   type="monotone" 
//                   dataKey="revenue" 
//                   stroke="#f59e0b" 
//                   strokeWidth={3}
//                   dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
//                   name="Realisasi"
//                 />
//                 <Line 
//                   type="monotone" 
//                   dataKey="target" 
//                   stroke="#6b7280" 
//                   strokeWidth={2}
//                   strokeDasharray="5 5"
//                   dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
//                   name="Target"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Product Distribution */}
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">Distribusi Produk</h2>
//                 <p className="text-gray-600 text-sm mt-1">Berdasarkan volume transaksi</p>
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <RechartsPieChart>
//                 <Pie
//                   data={productData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={100}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {productData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </RechartsPieChart>
//             </ResponsiveContainer>
//             <div className="mt-4 space-y-2">
//               {productData.map((item, index) => (
//                 <div key={index} className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
//                     <span className="text-sm text-gray-600">{item.name}</span>
//                   </div>
//                   <span className="text-sm font-medium text-gray-900">{item.value}%</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Recent Activities */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">Aktivitas Terbaru</h2>
//               <p className="text-gray-600 text-sm mt-1">Transaksi dan aktivitas dalam 1 jam terakhir</p>
//             </div>
//             <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
//               Lihat Semua
//             </button>
//           </div>
//           <div className="space-y-4">
//             {recentActivities.map((activity) => (
//               <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                 <div className="flex items-center space-x-4">
//                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                     activity.type === 'gadai' ? 'bg-yellow-100 text-yellow-600' :
//                     activity.type === 'lunas' ? 'bg-green-100 text-green-600' :
//                     activity.type === 'tabungan' ? 'bg-blue-100 text-blue-600' :
//                     activity.type === 'perpanjang' ? 'bg-orange-100 text-orange-600' :
//                     'bg-purple-100 text-purple-600'
//                   }`}>
//                     {activity.type === 'gadai' && <Package className="w-5 h-5" />}
//                     {activity.type === 'lunas' && <Target className="w-5 h-5" />}
//                     {activity.type === 'tabungan' && <PieChart className="w-5 h-5" />}
//                     {activity.type === 'perpanjang' && <Clock className="w-5 h-5" />}
//                     {activity.type === 'kredit' && <DollarSign className="w-5 h-5" />}
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-900">{activity.action}</h4>
//                     <p className="text-sm text-gray-600">{activity.user}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-medium text-gray-900">{activity.amount}</p>
//                   <p className="text-sm text-gray-500">{activity.time}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }