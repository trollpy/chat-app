// import { useState, useEffect, useContext, createContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import jwtDecode from 'jwt-decode';
// import api from '../services/api';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (token) {
//           const decoded = jwtDecode(token);
//           const currentTime = Date.now() / 1000;
          
//           if (decoded.exp < currentTime) {
//             localStorage.removeItem('token');
//             setUser(null);
//             return;
//           }

//           api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//           const { data } = await api.get('/auth/me');
//           setUser({ ...data, token });
//         }
//       } catch (err) {
//         localStorage.removeItem('token');
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (email, password) => {
//     const { data } = await api.post('/auth/login', { email, password });
//     localStorage.setItem('token', data.token);
//     api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
//     setUser(data);
//     navigate('/chat');
//   };

//   const register = async (username, email, password) => {
//     const { data } = await api.post('/auth/register', { username, email, password });
//     localStorage.setItem('token', data.token);
//     api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
//     setUser(data);
//     navigate('/chat');
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete api.defaults.headers.common['Authorization'];
//     setUser(null);
//     navigate('/');
//   };

//   const updateProfile = async (profileData) => {
//     const { data } = await api.put(`/users/${user._id}`, profileData);
//     setUser({ ...user, ...data });
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         register,
//         logout,
//         updateProfile
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };