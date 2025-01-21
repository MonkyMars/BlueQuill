import React, { useEffect, useRef } from "react";

interface ProfilePictureCanvasProps {
  name: string | null;
  size?: number;
}

const ProfilePictureCanvas = ({
  name,
  size = 200,
}: ProfilePictureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const getInitials = (name: string): string => {
    const nameParts = name.split(" ");
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials.substring(0, 2); 
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    canvas.width = size;
    canvas.height = size;

    const backgroundColor = "#3498db";
    const initials = name ? getInitials(name) : "N/A";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    ctx.closePath();
    ctx.font = `bold ${size / 3}px Arial`;
    ctx.fillStyle = "#ffffff"; 
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials, size / 2, size / 2);
  }, [name, size]);

  return <canvas ref={canvasRef}></canvas>;
};

export default ProfilePictureCanvas;
