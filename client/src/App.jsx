import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
        <Navbar />
        
        <main className="flex-grow max-w-7xl mx-auto px-4 py-6 w-full">
          <Routes>
            <Route path="/" element={<div className="text-center mt-10">Welcome to Lost and Found Portal</div>} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
