import React from "react";
import Customer from "../../../../assets/happy.gif";
import Projects from "../../../../assets/projects.gif";
import Success from "../../../../assets/award.gif";
import Uptime from "../../../../assets/upTimes.gif";
import "./styles.scss";
import { Typography } from "@mui/material";

const Achievements = () => {
  const achievements = [
    { icon: Success, label: "Awards", value: "204" },
    { icon: Projects, label: "Projects", value: "1024" },
    { icon: Customer, label: "Happy clients", value: "1024" },
    { icon: Uptime, label: "Up Time", value: "99" },
  ];

  const packages = [
    {
      title: "Ultimate",
      price: "$45.99",
      frequency: "/mo per user",
      features: [
        "5 Auto-Attendants",
        "5 Hunt Groups",
        "10 Included DID #'s",
        "Voice",
        "Voicemail",
      ],
      unavailable: ["Unified Messaging", "Mobile Connect", "Phone Video"],
    },
    {
      title: "Ultimate",
      price: "$45.99",
      frequency: "/mo per user",
      features: [
        "5 Auto-Attendants",
        "5 Hunt Groups",
        "10 Included DID #'s",
        "Voice",
        "Voicemail",
        "Unified Messaging",
        "Mobile Connect",
      ],
      unavailable: ["Phone Video"],
    },
    {
      title: "Ultimate",
      price: "$45.99",
      frequency: "/mo per user",
      features: [
        "5 Auto-Attendants",
        "5 Hunt Groups",
        "10 Included DID #'s",
        "Voice",
        "Voicemail",
        "Unified Messaging",
        "Mobile Connect",
        "Phone Video",
      ],
      unavailable: [],
    },
  ];

  return (
    <>
      <section className="numbers-achievements">
        <Typography variant="h5" className="achieve-subHeading">
          They Trust Us
        </Typography>

        <Typography className="achieve-heading" variant="h2">
          Achievements & Awards
        </Typography>
        <div className="achievements">
          {achievements.map((item, index) => (
            <div className="achievement" key={index}>
              <img src={item.icon} className="icon" />
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="packages">
        <h2>Our Packages</h2>
        <div className="package-list">
          {packages.map((pkg, index) => (
            <div className="package" key={index}>
              <h3>{pkg.title}</h3>
              <div className="price">
                <span>{pkg.price}</span>
                <span>{pkg.frequency}</span>
              </div>
              <ul className="features">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="available">
                    {feature}
                  </li>
                ))}
                {pkg.unavailable.map((feature, i) => (
                  <li key={i} className="unavailable">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Achievements;
