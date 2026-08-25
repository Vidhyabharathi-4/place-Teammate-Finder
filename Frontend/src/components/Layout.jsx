import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-white">

      <Sidebar />

      <div className="ml-72">

        <Navbar />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;