import React from "react";

export const CircularProgress: React.FC<{
  size?: number;
  thickness?: number;
  className?: string;
}> = ({ size = 40, thickness = 4, className = "" }) => (
  <span
    className={className}
    style={{ display: "inline-block", width: size, height: size }}
  >
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={(size - thickness) / 2}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={thickness}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={(size - thickness) / 2}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={thickness}
        strokeDasharray={Math.PI * (size - thickness)}
        strokeDashoffset={Math.PI * (size - thickness) * 0.25}
        strokeLinecap="round"
        style={{
          transformOrigin: "center",
          transform: "rotate(-90deg)",
          animation: "circular-rotate 1s linear infinite",
        }}
      />
    </svg>
    <style jsx>{`
      @keyframes circular-rotate {
        100% {
          transform: rotate(270deg);
        }
      }
    `}</style>
  </span>
);
