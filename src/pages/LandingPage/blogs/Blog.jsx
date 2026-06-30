import Navbar from "../about-us/Navbar"
import BlogBanner from "./BlogBanner"
import RecentBlogs from "./RecentBlogs"
import Recommended from "./Recommended"
import Footer1 from "../components/Footer1"



export default function Blogs(){
    return(
        <>
        <Navbar/>
        <BlogBanner/>
        <RecentBlogs/>
        <Recommended/>
        <Footer1/>
        </>
    )
}