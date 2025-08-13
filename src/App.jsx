import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Container from './components/Container.jsx';
import NavLinkItem from './components/Navigation.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import SeoAudit from '../src/Pages/SeoAudit.jsx';
import KeywordDensity from '../src/Pages/KeywordDensity.jsx';
import SerpPreview from '../src/Pages/SerpPreview.jsx';

export default function App() {
  // for mobile navigation - it required a state.
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="border-b dark:border-gray-800">
        <Container>
          <div className="flex items-center justify-between py-3">
            <h1 className='my-10 text-5xl font-bold'>SEO Analysis Dashboard</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button className="sm:hidden border rounded-md px-2 py-1" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">☰</button>
            </div>
          </div>

          {/* This one i made for Mobile Menu, that when user clicks on any option, it get hides */}
          <nav className={`${open ? 'block' : 'hidden'} sm:block pb-3 sm:pb-0 my-4`}>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <NavLinkItem to="/" label="SEO Audit" onClick={() => setOpen(false)} />
              <NavLinkItem to="/keyword-density" label="Keyword Density" onClick={() => setOpen(false)} />
              <NavLinkItem to="/serp-preview" label="SERP Preview" onClick={() => setOpen(false)} />
            </div>
          </nav>
        </Container>
      </header>

      <main className="py-6">
        <Container>
          <Routes>
            <Route path="/" element={<SeoAudit />} />
            <Route path="/keyword-density" element={<KeywordDensity />} />
            <Route path="/serp-preview" element={<SerpPreview />} />
          </Routes>
        </Container>
      </main>
    </div>
  );
}
