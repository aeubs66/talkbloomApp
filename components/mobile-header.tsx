import { MobileSidebar } from "./mobile-sidebar";

export const MobileHeader = () => {
  return (
    <nav className="fixed top-0 z-50 flex h-[50px] w-full items-center border-b bg-[#e4713c] px-4 lg:hidden">
      <MobileSidebar />
    </nav>
  );
};
