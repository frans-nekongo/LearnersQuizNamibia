import Link from 'next/link'

export default function NotFound() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen  text-center">
          <h2 className="text-6xl font-extrabold text-red-600 mb-4">404</h2>
          <h3 className="text-3xl font-semibold text-gray-800 mb-2">Uh-oh! Lost your way?</h3>
          <p className="text-lg text-gray-600 mb-8">
              Looks like the page you're searching for has wandered off. Maybe it’s out for a stroll!
          </p>
          <Link href="/" className="text-lg font-medium text-blue-500 hover:underline">
              🏠 No worries, let's head back home!
          </Link>
      </div>
  )
}