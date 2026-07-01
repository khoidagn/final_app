import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';

import Feeds from './pages/Feeds/Feeds';
import Discovery from './pages/Feeds/Discovery';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import MyProfile from './pages/Profile/MyProfile';
import PublicProfile from './pages/Profile/PublicProfile';
import EditProfile from './pages/Profile/EditProfile';

import NewPhoto from './pages/Photos/NewPhoto';
import EditPhoto from './pages/Photos/EditPhoto';
import NewAlbum from './pages/Albums/NewAlbum';
import EditAlbum from './pages/Albums/EditAlbum';

import AdminUsers from './pages/Admin/AdminUsers';
import AdminPhotos from './pages/Admin/AdminPhotos';
import AdminAlbums from './pages/Admin/AdminAlbums';
import AdminEditUser from './pages/Admin/AdminEditUser';
import AdminEditPhoto from './pages/Admin/AdminEditPhoto';
import AdminEditAlbum from './pages/Admin/AdminEditAlbum';

import NotFoundPage from './pages/not-found/NotFoundPage';

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
        <Route path="/photos/new" element={<NewPhoto />} />
        <Route path="/photos/:id/edit" element={<EditPhoto />} />
        <Route path="/albums/new" element={<NewAlbum />} />
        <Route path="/albums/:id/edit" element={<EditAlbum />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id/edit" element={<AdminEditUser />} />
        <Route path="photos" element={<AdminPhotos />} />
        <Route path="photos/:id/edit" element={<AdminEditPhoto />} />
        <Route path="albums" element={<AdminAlbums />} />
        <Route path="albums/:id/edit" element={<AdminEditAlbum />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
