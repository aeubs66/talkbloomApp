import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { getIsAdmin } from "@/lib/admin";


const App = dynamic(() => import("./app"), { ssr: false });

const AdminPage = () => {
  const admin = getIsAdmin();

  if (!admin) redirect("/");

  return (
    <div>
      <App />
    </div>
  );
};

export default AdminPage;
