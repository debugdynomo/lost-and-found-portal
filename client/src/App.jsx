import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Lost and Found</h1>
          </div>
        </header>
        
        <main className="flex-grow max-w-7xl mx-auto px-4 py-6 w-full">
          <Routes>
            <Route path="/" element={<div className="text-center mt-10">Welcome to Lost and Found Portal</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
