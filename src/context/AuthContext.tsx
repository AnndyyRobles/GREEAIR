// import { createContext, useContext, useState, useEffect } from 'react';

// interface AuthContextType {
//   isLoggedIn: boolean;
//   login: () => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const user = localStorage.getItem('user');
//     setIsLoggedIn(!!user);
//   }, []);

//   const login = () => {
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     localStorage.removeItem('user');
//     setIsLoggedIn(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth debe ser usado dentro de un AuthProvider');
//   }
//   return context;
// };




// import { createContext, useContext, useState, useEffect } from 'react';

// interface User {
//   id_usuario: number;
//   nombre: string;
//   correo: string;
//   telefono: string;
//   direccion: string;
//   id_region: string;
//   tipo_usuario: string;
// }

// interface AuthContextType {
//   user: User | null; // El usuario logueado o null si no hay sesión activa
//   isLoggedIn: boolean; // Estado booleano para saber si está logueado
//   login: (user: User) => void; // Función para loguear al usuario
//   logout: () => void; // Función para cerrar sesión
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//       }
//     } catch (error) {
//       console.error('Error al cargar el usuario desde localStorage:', error);
//       localStorage.removeItem('user'); // Limpia datos corruptos
//     }
//   }, []);

//   const login = (loggedUser: User) => {
//     try {
//       setUser(loggedUser);
//       localStorage.setItem('user', JSON.stringify(loggedUser));
//     } catch (error) {
//       console.error('Error al guardar el usuario en localStorage:', error);
//     }
//   };

//   const logout = () => {
//     try {
//       setUser(null);
//       localStorage.removeItem('user');
//     } catch (error) {
//       console.error('Error al eliminar el usuario de localStorage:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth debe ser usado dentro de un AuthProvider');
//   }
//   return context;
// };




import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  id_region: string;
  tipo_usuario: string;
}

interface AuthContextType {
  user: User | null; // Usuario logeado o null
  isLoggedIn: boolean; // Estado de autenticación
  login: (user: User) => void; // Función para logear
  logout: () => void; // Función para cerrar sesión
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log('Cargando usuario desde localStorage:', storedUser);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error al analizar el usuario almacenado:', error);
      localStorage.removeItem('user'); // Limpia datos inválidos
      setUser(null);
    }
  }, []);

  const login = (loggedUser: User) => {
    setUser(loggedUser);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    console.log('Usuario logueado:', loggedUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

