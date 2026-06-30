import React, { useState } from 'react';
import { FiMapPin, FiSearch, FiHeart, FiShoppingCart, FiLayers, FiCalendar, FiUser, FiMenu, FiX } from 'react-icons/fi';
import './NavbarMenu.css';
import { FaChevronDown, FaRegUserCircle, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaLocationDot } from 'react-icons/fa6';


export default function NavbarMenu() {
const [mobileOpen, setMobileOpen] = useState(false);
const navigate = useNavigate();


return (
<header className="ne-header">
<div className="ne-container">
<div className="ne-left">
<div className="ne-logo">
  <Link to="/" className="ne-logo-link">
    <h4>Nithyaevent</h4>
  </Link>
</div>


</div>


<div className="ne-center">
<div className="ne-search">
<FiSearch className="ne-search-icon" />
<input className="ne-search-input" placeholder='Search "Products"' />
</div>
</div>

<div className='ne-center'>
  <div className='ne-loc'>
    <FaLocationDot className='ne-loc-icon'/>
    <input className='ne-location-input' placeholder='Vittal Mallya Road...'/>
    <div className='ne-mobile-arrow'> <FaChevronDown/></div>
  </div>
  
   </div>




<nav className="ne-right">
    <button className="ne-icon-btn"><FiCalendar size={22}/><span>Calendar</span></button>
<button className="ne-icon-btn"><FiHeart size={22}/><span>Wishlist</span></button>
<button className="ne-icon-btn"><FiShoppingCart size={22}/><span>Cart</span></button>
<button className="ne-icon-btn"><FaRegUserCircle size={22}/><span>Profile</span></button>
</nav>


<button className="ne-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="menu">
{mobileOpen ? <FiX size={22}/> : <FiMenu size={22}/>}
</button>
</div>


<div className={"ne-mobile-drawer " + (mobileOpen ? 'open' : '')}>
<div className="ne-mobile-inner">
<div className="ne-mobile-location">
<FiMapPin/> <div>
<div className="ne-mobile-loc-title">Your Location</div>
<div className="ne-mobile-loc-sub">Fetching location...</div>
<div className='ne-mobile-arrow'> <FaChevronDown/></div>
</div>
</div>


<div className="ne-mobile-search">
<input placeholder='Search "Products"' />
</div>


<div className="ne-mobile-actions">
<button className="ne-mobile-action"><FiHeart/> Wishlist</button>
<button className="ne-mobile-action"><FiShoppingCart/> Cart</button>
<button className="ne-mobile-action"><FiLayers/> Mood Board</button>
<button className="ne-mobile-action"><FiCalendar/> Calendar</button>
<button className="ne-mobile-action"><FiUser/> Login</button>
</div>
</div>
</div>
</header>
);
}