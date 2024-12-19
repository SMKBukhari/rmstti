import Navbar from "@/components/LandingPage/Navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <header>
        <Navbar />
      </header>
      <main className="mt-16 w-full">{children}</main>
    </div>
  );
};

export default AuthLayout;
