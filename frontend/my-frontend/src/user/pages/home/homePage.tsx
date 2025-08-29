import type React from "react";
import { useEffect } from "react";
import Navbar from "../../components/navbar/navbar";

import './home.css';
import Banner from "../../components/banner/banner";
import ShowCourses from "../../components/showCourses/showCourses";
import Events from "../../components/events/showEvents";
import Instructors from "../../components/instructors/instructors";
import Categories from "../../components/category/category";
import Benefits from "../../components/benefits/benefits";


const Home: React.FC = () => {
    console.log("Home component mounted");
    useEffect(() => {
        // console.log("Home mounted");
        // console.log("Token in storage:", localStorage.getItem("token"));
    }, []);

    return (
        <div className="home">
            <Navbar />
            <Banner
                // title="Welcome to Our Platform"
                // subtitle="Your learning journey starts here"
                // imageUrl="/assets/banner.jpg"
            />  
            <Benefits />
            <Categories />
            <ShowCourses />
            <Events />
            <Instructors />
        </div>
    )
}

export default Home