'use client';
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import logo from "@/logo.png";
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { animated, useSpring } from '@react-spring/web';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';




export const Navbar = () => {
  const theme = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    {
      id: 1,
      link: "home",
    },
    {
      id: 2,
      link: "about",
    },
    {
      id: 3,
      link: "portfolio",
    },
    {
      id: 4,
      link: "experience",
    },
    {
      id: 5,
      link: "contact",
    },
  ];
  const toggleMobileMenu = () => {
    console.log("Toggling menu:", !mobileMenuOpen); // Debug: Check if this toggles
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const menuAnimation = useSpring({
    to: { 
      opacity: mobileMenuOpen ? 1 : 0, 
      transform: mobileMenuOpen ? `translateX(0)` : `translateX(100%)`, 
    },
    from: { 
      opacity: 0, 
      transform: `translateX(100%)`,
    },
    
    config: {
      tension: 210,
      friction: 20,
    },
  });

  
  return (
    
    <div style={{ backgroundColor: theme.palette.background.default,  }} className="flex justify-between items-center h-20 px-4   left-0 right-0 w-full">
      {/* Logo */}
      <div className="flex justify-center w-full md:w-auto">
        <Link href={`/`}>
          <Image priority src={logo} width={250} alt="Estate Market" loading='eager' rel="preload" fetchPriority='high' />
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex justify-center w-full">
        {links.map(({ id, link }) => (
          <React.Fragment key={id}>
            <li className="px-4 cursor-pointer capitalize font-medium text-black hover:text-gray-300 transition duration-300">
              <Link href={`/${link}`}>{link}</Link>
            </li>
            {id < links.length && <Divider orientation="vertical" flexItem />}
          </React.Fragment>
        ))}
      </ul>

      {/* Login/Sign Up Buttons */}
      <div className="hidden md:flex justify-end items-center gap-2 mr-4" style={{ flex: 1 }}>
        <Button
          variant="contained"
          style={{
            flex: 1, // Allow the button to grow and fill the space
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            padding: '6px 30px',
            textTransform: 'none',
            letterSpacing: 'normal',
            fontWeight: 'bold',
            fontSize: '15px',
            borderRadius: '10px',
            boxShadow: 'none',
            whiteSpace: 'nowrap',
            transition: 'background-color 0.2s ease',
          }}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Login
        </Button>

        <Button
          variant="contained"
          style={{
            flex: 1, // Similarly, allow this button to grow and fill the space
            backgroundColor: theme.palette.secondary.main,
            color: '#fff',
            padding: '6px 30px',
            textTransform: 'none',
            letterSpacing: 'normal',
            fontWeight: 'bold',
            fontSize: '15px',
            borderRadius: '10px',
            boxShadow: 'none',
            whiteSpace: 'nowrap',
            transition: 'background-color 0.2s ease',
          }}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark,
            },
          }}
        >
          Sign Up
        </Button>
      </div>
      {/* Hamburger Menu */}
      <div className="md:hidden flex items-center">
        <Button onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <animated.div style={{
          ...menuAnimation,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.9)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          borderRadius: '10px',
        }} className="md:hidden absolute mt-2 top-20 left-0 w-full z-10">
          <ul className="flex flex-col justify-center items-center py-4">
            {links.map(({ id, link }) => (
              <React.Fragment key={id}>
                <li className="px-4 cursor-pointer capitalize font-medium text-black hover:text-gray-300 transition duration-300 my-2">
                  <Link href={`/${link}`}>{link}</Link>
                </li>
                {id < links.length && <Divider />}
              </React.Fragment>
            ))}
          </ul>
        </animated.div>
      )}
    </div>

  );
};

