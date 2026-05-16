import React from "react";
import "../index.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 text-black bg-white shadow-md">
      <div className="flex items-center justify-end md:justify-start m-auto py-5 px-4 md:px-20 w-full">
        <Link to="/" className="font-bold text-2xl text-center">
          Personal Finance Manager
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;