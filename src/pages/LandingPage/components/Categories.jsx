
import "./Categories.css";
import { useNavigate } from "react-router-dom";

export default function CategoryNav({
  categories = ["Sound", "Lighting", "Video", "Fabrication", "Shamiana", "Genset"],
  active = "none",
  onChange = () => {},
}) {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // Convert category to lowercase for the route
    const routeCategory = category.toLowerCase();
    navigate(`/category/${routeCategory}`);
    
    // Call the original onChange callback if provided
    if (onChange) {
      onChange(category);
    }
  };

  return (
    <div className="cn-wrapper" role="navigation" aria-label="Categories">
      <div className="cn-inner">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              className={`cn-item ${isActive ? "active" : ""}`}
              aria-pressed={isActive}
              onClick={() => handleCategoryClick(cat)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCategoryClick(cat);
                }
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}



// import "./Categories.css";

// export default function CategoryNav({
//   categories = ["Sound", "Lighting", "Video", "Fabrication", "Shamiana", "Genset"],
//   active = "none",
//   onChange = () => {},
// }) {
//   return (
//     <div className="cn-wrapper" role="navigation" aria-label="Categories">
//       <div className="cn-inner">
//         {categories.map((cat) => {
//           const isActive = cat === active;
//           return (
//             <button
//               key={cat}
//               type="button"
//               className={`cn-item ${isActive ? "active" : ""}`}
//               aria-pressed={isActive}
//               onClick={() => onChange(cat)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" || e.key === " ") {
//                   e.preventDefault();
//                   onChange(cat);
//                 }
//               }}
//             >
//               {cat}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
