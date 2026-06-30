import CategoryNav from "../components/Categories";
import NavbarMenu from "../components/NavbarMenu";
import ContactBanner from "./ContactBanner";
import DownloadApp from "./DownloadApp";
import NearbyVendors from "./NearByVendor";
import Products from "./Products";
import RentalServices from "./RentalServices";
import Services from "./Services";
import TrustedBy from "./TrustedBy";
import Footer1 from "../components/Footer1";

export default function LandingPage() {
  const sampleItems = [
    {
      id: 1,
      category: "Microphone",
      title: "Conference Mic",
      image: "/media/mic.jpg",
      rating: "4.88",
      reviews: "472k",
      price: "₹3,990",
      priceLabel: "/per day",
    },
    {
      id: 2,
      category: "Stand",
      title: "Keyboard Stand Rental",
      image: "/media/keyboard-stand1.png",
      rating: "4.00",
      reviews: "472k",
      price: "₹250",
    },
    {
      id: 3,
      category: "Speaker",
      title: "Hartke Bass Amplifier Rental",
      image: "/media/amplifier2.png",
      rating: "4.98",
      reviews: "472k",
      price: "₹2,000",
    },
    {
      id: 4,
      category: "Musical Instrument",
      title: " Cango Rental",
      image: "/media/conga1.png",
      rating: "3.62",
      reviews: "200k",
      price: "₹2,000",
    },
    {
      id: 5,
      category: "Microphone",
      title: "Shotgun Mic Rental",
      image: "/media/shotgun2.png",
      rating: "4.88",
      reviews: "472k",
      price: "₹1,500",
    },
    {
      id: 6,
      category: "Shamiana",
      title: "German Tent Rental",
      image: "/media/german-tent-1.png",
      rating: "4.88",
      reviews: "472k",
      price: "₹40",
    },
  ];
  return (
    <>
      <NavbarMenu />
      <CategoryNav />
      <RentalServices />
      <TrustedBy />
      <DownloadApp />
      <Services />
      <Products items={sampleItems} />
      <ContactBanner />
      <NearbyVendors />
      <Footer1 />
    </>
  );
}
