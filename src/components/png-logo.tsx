import React from 'react'

interface PNGLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function PNGLogo({ className = '', size = 'md' }: PNGLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer yellow ring */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="#FFD700"
          stroke="#DAA520"
          strokeWidth="2"
        />

        {/* Inner white circle */}
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="white"
          stroke="#DAA520"
          strokeWidth="1"
        />

        {/* PNG map silhouette - simplified representation */}
        <g transform="translate(100,100)">
          {/* Main island outline */}
          <path
            d="M-35,-20 Q-30,-25 -20,-22 Q-10,-18 0,-15 Q15,-12 25,-8 Q35,-5 40,0 Q38,8 30,15 Q20,20 10,18 Q0,16 -10,20 Q-20,18 -30,12 Q-38,5 -35,-20 Z"
            fill="black"
          />
          {/* Additional islands */}
          <circle cx="45" cy="-10" r="3" fill="black" />
          <circle cx="42" cy="5" r="2" fill="black" />
          <ellipse cx="-45" cy="10" rx="4" ry="2" fill="black" />
        </g>

        {/* Top text "PAPUA NEW GUINEA" */}
        <path
          id="top-curve"
          d="M 40 100 A 60 60 0 0 1 160 100"
          fill="none"
        />
        <text className="text-[10px] font-bold fill-red-800">
          <textPath href="#top-curve" startOffset="50%" textAnchor="middle">
            PAPUA NEW GUINEA
          </textPath>
        </text>

        {/* Bottom text "NATIONAL PROCUREMENT COMMISSION" */}
        <path
          id="bottom-curve"
          d="M 160 100 A 60 60 0 0 1 40 100"
          fill="none"
        />
        <text className="text-[8px] font-bold fill-red-800">
          <textPath href="#bottom-curve" startOffset="50%" textAnchor="middle">
            NATIONAL PROCUREMENT COMMISSION
          </textPath>
        </text>
      </svg>
    </div>
  )
}
