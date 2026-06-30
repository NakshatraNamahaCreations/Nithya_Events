import "./ClientBanner.css";

export default function ClientBanner() {
  return (
    <>
      <div className="par-bg">
        <section className="par-section">
          <div className="par-heading">
            <h2>Want to be Partner with nithyaevent</h2>
          </div>
          <div className="par-image">
            <img src="/media/hero-main.png" alt="Contact Banner" />
          </div>
        </section>
      </div>

      <section className="par-sec">
          <div>
            <img src="/media/flow-step1.jpeg" className="step1-img"/>
          </div>
        </section>

         <section className="par-sec">
          <div>
            <img src="/media/flow-step2.jpeg" className="step2-img"/>
          </div>
        </section>

          <section className="par-sec">
          <div>
            <img src="/media/flow-step3.jpeg" className="step3-img"/>
          </div>
        </section>
    </>
  );
}
