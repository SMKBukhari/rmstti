import SidebarRoutes from "@/components/LandingPage/_Components/SidebarRoutes";
import Logo from "@/components/Logo";
const Sidebar = () => {
  return (
    <div className='h-full border-r flex flex-col overflow-y-auto scrollbar-none'>
      <div className='p-6 w-full mt-5 flex items-center justify-center'>
        <Logo />
      </div>

      {/* Sidebar Routes */}
      <div className='flex justify-between flex-col w-full h-full'>
        <SidebarRoutes />
        <div className="mb-5 ml-3">
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
