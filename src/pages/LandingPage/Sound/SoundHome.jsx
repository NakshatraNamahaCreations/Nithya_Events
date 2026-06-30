
import CategoryNav from "../components/Categories";
import Footer1 from "../components/Footer1";
import NavbarMenu from "../components/NavbarMenu";
import SoundCategoryPage from "./SoundCategoryPage";






export default function SoundHome(){
    return(
        <>
        <NavbarMenu/>
        <CategoryNav/>
        <SoundCategoryPage/>
        <Footer1/>
        </>
    )
}