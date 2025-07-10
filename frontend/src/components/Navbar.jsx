import React from "react";
import "../index.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav className="fixed top-0 left-0 w-full z-50 text-black bg-white shadow-md">
        <div className="flex items-center justify-items-start m-auto py-5 px-20">
            <Link to="/" className="font-bold text-2xl">Expense Tracker</Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
