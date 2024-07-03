import Link from "next/link";
import { FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 text-white py-8 px-4 rounded-tl-3xl rounded-tr-3xl">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="text-center md:text-left">
          <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition duration-300">
            math12
          </Link>
          <p className="mt-2 text-sm">&copy; {currentYear} math12. Все права защищены.</p>
        </div>
        
        <nav className="col-span-1 md:col-span-2">
          <ul className="flex flex-col space-y-2">
            {[
              { href: "/privacy", text: "Политика конфиденциальности" },
              { href: "/terms", text: "Пользовательское соглашение" },
              { href: "/contact", text: "Напишите нам" },
            ].map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className="hover:text-blue-200 transition duration-300"
                  prefetch={false}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="text-center md:text-right">
          <h3 className="text-lg font-semibold mb-3">Следите за нами</h3>
          <div className="flex justify-center md:justify-end space-x-4">
            <a href="https://instagram.com/math12.ai" target="_blank" rel="noopener noreferrer" 
               className="hover:text-blue-200 transition duration-300">
              <FaInstagram size={24} />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://tiktok.com/@math12.ai" target="_blank" rel="noopener noreferrer" 
               className="hover:text-blue-200 transition duration-300">
              <FaTiktok size={24} />
              <span className="sr-only">TikTok</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}