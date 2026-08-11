import { MenuIcon, XIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { isLoggedIn, user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const scrollToSection = (id: string) => {
        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <motion.nav className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link to='/'>
                    <img src="/logo.svg" alt="logo" className="h-8.5 w-auto" />
                </Link>

                <div className="hidden md:flex items-center gap-8 transition duration-500">
                    <Link to='/' className="hover:text-pink-300 transition">Home</Link>
                    <Link to='/generate' className="hover:text-pink-300 transition">Generate</Link>
                    {isLoggedIn && (
                        <Link to='/my-generation' className="hover:text-pink-300 transition">My Generations</Link>
                    )}
                    <button onClick={() => scrollToSection('features')} className="hover:text-pink-300 transition cursor-pointer">About</button>
                    <button onClick={() => scrollToSection('contact')} className="hover:text-pink-500 transition cursor-pointer">Contact us</button>
                </div>

                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <>
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-300 rounded-full text-xs font-semibold">
                                <Sparkles size={14} className="text-pink-400" />
                                <span>{user?.credits ?? 0} Credits</span>
                            </div>

                            <div className="relative group">
                                <button className="rounded-full size-8 bg-white/20 border-2 border-white/10 font-semibold flex items-center justify-center text-sm">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </button>
                                <div className="absolute hidden group-hover:block top-6 right-0 pt-4 z-50">
                                    <div className="bg-zinc-900 border border-white/10 rounded-xl p-3 shadow-2xl min-w-[140px] text-xs space-y-2">
                                        <p className="font-semibold text-zinc-100 truncate">{user?.name}</p>
                                          <p className="font-semibold text-zinc-100 truncate "><span>Plan : </span>{user?.plan?.toUpperCase()}</p>
                                        <hr className="border-white/10 my-1" />
                                        <button onClick={() => logout()} className="w-full text-left text-red-400 hover:text-red-300 cursor-pointer">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) :
                        (
                            <button onClick={() => navigate('/login')} className="hidden md:block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full cursor-pointer">
                                Get Started
                            </button>
                        )}
                    <button onClick={() => setIsOpen(true)} className="md:hidden">
                        <MenuIcon size={26} className="active:scale-90 transition" />
                    </button>
                </div>


            </motion.nav>

            <div className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {isLoggedIn && (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-pink-500/10 border border-pink-500/20 text-pink-300 rounded-full text-sm font-semibold mb-2">
                        <Sparkles size={16} className="text-pink-400" />
                        <span>{user?.credits ?? 0} Credits available</span>
                    </div>
                )}
                <Link onClick={() => setIsOpen(false)} to='/' >Home</Link>
                <Link onClick={() => setIsOpen(false)} to='/generate'> Generate </Link>
                {isLoggedIn && (
                    <Link onClick={() => setIsOpen(false)} to='/my-generation'> My Generations</Link>
                )}

                <button onClick={() => { setIsOpen(false); scrollToSection('features'); }} className="cursor-pointer">About</button>
                <button onClick={() => { setIsOpen(false); scrollToSection('contact'); }} className="cursor-pointer">Contact us</button>

                {isLoggedIn ? (
                    <button onClick={() => { setIsOpen(false); logout(); }} className="cursor-pointer text-red-400">Logout</button>
                ) : (
                    <Link onClick={() => setIsOpen(false)} to='/login'>Login</Link>
                )}

                <button onClick={() => setIsOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex cursor-pointer">
                    <XIcon />
                </button>
            </div>
        </>
    );
}