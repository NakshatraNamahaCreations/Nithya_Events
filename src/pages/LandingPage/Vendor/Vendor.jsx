import CategoryNav from "../components/Categories";
import Footer1 from "../components/Footer1";
import NavbarMenu from "../components/NavbarMenu";
import Items from "./Items";
import Reviews from "./Reviews";
import VendorBanner from "./VendorBanner";






export default function VendorBng(){
    return(
        <>
        <NavbarMenu/>
        <CategoryNav/>
        <VendorBanner/>
        <Items/>
        <Reviews/>
        <Footer1/>
        </>
    )
}