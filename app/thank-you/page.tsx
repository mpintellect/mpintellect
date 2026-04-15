import Link from 'next/link';


// Add this for static export
export const dynamic = 'force-static';

// Since this page uses searchParams (dynamic), we need to handle it differently
export default function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; license?: string; session_id?: string; product?: string }>;
}) {
  // For static export, we can't use await searchParams
  // Instead, we'll show a generic thank you page and handle params client-side
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto border border-yellow-500/30">
            <span className="text-4xl">🎉</span>
          </div>
        </div> 

        {/* Thank You Message */}
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
        
        <p className="text-gray-400 mb-8">
          We've sent all the details to your email. 
          Please check your inbox (and spam folder) for your order confirmation and access instructions.
        </p>

        {/* Return Home Button */}
        <Link 
          href="/"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Return Home
        </Link>

        {/* Support Link */}
        <p className="text-sm text-gray-600 mt-8">
          Questions? Contact{' '}
          <a href="mailto:contact@mpintellect.com" className="text-yellow-500 hover:underline">
            contact@mpintellect.com
          </a>
        </p>
      </div>

      
    </div>
  );
}