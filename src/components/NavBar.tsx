
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Dashboard", href: "/" },
  { name: "Customers", href: "/#customers" },
  { name: "Rewards", href: "/#rewards" },
];

const NavBar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold text-cyan-700">LoyaltyPro Kenya</span>
        <div className="md:hidden">
          <button
            className="p-2 rounded-md text-cyan-700 hover:bg-cyan-50 focus:outline-none"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        <div className="hidden md:flex gap-8">
          {navLinks.map((lnk) => (
            <a
              key={lnk.name}
              href={lnk.href}
              className="font-medium text-gray-700 hover:text-cyan-600 transition"
            >
              {lnk.name}
            </a>
          ))}
        </div>
      </div>
      {open && (
        <div className="md:hidden mt-2 bg-white border-t border-gray-100 shadow-lg z-50">
          <div className="flex flex-col px-6 py-4 space-y-3">
            {navLinks.map((lnk) => (
              <a
                key={lnk.name}
                href={lnk.href}
                className="text-gray-700 font-medium hover:text-cyan-600"
                onClick={() => setOpen(false)}
              >
                {lnk.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
