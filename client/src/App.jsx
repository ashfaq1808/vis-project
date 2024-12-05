import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Crime Statistics Dashboard</h1>
        <Dashboard />
      </div>
    </div>
  )
}

export default App;