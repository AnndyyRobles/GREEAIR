// import { AuthProvider } from './context/AuthContext';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// // import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import Layout from './components/Layout';
// import LandingPage from './pages/LandingPage';
// import StationDashboard from './pages/StationDashboard';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import UserProfile from './pages/UserProfile';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       refetchOnWindowFocus: false,
//       staleTime: 30000,
//     },
//   },
// });

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Layout />}>
//             <Route index element={<LandingPage />} />
//             <Route path="station/:id" element={<StationDashboard />} />
//             <Route path="login" element={<Login />} />
//             <Route path="register" element={<Register />} />
//             {/* <Route path="profile" element={<UserProfile />} /> */}
//           </Route>
//         </Routes>
//       </Router>
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StationDashboard from './pages/StationDashboard';
import UserProfile from './pages/UserProfile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="station/:id" element={<StationDashboard />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
