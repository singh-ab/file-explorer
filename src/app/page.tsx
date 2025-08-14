import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">File Browser System</h1>
        <p className="text-gray-600 mb-8">Browse and view project files</p>

        <Link
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          href="/viewing"
        >
          Open File Browser
        </Link>
      </div>
    </div>
  );
}
