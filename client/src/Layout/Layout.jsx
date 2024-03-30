import React from "react";
import Navbar from "../Components/Navbar";
import Routers from "../routers/Routers";
import Footer from "../Components/Footer";

const Layout = () => {
  return (
    <div className="vh-100">
      <Navbar />
      <main className="main">
        <Routers />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
