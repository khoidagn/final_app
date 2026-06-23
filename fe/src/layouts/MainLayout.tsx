import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';   
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16 md:pb-0">
      <Navbar />
      <div className="w-full px-6 py-8 grid grid-cols-1 md:grid-cols-[180px_1fr] lg:grid-cols-[120px_1fr_120px] gap-6 flex-1 items-start"> 
        <Sidebar />        
        <main className="w-full min-w-0">
          <Outlet />
        </main>
        <div className="hidden lg:block w-[120px]"></div>

      </div>
    </div>
  );
};

export default MainLayout;