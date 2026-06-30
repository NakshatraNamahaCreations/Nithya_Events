import "./AbtBanner.css";

export default function InfoSection() {
  return (
    <>
    <section className="info-wrapper">
      <div className="info-container">
        
        {/* Top Card */}
        <div className="info-card">
          <div className="info-card-inner">
            
            <div className="info-text-col">
              <h2 className="info-headline">What nithyaevent is ..?</h2>
              <p className="info-paragraph">Nithya Event is your one stop platform for discovering, booking, and celebrating events that bring people together.</p>
              <p className="info-paragraph">We connect users, vendors, and organizers to create seamless and memorable event experiences from small gatherings to grand festivals.</p>
            </div>

            <div className="info-media-col">
              <img src="/media/about-ban-nit.png" className="info-illustration" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
    
     <section className="abt-wrapper">
      <div className="abt-container">
        
        {/* Top Card */}
        <div className="abt-card">
          <div className="abt-card-inner">
            
            <div className="abt-text-col">
                <div className="abt-icon"><img src="/media/star.png" style={{width:'50px', height:'50px', objectFit:"cover"}}/></div>
               <div className="abt-plus"><img src="/media/plus.png" style={{width:'12px', height:'12px', objectFit:"cover"}}/></div>
              <h2 className="abt-headline">About Us</h2>
              
              <p className="abt-paragraph">Welcome to Nithyaevent, where your dreams come to life with ease and elegance. We specialize in offering premium event rental services to make every occasion unforgattable. Whether it's a wedding, corporate gathering, birthday celebration, or any special event, we provide a wide range of high-quality products to suit your unique needs.</p>
              <p className="abt-paragraph">With a focus on exceptional service and attention to detail, we take pride in delivering everything you need to create the perfect atmosphere. From furniture and decor to audio-visual equipment and bespoke setups, our diverse inventory ensures that your event reflects your vision and style</p>
              <p className="abt-paragraph">At Nithyaevent, our team of professionals is commited to making event planning stress-free and enjoyable. We go above and beyond to ensure timely delivery, seamless setup, and impeccable quality. Partner with us to transform your ideas into reality and create menories that last a lifetime.</p>
            </div>      
          </div>
        </div>
      </div>
    </section>

</>
  );
}
