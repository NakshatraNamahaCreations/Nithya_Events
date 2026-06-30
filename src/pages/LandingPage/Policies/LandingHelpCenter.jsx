import Navbar from "../about-us/Navbar";
import Footer1 from "../components/Footer1";




export default function LandingHelpCenter(){
    return(
        <>
        <Navbar/>
        <div>
            <section style={{maxWidth:"1400px", margin:"40px auto", backgroundColor:"#f5f5f5", borderRadius:"20px", padding:"30px"}}>
               <h2 style={{fontFamily:"poppinsmed", fontSize:"42px", color:"#1c1c1c", letterSpacing:"-2%", lineHeight:"52px"}} className="mb-4">Help Center</h2> 
               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}><b>Contact Us</b></p>
               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}>If you have any questions about this TERMS AND CONDITIONS Privacy Policy, please contact us at: <b>Email: support@nithyaevents.com</b></p>

               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}><b>Address</b></p>
               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}>Kadagam Ventures Private Limited, No: 34 Venkatappa Road, Tasker Town, Off Queens Road, Bangalore 560051</p>

               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}>
At Nithyaevent, we value your satisfaction and are committed to ensuring your event is a success. If you need further assistance, don't hesitate to reach out. We're always happy to help!.</p>
            
            </section>
        </div>

        <Footer1/>
        </>
    )
}