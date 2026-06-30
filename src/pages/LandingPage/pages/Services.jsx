import React, { useState, useEffect, useRef } from "react";
import "./Services.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Services({ visibleCount = 3 }) {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const [thumb, setThumb] = useState({ width: 0, left: 0 });
  const [items, setItems] = useState([]);
  const listRef = useRef(null);

  // Fetch data from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("https://api.nithyaevent.com/api/service/get-all-service");
        const data = await response.json();
        
        if (data.message === "success" && data.data) {
          // Transform API data to match the expected format
          const transformedData = data.data.map(service => ({
            id: service._id,
            title: service.service_name,
            image: service.service_image
          }));
          setItems(transformedData);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        // Fallback to default items if API fails
        setItems([
          { id: 1, title: "Flex Banner Service", image: "/media/flex-banner.png" },
          { id: 2, title: "Man Power", image: "/media/man-power1.jpg" },
          { id: 3, title: "Event Tent", image: "/media/tent-house.jpg" },
          { id: 4, title: "Volenteer", image: "/media/volenteer.png" },
          { id: 5, title: "Security Personnel", image: "/media/security.jpg" },
          { id: 6, title: "Technical Support", image: "/media/support.jpg" },
          { id: 7, title: "Catering Support", image: "/media/catering.png" },
          { id: 8, title: "Tele Prompter", image: "/media/tele.jpeg" },
          { id: 9, title: "Artists", image: "/media/artist.jpeg" },
          { id: 10, title: "Flower Decoration", image: "/media/flower.png" },
          { id: 11, title: "Stage Designers", image: "/media/stage.png" },
          { id: 12, title: "Photographer", image: "/media/photography.png" },
          { id: 13, title: "Auditorium", image: "/media/auditorium.png" },
          { id: 14, title: "Freelancer", image: "/media/freelancer.png" },
          { id: 15, title: "Vendor & Seller", image: "/media/seller.png" },
          { id: 16, title: "Hotel", image: "/media/hotel.png" },
          { id: 17, title: "Resort", image: "/media/resort.png" }
        ]);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getVisible = () => {
    if (width < 520) return 1;
    if (width < 900) return 2;
    return visibleCount;
  };

  const visible = getVisible();

  const updateThumb = () => {
    const el = listRef.current;
    if (!el) return;

    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;
    const scrollLeft = el.scrollLeft;

    if (scrollWidth <= clientWidth) {
      setThumb({ width: 100, left: 0 });
      return;
    }

    const trackWidth = 100; 
    const thumbWidth = (clientWidth / scrollWidth) * trackWidth;
    const maxScrollLeft = scrollWidth - clientWidth;
    const left =
      maxScrollLeft === 0
        ? 0
        : (scrollLeft / maxScrollLeft) * (trackWidth - thumbWidth);

    setThumb({ width: thumbWidth, left });
  };

  useEffect(() => {
    updateThumb();
  }, [width, items.length]);

  const handleNext = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: el.offsetWidth, behavior: "smooth" });
  };

  const handlePrev = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: -el.offsetWidth, behavior: "smooth" });
  };

  return (
    <section className="ps-section" aria-label="Premium services">
      <div className="ps-container">
        <div className="ps-header">
          <h3>Explore Our Premium Services</h3>

          <div className="ps-nav">
            <button
              type="button"
              className="ps-nav-btn"
              onClick={handlePrev}
              aria-label="Previous services"
            >
              <FaArrowLeft />
            </button>
            <button
              type="button"
              className="ps-nav-btn"
              onClick={handleNext}
              aria-label="Next services"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div className="ps-scroll-outer">
          <ul
            className="ps-scroll-row"
            ref={listRef}
            onScroll={updateThumb}
          >
            {items.map((it) => (
              <li
                className="ps-item"
                key={it.id}
                style={{ flex: `0 0 ${100 / visible}%` }} 
              >
                <div className="ps-card">
                  <div className="ps-card-img">
                    <img src={it.image} alt={it.title} loading="lazy" />
                  </div>
                </div>
                <h4 className="ps-card-title">{it.title}</h4>
              </li>
            ))}
          </ul>

          <div className="ps-custom-scrollbar">
            <div
              className="ps-custom-scrollbar-thumb"
              style={{
                width: `${thumb.width}%`,
                left: `${thumb.left}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
// import React, { useState, useEffect, useRef } from "react";
// import "./Services.css";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// export default function Services({ visibleCount = 3 }) {
//   const [width, setWidth] = useState(
//     typeof window !== "undefined" ? window.innerWidth : 1280
//   );
//   const [thumb, setThumb] = useState({ width: 0, left: 0 });
//   const listRef = useRef(null);

//   useEffect(() => {
//     const onResize = () => setWidth(window.innerWidth);
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   const getVisible = () => {
//     if (width < 520) return 1;
//     if (width < 900) return 2;
//     return visibleCount;
//   };

//   const visible = getVisible();

//   const items = [
//     { id: 1, title: "Flex Banner Service", image: "/media/flex-banner.png" },
//     { id: 2, title: "Man Power", image: "/media/man-power1.jpg" },
//     { id: 3, title: "Event Tent", image: "/media/tent-house.jpg" },
//     { id: 4, title: "Volenteer", image: "/media/volenteer.png" },
//     { id: 5, title: "Security Personnel", image: "/media/security.jpg" },
//     { id: 6, title: "Technical Support", image: "/media/support.jpg" },
//     { id: 7, title: "Catering Support", image: "/media/catering.png" },
//     { id: 8, title: "Tele Prompter", image: "/media/tele.jpeg" },
//     { id: 9, title: "Artists", image: "/media/artist.jpeg" },
//     { id: 10, title: "Flower Decoration", image: "/media/flower.png" },
//     { id: 11, title: "Stage Designers", image: "/media/stage.png" },
//     { id: 12, title: "Photographer", image: "/media/photography.png" },
//     { id: 13, title: "Auditorium", image: "/media/auditorium.png" },
//     { id: 14, title: "Freelancer", image: "/media/freelancer.png" },
//     { id: 15, title: "Vendor & Seller", image: "/media/seller.png" },
//     { id: 16, title: "Hotel", image: "/media/hotel.png" },
//     { id: 17, title: "Resort", image: "/media/resort.png" }
//   ];

//   const updateThumb = () => {
//     const el = listRef.current;
//     if (!el) return;

//     const scrollWidth = el.scrollWidth;
//     const clientWidth = el.clientWidth;
//     const scrollLeft = el.scrollLeft;

//     if (scrollWidth <= clientWidth) {
//       setThumb({ width: 100, left: 0 });
//       return;
//     }

//     const trackWidth = 100; 
//     const thumbWidth = (clientWidth / scrollWidth) * trackWidth;
//     const maxScrollLeft = scrollWidth - clientWidth;
//     const left =
//       maxScrollLeft === 0
//         ? 0
//         : (scrollLeft / maxScrollLeft) * (trackWidth - thumbWidth);

//     setThumb({ width: thumbWidth, left });
//   };

//   useEffect(() => {
//     updateThumb();
//   }, [width, items.length]);

//   const handleNext = () => {
//     const el = listRef.current;
//     if (!el) return;
//     el.scrollBy({ left: el.offsetWidth, behavior: "smooth" });
//   };

//   const handlePrev = () => {
//     const el = listRef.current;
//     if (!el) return;
//     el.scrollBy({ left: -el.offsetWidth, behavior: "smooth" });
//   };

//   return (
//     <section className="ps-section" aria-label="Premium services">
//       <div className="ps-container">
//         <div className="ps-header">
//           <h3>Explore Our Premium Services</h3>

//           <div className="ps-nav">
//             <button
//               type="button"
//               className="ps-nav-btn"
//               onClick={handlePrev}
//               aria-label="Previous services"
//             >
//               <FaArrowLeft />
//             </button>
//             <button
//               type="button"
//               className="ps-nav-btn"
//               onClick={handleNext}
//               aria-label="Next services"
//             >
//               <FaArrowRight />
//             </button>
//           </div>
//         </div>

//         <div className="ps-scroll-outer">
//           <ul
//             className="ps-scroll-row"
//             ref={listRef}
//             onScroll={updateThumb}
//           >
//             {items.map((it) => (
//               <li
//                 className="ps-item"
//                 key={it.id}
//                 style={{ flex: `0 0 ${100 / visible}%` }} 
//               >
//                 <div className="ps-card">
//                   <div className="ps-card-img">
//                     <img src={it.image} alt={it.title} loading="lazy" />
//                   </div>
//                 </div>
//                 <h4 className="ps-card-title">{it.title}</h4>
//               </li>
//             ))}
//           </ul>

         
//           <div className="ps-custom-scrollbar">
//            <div
//   className="ps-custom-scrollbar-thumb"
//   style={{
//     width: `${thumb.width}%`,
//     left: `${thumb.left}%`,
//   }}
// />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
