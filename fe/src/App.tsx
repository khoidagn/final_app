import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout'; 
import AdminLayout from './layouts/AdminLayout';

import Feeds from './pages/Feeds';
import Discovery from './pages/Discovery';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyProfile from './pages/Profile/MyProfile';
import PublicProfile from './pages/Profile/PublicProfile';
import EditProfile from './pages/Profile/EditProfile';

import PhotoForm from './pages/PhotoForm';
import AlbumForm from './pages/AlbumForm';

import AdminUsers from './pages/Admin/AdminUsers';
import AdminPhotos from './pages/Admin/AdminPhotos';
import AdminAlbums from './pages/Admin/AdminAlbums';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/feeds" replace />} />
        
        <Route path="feeds" element={<Feeds />} />
        <Route path="discovery" element={<Discovery />} />
        <Route path="my-profile" element={<MyProfile />} />
        <Route path="my-profile/edit" element={<EditProfile />} />
        <Route path="profile/:userId" element={<PublicProfile />} />
        
        <Route path="photos/new" element={<PhotoForm />} />
        <Route path="photos/:photoId/edit" element={<PhotoForm isEdit={true} />} />
        
        <Route path="albums/new" element={<AlbumForm />} />
        <Route path="albums/:albumId/edit" element={<PhotoForm isEdit={true} />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/users" replace />} />
        
        <Route path="users" element={<AdminUsers />} />
        <Route path="photos" element={<AdminPhotos />} />
        <Route path="albums" element={<AdminAlbums />} />
      </Route>
      
      <Route path="*" element={<div className="p-8 text-center font-semibold">Trang không tồn tại - 404 Not Found</div>} />
    </Routes>
  );
}