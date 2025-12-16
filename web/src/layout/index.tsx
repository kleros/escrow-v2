import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { OverlayScrollContext } from "context/OverlayScrollContext";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC = () => {
  const containerRef = useRef(null);

  return (
    <OverlayScrollContext.Provider value={containerRef}>
      <OverlayScrollbarsComponent
        className="h-screen w-screen"
        ref={containerRef}
        options={{ showNativeOverlaidScrollbars: true }}
      >
        <div className="flex flex-col min-h-full w-full">
          <Header />
          <ToastContainer className="p-4 pt-[70px]" />
          <div className="flex-1 bg-klerosUIComponentsLightBackground">
            <Outlet />
          </div>
          <Footer />
        </div>
      </OverlayScrollbarsComponent>
    </OverlayScrollContext.Provider>
  );
};

export default Layout;
