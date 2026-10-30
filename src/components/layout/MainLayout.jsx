import React from 'react';
import Sidebar from './Sidebar'; // You can create Sidebar.jsx in the same folder

const MainLayout = ({ user, children, onLogout, activePage, setActivePage }) => {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#F1F5FA", overflow: "hidden" }}>
      <Sidebar active={activePage} setActive={setActivePage} user={user} onLogout={onLogout} />
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 30px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;