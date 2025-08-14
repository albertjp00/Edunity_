import React from "react";
import "./banner.css"; // optional styles
import bannerImage from '../../../assets/banner.jpeg'

interface BannerProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

const Banner: React.FC<BannerProps> = ({ title, subtitle, imageUrl }) => {
  return (
    <div className="banner">
      {imageUrl && <img src={bannerImage} alt={title} className="banner-image" />}
      <div className="banner-text">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
};

export default Banner;
