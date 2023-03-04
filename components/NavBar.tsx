import Link from "next/link";
import Image from "next/image";
import LogoSrc from "../public/logo.png";
const NavBar = () => {
  return (
    <nav className='flex justify-between max-w-7xl mx-auto'>
      <div className='flex items-center space-x-5'>
        <Link href='/'>
          <Image src={LogoSrc} alt='lol' className='w-44 object-contain' />
        </Link>
        <ul className='hidden md:inline-flex items-center space-x-5'>
          <li className='cursor-pointer'>About</li>
          <li className='cursor-pointer'>Contact</li>
          <li className='cursor-pointer text-white bg-green-600 px-4 py-1 rounded-full'>
            Follow
          </li>
        </ul>
      </div>
      <div className='flex items-center space-x-5'>
        <ul className='hidden md:inline-flex items-center space-x-5'>
          <li className='cursor-pointer text-green-600'>sign in</li>
          <li className='cursor-pointer text-green-600 px-4 py-1 rounded-full border border-green-600'>
            Get Started
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;

// <a href="https://logovectordl.com/article-logo-vector-svg/" target="_blank"><img src="https://logovectordl.com/wp-content/uploads/2021/03/article-logo-vector.png" /></a>
