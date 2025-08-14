import Link from "next/link";
import { FaFolder } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <FaFolder size={64} className="mx-auto mb-6 text-blue-500" />
        <h1 className="text-4xl font-bold mb-4 text-gray-800">File Browser</h1>
        <p className="text-gray-600 mb-8 text-lg">Browse and view project files</p>

        <Link
          className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          href="/viewing"
        >
          <FaFolder className="mr-2" />
          Open File Browser
        </Link>
      </div>
    </div>
  );
}
