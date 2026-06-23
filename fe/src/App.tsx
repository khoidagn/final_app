import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

const router = createBrowserRouter([

  { path: '*', element: <div className="p-8 text-center font-semibold">Trang không tồn tại - 404 Not Found</div> }
]);
const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;