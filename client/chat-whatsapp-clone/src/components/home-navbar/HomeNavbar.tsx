import Image from 'next/image';
import { SidebarTrigger } from '../ui/sidebar';
import Link from 'next/link';
import { Input } from '../ui/input';
import ProfileSection from './ProfileSection';
import { ThemeToggle } from './ThemeToggle';

const HomeNavbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-primary flex items-center px-2 pr-5 z-50">
            <div className="flex items-center gap-4 w-full">
                <div className='flex items-center flex-shrink-0'>
                    <SidebarTrigger className='h-max aspect-square'/>
                    <Link href="/">
                    <div className='p-4 flex items-center gap-1'>
                        <Image src="/logo.svg" alt="logo" width={32} height={32} />
                        <p className='text-xl font-semibold tracking-tight'>WhatsApp</p>
                    </div>
                    </Link>
                </div>
                {/* Search Bar (TODO: Replace with better deisgn from 21dev*/}
                {/* <div className='flex-1 flex justify-center max-w-[720px] mx-auto'>
                    <Input
                        placeholder='Search or start new chat'
                        className='rounded-full'
                    />
                </div> */}
                
                {/* Theme Toggle */}
                <div className='ms-auto flex items-center gap-2'>
                    <ThemeToggle />
                    <ProfileSection />
                </div>
                {/* User Profile Section */}
            </div>

        </nav>
            
    );
}

export default HomeNavbar;