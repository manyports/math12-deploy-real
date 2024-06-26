import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2563eb] text-white py-6 px-4">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
        <div className="text-center sm:text-left col-span-1 lg:col-span-1">
          <p>&copy; 2024 math12. Все права защищены.</p>
        </div>
        <nav className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col sm:flex-row sm:justify-end items-center space-y-2 sm:space-y-0 sm:space-x-6 text-center">
            <li>
              <Link href="#" className="hover:underline" prefetch={false}>
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline" prefetch={false}>
                Пользовательское соглашение
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline" prefetch={false}>
                Напишите нам
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
