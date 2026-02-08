import { Outlet } from "react-router-dom";
import TabNavigation from "./TabNavigation";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TabNavigation />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
