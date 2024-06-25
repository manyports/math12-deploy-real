import Link from "next/link"

export default function Footer(){
    return(
    <div className="bg-[#2563eb] text-primary-foreground py-4 px-6 text-white">
    <div className="container mx-auto flex justify-between items-center flex-col sm:flex-row">
      <p>&copy; 2024 math12. Все права защищены.</p>
      <nav>
        <ul className="flex space-x-4 flex-col text-center sm:flex-row">
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
    </div>);
};