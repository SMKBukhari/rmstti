import Link from "next/link";
import {
  LiaFacebookF,
  LiaInstagram,
  LiaTwitter,
  LiaYoutube,
} from "react-icons/lia";

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white'>
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-4'>About Us</h3>
            <p className='text-gray-400'>
              HRM Portal connects talent with opportunity. Your career journey
              starts here.
            </p>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/signIn' className='text-gray-400 hover:text-white'>
                  Sign In
                </Link>
              </li>
              <li>
                <Link href='/signUp' className='text-gray-400 hover:text-white'>
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Contact Us</h3>
            <p className='text-gray-400'>Email: info@tti.org.pk</p>
            <p className='text-gray-400'>Phone: 051-2820180
            <br />
              051-2820181
            </p>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Follow Us</h3>
            <div className='flex space-x-4'>
              <Link
                href='https://www.facebook.com/ttimagazinepk'
                target='_blank'
                className='text-gray-400 hover:text-white'
              >
                <LiaFacebookF className='w-6 h-6' />
              </Link>
              <Link
                href='https://twitter.com/ttimagazine'
                target='_blank'
                className='text-gray-400 hover:text-white'
              >
                <LiaTwitter className='w-6 h-6' />
              </Link>
              <Link
                href='https://twitter.com/ttimagazine'
                target='_blank'
                className='text-gray-400 hover:text-white'
              >
                <LiaInstagram className='w-6 h-6' />
              </Link>
              <Link
                href='https://www.youtube.com/@thetruthinternational'
                target='_blank'
                className='text-gray-400 hover:text-white'
              >
                <LiaYoutube className='w-6 h-6' />
              </Link>
            </div>
          </div>
        </div>
        <div className='mt-8 border-t border-gray-700 pt-8 text-center'>
          <p className='text-gray-400'>
            &copy; 2024 The Truth International. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
