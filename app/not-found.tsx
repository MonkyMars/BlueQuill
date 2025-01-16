import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-slate-600 mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}