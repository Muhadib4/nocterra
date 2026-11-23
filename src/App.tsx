import { Moon } from "lucide-react";

function App() {
  return (
    <div className="page-shell">
      <a className="skip-link" href="#main-content">
        Lewati ke konten
      </a>

      <header className="masthead">
        <nav aria-label="Navigasi utama">
          <a className="wordmark" href="#main-content">
            <Moon aria-hidden="true" size={18} strokeWidth={1.5} />
            <span>NOCTERRA</span>
          </a>
        </nav>
        <p className="masthead__label">Pengalaman ambient</p>
      </header>

      <main id="main-content">
        <section className="threshold" aria-labelledby="threshold-title">
          <div className="threshold__arch" aria-hidden="true" />
          <div className="threshold__copy">
            <p className="threshold__category">Fantasi abad pertengahan</p>
            <h1 id="threshold-title">NOCTERRA</h1>
            <p className="threshold__description">
              Pengalaman ambient untuk laptop dan layar proyektor.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>NOCTERRA</span>
      </footer>
    </div>
  );
}

export default App;
