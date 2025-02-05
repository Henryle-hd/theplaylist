  /**
   * The `NavBar` component represents the navigation bar at the top of the application.
   * It includes links to the home page, a new page, and a DJ mix page.
   * The navigation bar is fixed at the top of the screen and has a blurred background effect.
   * The component uses Lucide icons to display the navigation links.
   */
  'use client'

  import React from 'react';
  import { Home, Link, PlaySquare } from 'lucide-react';

  const NavBar = () => {
    return (
        <div className="hidden sm:flex h-12 md:h-16 bg-[#2e0b01bb] backdrop-blur-sm text-white py-5 md:py-0 px-3 md:px-6 items-center justify-between mx-2 md:mx-4 mt-16 md:mt-5 rounded-xl gap-4 md:gap-44">
          <div className="text-lg md:text-xl font-bold text-[#ff5480]">THE•PLAYLIST</div>
          <div className="flex gap-2 md:gap-6">
            <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 bg-[#ff5480]/20 rounded-lg hover:bg-[#ff5480]/30 transition cursor-pointer">
              <Home size={16} className="md:w-5 md:h-5" />
              <span className="font-semibold hidden sm:inline">Home</span>
            </div>
          
            <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 bg-[#ff5480]/20 rounded-lg hover:bg-[#ff5480]/30 transition cursor-pointer">
              <Link size={16} className="md:w-5 md:h-5" />
              <span className="font-semibold hidden sm:inline">New</span>
            </div>

            <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 bg-[#ff5480]/20 rounded-lg hover:bg-[#ff5480]/30 transition cursor-pointer">
              <PlaySquare size={16} className="md:w-5 md:h-5" />
              <span className="font-semibold hidden sm:inline">DJ Mix</span>
            </div>
          </div>
        </div>
    );
  };

  export default NavBar;