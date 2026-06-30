// import React from "react";
// import { Box, Typography, Paper } from "@mui/material";

// const PrivacyPolicy = () => {
//   const privacyContent = `
//     <h3>1. Introduction</h3>
//     <p> Welcome to NithyaEvent. Your privacy is important to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website, And  Mobile Application  nithyaevent.com, or use our services. By using our website or services, you consent to the practices described in this policy.</p>
//     <h3>2. Information Storage and Security</h3>
//     <p>We store and process your information, including any sensitive financial information (as defined under the Information Technology Act, 2000), on secure computers protected by both physical and technological security measures. These practices comply with the Information Technology Act, 2000, and the rules thereunder. If you have any objections to your information being transferred or used in this manner, please do not use our platform.</p>
//     <h3>3. Legal Disclosure</h3>
//     <p>We may disclose your personal information when required by law or in good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal processes. This may include disclosure to law enforcement, third-party rights owners, or others if we believe it is necessary to enforce our Terms or Privacy Policy, respond to claims that content violates the rights of a third party, or protect the rights, property, or personal safety of our users or the general public.</p>
//     <h3>4. Business Transactions</h3>
//     <p>In the event of a merger, acquisition, or reorganization of our business, we and our affiliates may share or sell some or all of your personal information to another business entity. Should such a transaction occur, the new entity will be required to adhere to this Privacy Policy concerning your personal information.</p>
//     <h3>5. Information We Collect</h3>
//     <ul>
//       <li><strong>Personal Information:</strong> We may collect personal information that you provide to us when you register on our site, place an order, subscribe to our newsletter, or communicate with us. This may include your name, email address, phone number, payment information, and delivery address.</li>
//       <li><strong>Non-Personal Information:</strong> We may also collect non-personal information automatically when you visit our site. This may include your IP address, browser type, operating system, pages visited, time spent on the site, and referring website.</li>
//     </ul>
//     <h3>6. How We Use Your Information</h3>
//     <ul>
//       <li>To process your transactions and manage your rental orders.</li>
//       <li>To improve our website and services based on your feedback and usage.</li>
//       <li>To communicate with you regarding your account, orders, or services.</li>
//       <li>To send periodic emails about your order or other products and services.</li>
//       <li>To comply with applicable laws and regulations.</li>
//     </ul>
//     <h3>7. Security of Your Information</h3>
//     <p>We implement a variety of security measures to maintain the safety of your personal information. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
//     <h3>8. Cookies and Tracking Technologies</h3>
//     <p>Our website may use cookies and similar tracking technologies to enhance user experience. You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can modify your browser setting to decline cookies if you prefer.</p>
//     <h3>9. Third-Party Links</h3>
//     <p>Our website may contain links to third-party websites. We do not control these websites and are not responsible for their content or privacy practices. We encourage you to review the privacy policies of any third-party websites you visit.</p>
//     <h3>10. Changes to This Privacy Policy</h3>
//     <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically for any changes.</p>
//     <h3>11. Contact Us</h3>
//     <p>If you have any questions about this Privacy Policy, please contact us at:</p>
//     <ul>
//       <li><strong>Email:</strong> support@nithyaevents.com</li>
//       <li><strong>Address:</strong> Kadagam Ventures Private Limited, No: 34 Venkatappa Road, Tasker Town, Off Queens Road, Bangalore 560051.</li>
//             <li><strong>Help Center:</strong> +91 8867999997</li>
//     </ul>
//   `;

