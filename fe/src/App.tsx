import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import VerifyWaiting from './pages/Auth/VerifyWaiting';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassWord';

import Feeds from './pages/Feeds/Feeds';
import Discovery from './pages/Feeds/Discovery';

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
import AdminProfile from './pages/Admin/AdminProfile';
import AdminSearchResults from './pages/Admin/AdminSearchResults';

import SearchResults from './pages/Search/SearchResults';

import NotFoundPage from './pages/not-found/NotFoundPage';

import { ProtectedRoute } from './components/guards/ProtectedRoute';
import { AdminRoute } from './components/guards/AdminRoute';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
        theme="light"
      />
      <Routes>
        {/* PUBLIC ROUTES (Anyone can access) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-waiting" element={<VerifyWaiting />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* SEMI-PUBLIC ROUTES within MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/discovery" replace />} />
          <Route path="discovery" element={<Discovery />} />
          <Route path="profile/:userId" element={<PublicProfile />} />
          <Route path="/search" element={<SearchResults />} />

          {/* PROTECTED USER ROUTES (Must log in) */}
          <Route element={<ProtectedRoute />}>
            <Route path="feeds" element={<Feeds />} />
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="my-profile/edit" element={<EditProfile />} />
            <Route path="photos/new" element={<NewPhoto />} />
            <Route path="photos/:id/edit" element={<EditPhoto />} />
            <Route path="albums/new" element={<NewAlbum />} />
            <Route path="albums/:id/edit" element={<EditAlbum />} />
          </Route>
        </Route>

        {/* STRICTLY PROTECTED ADMIN ROUTES (Must log in & have ADMIN Role) */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/users" replace />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id/edit" element={<AdminEditUser />} />
            <Route path="photos" element={<AdminPhotos />} />
            <Route path="photos/:id/edit" element={<AdminEditPhoto />} />
            <Route path="albums" element={<AdminAlbums />} />
            <Route path="albums/:id/edit" element={<AdminEditAlbum />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/search" element={<AdminSearchResults />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
