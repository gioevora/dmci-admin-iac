import SidebarWrapper from "@/app/components/sidebarwrappper";
import { Toaster } from "react-hot-toast";
import AdminAuth from "@/app/components/adminauth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuth>
            <section className="flex flex-col sm:flex-row min-h-screen">
                {/* Sidebar */}
                <div className="w-full sm:w-auto">
                    <SidebarWrapper />
                </div>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-8 bg-gray-100">
                    <Toaster />
                    <div className="">{children}</div>
                </main>
            </section>
        </AdminAuth>
    );
}