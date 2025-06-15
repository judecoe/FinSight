import React from "react";

const sidebarLinks = [
  { name: "Dashboard", href: "#" },
  { name: "Transactions", href: "#" },
  { name: "Budgets", href: "#" },
  { name: "Reports", href: "#" },
];

const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="h-16 flex items-center justify-center font-bold text-xl text-blue-600 border-b">
        FinanceDash
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {sidebarLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
    <div className="flex-1 flex flex-col">
      <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
        <div className="font-semibold text-lg text-gray-800">Dashboard</div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hello, User</span>
          <img
            src="https://i.pravatar.cc/32"
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  </div>
);

export default Layout;
