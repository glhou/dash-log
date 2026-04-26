import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster } from "sonner";

export default function RootLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toaster richColors />
    </div>
  )
}
