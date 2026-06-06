function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <span className="logo-text">NETFLIX</span>
        <span className="logo-sub">ANALYTICS</span>
      </div>
      <div className="nav-links">
        <a href="#" className="active">Dashboard</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">Source Code</a>
      </div>
    </nav>
  );
}

export default Navbar;
