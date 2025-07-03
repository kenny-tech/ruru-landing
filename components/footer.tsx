import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link 
              href="/terms" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
          <div className="text-gray-600">
            <span>Developed by </span>
            <a 
              href="https://www.smarttechpoint.com.ng" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Smart Tech Point
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}