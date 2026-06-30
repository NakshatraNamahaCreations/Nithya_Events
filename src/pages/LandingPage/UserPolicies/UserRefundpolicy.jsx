import Navbar from "../about-us/Navbar";
import Footer1 from "../components/Footer1";




export default function UserRefundPolicy(){
    return(
        <>
        <Navbar/>
        <div>
            <section style={{maxWidth:"1400px", margin:"40px auto", backgroundColor:"#f5f5f5", borderRadius:"20px", padding:"30px"}}>
               <h2 style={{fontFamily:"poppinsmed", fontSize:"42px", color:"#1c1c1c", letterSpacing:"-2%", lineHeight:"52px"}} className="mb-4">Refund policy</h2> 
               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}><b>1. ORDERS AND PAYMENTS</b></p>
               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}>Customers may cancel their order within 48 hours of placing the order. Cancellations made after this period may not be eligible for a full refund</p>

               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}>A. Cancellation Fees: If a cancellation is requested, a 20% cancellation fee will be applied to cover processing and administrative costs</p>

               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}>B. Refund Policy: Full Refund: Eligible cancellations made within the specified cancellation Fees, And window will receive a full refund, credited within 7 business days. Partial Refund: If a product is returned due to defects, the Company may issue a partial refund after an assessment of the product’s condition.</p>

               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}>C. Late Fees: In the event of a late payment, the Customer will be liable to pay a late fee of Amount for each day the payment is delayed beyond the due date.</p>

               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}>D. Rental Fees: Rental Amount: The Customer agrees to pay a rental fee of Amount for the entire rental duration. Due Dates: Payment must be made in advance on or before the first day of the rental period</p>

               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}>E. Rental Period: The rental period will commence on Start Date and conclude on End Date. The Customer is responsible for returning the rented equipment by the end of the rental period. Late returns may incur additional fees</p>

               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}> F. Notification of Cancellation: To cancel an order, customers must notify NithyaEvent by sending an email to Support@nithyaevents.com with their order details.</p>
               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}>
G. Return Policy for Wrong Product: If you receive the wrong product, you must notify NithyaEvent within 7 days of delivery by sending an email to Support@nithyaevents.com with your order details. The product must be unused and in its original packaging for a successful return.
</p>

               <p style={{fontFamily:"poppinsreg", fontSize:"18px", color:"#46444f", letterSpacing:"-2%", lineHeight:"46px"}}>
H. Shipping Policy: All orders are processed and shipped on the same day of purchase.</p>
             
               
            </section>
        </div>

        <Footer1/>
        </>
    )
}