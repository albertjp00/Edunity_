import type React from "react";
import { useEffect } from "react";
import Navbar from "../../components/navbar/navbar";

import './home.css';
import Banner from "../../components/banner/banner";
import ShowCourses from "../../components/showCourses/showCourses";


const Home: React.FC = () => {
    console.log("Home component mounted");
    useEffect(() => {
        console.log("Home mounted");
        console.log("Token in storage:", localStorage.getItem("token"));
    }, []);

    return (
        <div className="home">
            <Navbar />
            <Banner
                title="Welcome to Our Platform"
                subtitle="Your learning journey starts here"
                imageUrl="/assets/banner.jpg"
            />
            <ShowCourses />
            <p>instructors</p>
        </div>
    )
}

export default Home