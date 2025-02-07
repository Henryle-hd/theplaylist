import { Github, Instagram, Linkedin, X } from 'lucide-react'
import React from 'react'

export default function SocialMedia() {
  return (
    <div className="flex gap-4 mb-5">
          <a href="https://github.com/Henryle-hd" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#ff4100] " title="henrylee_hd">
            <Github size={24} />
          </a>
          <a href="https://www.linkedin.com/in/henry-dioniz-99897924b/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#ff4100] " title="henrylee_hd">
            <Linkedin size={24} />
          </a>
          <a href="https://x.com/Henrylee_hd" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#ff4100] " title="henrylee_hd">
            <X size={24} />
          </a>
          <a href="https://www.instagram.com/henrylee_hd/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#ff4100] " title="henrylee_hd">
            <Instagram size={24} />
          </a>
        </div>
  )
}