//   return (
//     <Box mt={6} pl={8} pr={8} pt={2} pb={8}>
//       <Typography
//         variant="h5"
//         sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
//       >
//         Privacy Policy
//       </Typography>
//       <Box>
//         <Box
//           sx={{ mb: 1 }}
//           dangerouslySetInnerHTML={{ __html: privacyContent }}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default PrivacyPolicy;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          mt: 2,
          // position: 'sticky',
          top: 0,
          zIndex: 1000,
          bgcolor: 'white',
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon fontSize="medium" />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontFamily: 'Montserrat, sans-serif', color: 'black', textAlign:"center" }}
        >
          PRIVACY POLICY
        </Typography>
      </Paper>

      {/* Scrollable Content */}
      <Box sx={{ px: 3, py: 2, maxWidth: 800, mx: 'auto' }}>
        <SectionHeader>1. Introduction</SectionHeader>
        <Paragraph>
          Welcome to NithyaEvent. Your privacy is important to us. This Privacy
          Policy outlines how we collect, use, disclose, and safeguard your
          information when you visit our website, and mobile application
          nithyaevent.com, or use our services. By using our website or services,
          you consent to the practices described in this policy.
        </Paragraph>

        <SectionHeader>Information Storage and Security</SectionHeader>
        <Paragraph>
          We store and process your information, including any sensitive financial
          information (as defined under the Information Technology Act, 2000), on
          secure computers protected by both physical and technological security
          measures. These practices comply with the Information Technology Act,
          2000, and the rules thereunder. If you have any objections to your
          information being transferred or used in this manner, please do not use
          our platform.
        </Paragraph>

        <SectionHeader>Legal Disclosure</SectionHeader>
        <Paragraph>
          We may disclose your personal information when required by law or in
          good faith belief that such disclosure is reasonably necessary to
          respond to subpoenas, court orders, or other legal processes. This may
          include disclosure to law enforcement, third-party rights owners, or
          others if we believe it is necessary to enforce our Terms or Privacy
          Policy, respond to claims that content violates the rights of a third
          party, or protect the rights, property, or personal safety of our users
          or the general public.
        </Paragraph>

        <SectionHeader>I. Information Storage and Security</SectionHeader>
        <Paragraph>
          We store and process your information, including any sensitive financial
          information (as defined under the Information Technology Act, 2000), on
          secure computers protected by both physical and technological security
          measures. These practices comply with the Information Technology Act,
          2000, and the rules thereunder. If you have any objections to your
          information being transferred or used in this manner, please do not use
          our platform.
        </Paragraph>

        <SectionHeader>II. Business Transactions</SectionHeader>
        <Paragraph>
          In the event of a merger, acquisition, or reorganization of our
          business, we and our affiliates may share or sell some or all of your
          personal information to another business entity. Should such a
          transaction occur, the new entity will be required to adhere to this
          Privacy Policy concerning your personal information.
        </Paragraph>

        <SectionHeader>2. Information We Collect</SectionHeader>
        <Paragraph>
          <Bold>• Personal Information:</Bold> We may collect personal information that you
          provide to us when you register on our site, place an order, subscribe to
          our newsletter, or communicate with us. This may include your name, email
          address, phone number, payment information, and delivery address.
        </Paragraph>

        <Paragraph>
          <Bold>• Non-Personal Information:</Bold> We may also collect non-personal
          information automatically when you visit our site. This may include your
          IP address, browser type, operating system, pages visited, time spent on
          the site, and referring website.
        </Paragraph>

        <SectionHeader>3. How We Use Your Information</SectionHeader>
        <Paragraph>We use the information we collect in the following ways:</Paragraph>
        <ListItem>• To process your transactions and manage your rental orders.</ListItem>
        <ListItem>• To improve our website and services based on your feedback and usage.</ListItem>
        <ListItem>• To communicate with you regarding your account, orders, or services.</ListItem>
        <ListItem>• To send periodic emails about your order or other products and services.</ListItem>
        <ListItem>• To comply with applicable laws and regulations.</ListItem>

        <SectionHeader>4. Disclosure of Your Information</SectionHeader>
        <Paragraph>
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your consent, except as described in this
          policy. We may share your information with:
        </Paragraph>

        <Paragraph>
          <Bold>• Service Providers:</Bold> We may share your information with third-party
          service providers who assist us in operating our website, conducting our
          business, or servicing you. These parties are obligated to keep your
          information confidential.
        </Paragraph>

        <Paragraph>
          <Bold>• Legal Requirements:</Bold> We may disclose your information if required to
          do so by law or in response to valid requests by public authorities.
        </Paragraph>

        <SectionHeader>5. Security of Your Information</SectionHeader>
        <Paragraph>
          We implement a variety of security measures to maintain the safety of
          your personal information. However, please be aware that no method of
          transmission over the internet or method of electronic storage is 100%
          secure. While we strive to use commercially acceptable means to protect
          your personal information, we cannot guarantee its absolute security.
        </Paragraph>

        <SectionHeader>6. Your Rights</SectionHeader>
        <Paragraph>You have the right to:</Paragraph>
        <ListItem>• Access your personal information and request corrections.</ListItem>
        <ListItem>• Request the deletion of your personal information.</ListItem>
        <ListItem>• Object to the processing of your personal information.</ListItem>
        <ListItem>• Withdraw consent where we rely on your consent to process your information.</ListItem>

        <SectionHeader>7. Cookies and Tracking Technologies</SectionHeader>
        <Paragraph>
          Our website may use cookies and similar tracking technologies to enhance
          user experience. You can choose to accept or decline cookies. Most web
          browsers automatically accept cookies, but you can modify your browser
          setting to decline cookies if you prefer.
        </Paragraph>

        <SectionHeader>8. Third-Party Links</SectionHeader>
        <Paragraph>
          Our website may contain links to third-party websites. We do not control
          these websites and are not responsible for their content or privacy
          practices. We encourage you to review the privacy policies of any
          third-party websites you visit.
        </Paragraph>

        <SectionHeader>9. Changes to This Privacy Policy</SectionHeader>
        <Paragraph>
          We may update this Privacy Policy from time to time. Any changes will be
          posted on this page with an updated effective date. We encourage you to
          review this policy periodically for any changes.
        </Paragraph>

        <SectionHeader>10. Contact Us</SectionHeader>
        <Paragraph>
          If you have any questions about this <Bold>TERMS AND CONDITIONS Privacy Policy,</Bold>{' '}
          please contact us at:
        </Paragraph>

        <ListItem>• <Bold>Email:</Bold> support@nithyaevents.com</ListItem>
        <ListItem>• <Bold>Address:</Bold> Kadagam Ventures Private Limited</ListItem>
        <ListItem>• No: 34, Venkatappa Road, Tasker Town</ListItem>
        <ListItem sx={{ mb: 6 }}>• Off Queens Road, Bangalore 560051</ListItem>
      </Box>
    </Box>
  );
};

// ===== Subcomponents =====
const SectionHeader = ({ children }) => (
  <Typography
    variant="subtitle1"
    sx={{
      fontSize: 15,
      mt: 2,
      mb: 1,
      color: '#4f4f4f',
      fontWeight: 600,
      fontFamily: 'Montserrat, sans-serif',
    }}
  >
    {children}
  </Typography>
);

const Paragraph = ({ children }) => (
  <Typography
    variant="body2"
    sx={{
      fontSize: 13,
      lineHeight: 1.8,
      mb: 1,
      color: '#555',
      textAlign: 'justify',
      fontFamily: 'Montserrat, sans-serif',
    }}
  >
    {children}
  </Typography>
);

const Bold = ({ children }) => (
  <Box component="span" sx={{ fontWeight: 600 }}>
    {children}
  </Box>
);

const ListItem = ({ children, sx }) => (
  <Typography
    variant="body2"
    sx={{
      fontSize: 13,
      lineHeight: 1.8,
      mb: 0.5,
      color: '#555',
      fontFamily: 'Montserrat, sans-serif',
      ...sx,
    }}
  >
    {children}
  </Typography>
);

export default PrivacyPolicy;
