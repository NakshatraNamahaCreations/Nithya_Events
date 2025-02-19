import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const PrivacyPolicy = () => {
  const privacyContent = `
    <h3>1. Introduction</h3>
    <p>Welcome to NithyaEvent. Your privacy is important to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website, and mobile application nithyaevent.com, or use our services. By using our website or services, you consent to the practices described in this policy.</p>
    <h3>2. Information Storage and Security</h3>
    <p>We store and process your information, including any sensitive financial information (as defined under the Information Technology Act, 2000), on secure computers protected by both physical and technological security measures. These practices comply with the Information Technology Act, 2000, and the rules thereunder. If you have any objections to your information being transferred or used in this manner, please do not use our platform.</p>
    <h3>3. Legal Disclosure</h3>
    <p>We may disclose your personal information when required by law or in good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal processes. This may include disclosure to law enforcement, third-party rights owners, or others if we believe it is necessary to enforce our Terms or Privacy Policy, respond to claims that content violates the rights of a third party, or protect the rights, property, or personal safety of our users or the general public.</p>
    <h3>4. Business Transactions</h3>
    <p>In the event of a merger, acquisition, or reorganization of our business, we and our affiliates may share or sell some or all of your personal information to another business entity. Should such a transaction occur, the new entity will be required to adhere to this Privacy Policy concerning your personal information.</p>
    <h3>5. Information We Collect</h3>
    <ul>
      <li><strong>Personal Information:</strong> We may collect personal information that you provide to us when you register on our site, place an order, subscribe to our newsletter, or communicate with us. This may include your name, email address, phone number, payment information, and delivery address.</li>
      <li><strong>Non-Personal Information:</strong> We may also collect non-personal information automatically when you visit our site. This may include your IP address, browser type, operating system, pages visited, time spent on the site, and referring website.</li>
    </ul>
    <h3>6. How We Use Your Information</h3>
    <ul>
      <li>To process your transactions and manage your rental orders.</li>
      <li>To improve our website and services based on your feedback and usage.</li>
      <li>To communicate with you regarding your account, orders, or services.</li>
      <li>To send periodic emails about your order or other products and services.</li>
      <li>To comply with applicable laws and regulations.</li>
    </ul>
    <h3>7. Security of Your Information</h3>
    <p>We implement a variety of security measures to maintain the safety of your personal information. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
    <h3>8. Cookies and Tracking Technologies</h3>
    <p>Our website may use cookies and similar tracking technologies to enhance user experience. You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can modify your browser setting to decline cookies if you prefer.</p>
    <h3>9. Third-Party Links</h3>
    <p>Our website may contain links to third-party websites. We do not control these websites and are not responsible for their content or privacy practices. We encourage you to review the privacy policies of any third-party websites you visit.</p>
    <h3>10. Changes to This Privacy Policy</h3>
    <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically for any changes.</p>
    <h3>11. Contact Us</h3>
    <p>If you have any questions about this Privacy Policy, please contact us at:</p>
    <ul>
      <li><strong>Email:</strong> Support@nithyaevents.com</li>
      <li><strong>Address:</strong> Kadagam Ventures Private Limited, No: 34 Venkatappa Road, Tasker Town, Off Queens Road, Bangalore 560051.</li>
    </ul>
  `;

  return (
    <Box mt={6}>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
      >
        Privacy Policy
      </Typography>
      <Box>
        <Box
          sx={{ mb: 1 }}
          dangerouslySetInnerHTML={{ __html: privacyContent }}
        />
      </Box>
    </Box>
  );
};

export default PrivacyPolicy;
