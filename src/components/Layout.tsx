// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Activity } from 'lucide-react';

// export default function Layout() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Verificar si el usuario está logeado al cargar la página
//     const user = localStorage.getItem('user');
//     setIsLoggedIn(!!user); // Si hay datos en localStorage, el usuario está logeado
//   }, []);

//   const handleLogout = () => {
//     // Eliminar datos del usuario de localStorage
//     localStorage.removeItem('user');
//     setIsLoggedIn(false);
//     navigate('/login'); // Redirigir a la página de login
//   };

//   return (
//     <div className="min-h-screen bg-gray-900">
//       {/* Header */}
//       <header className="bg-gray-800 border-b border-gray-700 fixed w-full z-10">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex items-center group">
//             <Activity className="h-8 w-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
//             <h1 className="ml-2 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-blue-300 transition-colors">
//               GreenAir
//             </h1>
//           </Link>

//           {/* Buttons */}
//           <div className="flex items-center space-x-4">
//             {isLoggedIn ? (
//               <>
//                 <button
//                   onClick={() => navigate('/profile')}
//                   className="text-white bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-full transition-colors"
//                 >
//                   Mi Perfil
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="text-white bg-red-400 hover:bg-red-400 px-6 py-2 rounded-full transition-colors"
//                 >
//                   Log out
//                 </button>
//               </>
//             ) : (
//               <Link
//                 to="/login"
//                 className="text-white bg-emerald-400 hover:bg-emerald-300 px-6 py-2 rounded-full transition-colors"
//               >
//                 Log in
//               </Link>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-6 pt-24">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importamos el contexto
import { Activity } from 'lucide-react';

export default function Layout() {
  const { user, isLoggedIn, logout } = useAuth(); // Usamos el contexto
  console.log('Estado de isLoggedIn:', isLoggedIn);
  console.log('Usuario actual:', user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Cerramos sesión
    navigate('/login'); // Redirigimos a la página de login
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <Activity className="h-8 w-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
            <h1 className="ml-2 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-blue-300 transition-colors">
              GreenAir
            </h1>
          </Link>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-white bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-full transition-colors"
                >
                  Mi Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 hover:bg-red-400 px-6 py-2 rounded-full transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white bg-emerald-400 hover:bg-emerald-300 px-6 py-2 rounded-full transition-colors"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pt-24">
        <Outlet />
      </main>
    </div>
  );
}


// // import { Link, Outlet, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import { Activity } from 'lucide-react';

// // export default function Layout() {
// //   const { isLoggedIn, logout } = useAuth();
// //   const navigate = useNavigate();

// //   const handleLogout = () => {
// //     logout();
// //     navigate('/login');
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-900">
// //       <header className="bg-gray-800 border-b border-gray-700 fixed w-full z-10">
// //         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
// //           <Link to="/" className="flex items-center group">
// //             <Activity className="h-8 w-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
// //             <h1 className="ml-2 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-blue-300 transition-colors">
// //               GreenAir
// //             </h1>
// //           </Link>

// //           <div className="flex items-center space-x-4">
// //             {isLoggedIn ? (
// //               <>
// //                 <button
// //                   onClick={() => navigate('/profile')}
// //                   className="text-white bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-full transition-colors"
// //                 >
// //                   Mi Perfil
// //                 </button>
// //                 <button
// //                   onClick={handleLogout}
// //                   className="text-white bg-red-500 hover:bg-red-400 px-6 py-2 rounded-full transition-colors"
// //                 >
// //                   Log out
// //                 </button>
// //               </>
// //             ) : (
// //               <Link
// //                 to="/login"
// //                 className="text-white bg-emerald-400 hover:bg-emerald-300 px-6 py-2 rounded-full transition-colors"
// //               >
// //                 Log in
// //               </Link>
// //             )}
// //           </div>
// //         </div>
// //       </header>

// //       <main className="max-w-7xl mx-auto px-4 py-6 pt-24">
// //         <Outlet />
// //       </main>
// //     </div>
// //   );
// // }

// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Importar el contexto de autenticación
// import { Activity } from 'lucide-react';

// export default function Layout() {
//   const { user, isLoggedIn, logout } = useAuth(); // Obtener el estado de autenticación
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout(); // Actualizar el estado de autenticación
//     navigate('/login'); // Redirigir al login
//   };

//   return (
//     <div className="min-h-screen bg-gray-900">
//       {/* Header */}
//       <header className="bg-gray-800 border-b border-gray-700 fixed w-full z-10">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex items-center group">
//             <Activity className="h-8 w-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
//             <h1 className="ml-2 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-blue-300 transition-colors">
//               GreenAir
//             </h1>
//           </Link>

//           {/* Buttons */}
//           <div className="flex items-center space-x-4">
//             {isLoggedIn && user ? (
//               <>
//                 <button
//                   onClick={() => navigate('/profile')}
//                   className="text-white bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-full transition-colors"
//                 >
//                   Mi Perfil
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="text-white bg-red-500 hover:bg-red-400 px-6 py-2 rounded-full transition-colors"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <Link
//                 to="/login"
//                 className="text-white bg-emerald-400 hover:bg-emerald-300 px-6 py-2 rounded-full transition-colors"
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-6 pt-24">
//         <Outlet />
//       </main>
//     </div>
//   );
// }



