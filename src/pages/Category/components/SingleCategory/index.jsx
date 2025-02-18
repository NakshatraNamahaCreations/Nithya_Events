import { Box, Button, Typography } from "@mui/material";
import "./styles.scss";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../redux/slice/CartSlice";

const SingleCategory = () => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
      dispatch(addToCart(product));
        setOpen(true);  
  }
  return (
    <Box className="product-container">
      <Box
        style={{
          display: "flex",
          marginTop: "8rem",
          gap: "10rem",
          marginLeft: "10rem",
        }}
      >
        <Box className="product-content">
          <img
            className="image-container-01"
            src="https://5.imimg.com/data5/UN/LU/SD/SELLER-81092709/sound-speaker.jpg"
            alt="Not found"
          />
          <Button variant="outlined" className="addToCart" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Box>
        <Box>
          <Box
            style={{
              width: "30rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.4rem",
            }}
          >
            <Typography sx={{ fontSize: "30px" }}>Helloe</Typography>
            <Typography
              className="rating"
              variant="body2"
              sx={{ color: "text.secondary" }}
            >
              <Box className="Rating-point">
                <Typography className="Rating-container">3.5 ⭐</Typography>
                <Typography className="Rating-num">121 Rating</Typography>
              </Box>
            </Typography>

            <Box className="Price-point">
              <Typography sx={{ fontSize: "1.2rem" }}>
                <strong>RS 25000 / day</strong>
              </Typography>
              <Typography className="Offer">25% OFF</Typography>
            </Box>
            <Box className="Product-description">
              <Typography sx={{ fontSize: "1.2rem" }}>
              A product description is a piece of marketing copy (usually a short paragraph) that explains what a product is and why it’s worth purchasing. The goal of a product description is to inform potential customers about the features and benefits of the product so they can make an informed buying decision. In essence, it’s a short online sales pitch.
              </Typography>
           
            </Box>
          </Box>
          <Box className="Product-detail-container">
            <Typography variant="h6" className="Product-detail-heading">
              Product Details
            </Typography>
            <Box className="Product-detail">
              <Box className="tab1-content">
                <Typography>Brand:</Typography>
                <Typography>Product Category:</Typography>
                <Typography>Model Name:</Typography>
                <Typography>Product Dimensions:</Typography>
                <Typography>Item Weight:</Typography>
                <Typography>Material Type:</Typography>
                <Typography>Color:</Typography>
                <Typography>Warranty Type:</Typography>
              </Box>
              <Box className="tab2-content">
                <Typography>RCF</Typography>
                <Typography>Sound</Typography>
                <Typography> RCF</Typography>
                <Typography>27.5 x 25.8 x 51.5 cm</Typography>
                <Typography>16 kg 900 g</Typography>
                <Typography> Plastic</Typography>
                <Typography> Black and White</Typography>
                <Typography>12 to 2 years</Typography>
              </Box>
            </Box>
          </Box>

          <Box className="Spec-container">
            <Typography variant="h6" className="Spec-detail-heading">
              Specifications
            </Typography>
            <Box className="Spec-detail">
              <Box className="tab1-content">
                <Typography>Brand:</Typography>
                <Typography>Product Category:</Typography>
                <Typography>Model Name:</Typography>
                <Typography>Product Dimensions:</Typography>
                <Typography>Item Weight:</Typography>
                <Typography>Material Type:</Typography>
                <Typography>Color:</Typography>
                <Typography>Warranty Type:</Typography>
              </Box>
              <Box className="tab2-content">
                <Typography>RCF</Typography>
                <Typography>Sound</Typography>
                <Typography> RCF</Typography>
                <Typography>27.5 x 25.8 x 51.5 cm</Typography>
                <Typography>16 kg 900 g</Typography>
                <Typography> Plastic</Typography>
                <Typography> Black and White</Typography>
                <Typography>12 to 2 years</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SingleCategory;
