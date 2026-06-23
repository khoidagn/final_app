import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; 

import Feeds from './pages/Feeds';
import Discovery from './pages/Discovery';
import Login from './pages/Login';
import Signup from './pages/Signup';



const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/feeds" replace /> },
      { path: 'feeds', element: <Feeds /> },
      { path: 'discovery', element: <Discovery /> },

    ],
  },

 
  
  { path: '*', element: <div className="p-8 text-center font-semibold">Trang không tồn tại - 404 Not Found</div> }
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;