export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to NorthPark Learning Support</h1>
        <p className="text-gray-400 text-lg">Manage your educational institution with ease</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Teachers</h2>
          <p className="text-gray-400">Manage your teaching staff and their information</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Students</h2>
          <p className="text-gray-400">Track student progress and learning support needs</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Reports</h2>
          <p className="text-gray-400">Generate insights and analytics for your institution</p>
        </div>
      </div>
    </div>
  );
}
