import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#EFA765]/20 bg-card-background text-text-muted py-16 md:py-20 font-sans relative overflow-hidden shadow-2xl">
      <div className="container mx-auto relative z-10 p-4">
        {/* The main container uses flexbox to arrange the four divs */}
        <div className="flex flex-col md:flex-row justify-evenly gap-10 mx-6 text-center md:text-left items-center">
          {/* Div One: Created By */}
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold yeseva-one text-[#efa765] text-2xl mb-2">
              Created By
            </h4>
           <p className="text-gray-300 font-semibold">
              Name:{" "}
              <a
                href="mailto:rajpoottony61@gmail.com"
                className="hover:underline"
              >
                Muhammad Waqar
              </a>
            </p>
            <p className="text-gray-300 font-semibold">
              Email:{" "}
              <a
                href="mailto:rajpoottony61@gmail.com"
                className="hover:underline"
              >
                rajpoottony61@gmail.com
              </a>
            </p>
            <p className="text-gray-300 font-semibold">
              College:{" "}
              <a href="tel:03206913949" className="hover:underline">
                Govt College Sahiwal
              </a>
            </p>
          </div>

        {/* Div Two: Social Media Links */}
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold yeseva-one text-[#efa765] text-2xl mb-2">Social Media</h4>
            <div className="flex flex-col justify-center md:justify-start gap-2">
              <a href="#" aria-label="Twitter" className="flex items-center gap-2 hover:scale-102 transition-transform text-[#1DA1F2]">
                {/* Placeholder for Twitter Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 11.9-10.4 12 0 0-2 1.1-4-1 1.3-1.4 2-2.9 2-4.9c0-.5 0-1-.1-1.5 2.2-2.1 4.2-4.1 6.6-7.3z"/></svg>
                <p className="text-gray-300">Twitter</p>
              </a>
              <a href="#" aria-label="LinkedIn" className="flex items-center gap-2 hover:scale-102 transition-transform text-[#0A66C2]">
                {/* Placeholder for LinkedIn Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                <p className="text-gray-300">LinkedIn</p>
              </a>
              <a href="#" aria-label="Instagram" className="flex items-center gap-2 hover:scale-102 transition-transform text-[#E1306C]">
                {/* Placeholder for Instagram Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <p className="text-gray-300">Instagram</p>
              </a>
            </div>
          </div>

          {/* Div Three: Opening Hours */}
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold yeseva-one text-[#efa765] text-2xl mb-2">
              Opening Hours
            </h4>
            <p className="text-gray-300">Mon - Fri: 08:00 AM - 02:00 PM</p>
            <p className="text-gray-300">Saturday: 08:00 AM - 04:00 PM</p>
            <p className="text-gray-300">Sunday: 24/7</p>
          </div>

          {/* Div Four: Legal and Copyright */}
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold yeseva-one text-[#efa765] text-2xl mb-2">
              Legal Information
            </h4>
            <p className="text-gray-300">
              &copy; {new Date().getFullYear()} Luminous Bistro. All rights
              reserved.
            </p>
            <p className="text-gray-300">
              <Link href="/" className="hover:underline">
                Privacy Policy
              </Link>
            </p>
            <p className="text-gray-300">
              <Link href="/" className="hover:underline">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
