import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Rating,
  Button,
  Avatar,
  Modal,
  Grid,
  Chip,
} from "@mui/material";
// import Carousel from "react-material-ui-carousel";
import authService from "../../../../api/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
import { getErrorMessage } from "../../../../utils/helperFunc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Review = ({ onSubmit, productId, userId }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState("");
  const [visibleReview, setvisibleReview] = useState(5);
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.auth.userDetails);
  // let visibleReview =5;
  const navigate = useNavigate();

  const fetchProductReview = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getReview(productId);
      setReviews(res.data.reviews || []);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      getErrorMessage(error);
    }
  };

  useEffect(() => {
    fetchProductReview();
  }, [productId]);

  const handleOpen = () => {
    if(!userId){
        toast.error("You need to login", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/login");
    }
    else{

      setOpen(true);
    }
  }
  const handleClose = () => {
    setOpen(false);
    resetFields();
  };

  const resetFields = () => {
    setRating(0);
    setReviewTitle("");
    setReviewContent("");
    setUploadedImage(null);
    setError("");
  };

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!reviewContent.trim()) {
      setError("Please provide a description.");
      return;
    }

    const reviewData = {
      user_id: userDetails._id,
      user_name: userDetails.username,
      review_title: reviewTitle,
      review_description: reviewContent,
      ratings: rating,
      uploaded_image: uploadedImage,
    };

    setReviews((prevReviews) => [reviewData, ...prevReviews]);

    if (onSubmit) onSubmit(reviewData);

    handleClose();
  };

  const getRatingSummary = () => {
    const totalReviews = reviews.length;
    const summary = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((review) => review.ratings === star).length;
      return {
        star,
        count,
        percentage: totalReviews ? (count / totalReviews) * 100 : 0,
      };
    });
    return summary;
  };

  const images = reviews
    .filter((review) => review.uploaded_image)
    .map((review) => review.uploaded_image);

  return (
    <>
      <Typography
        variant="h5"
        sx={{ textAlign: "center", marginBottom: "1rem" }}
      >
        Customer Reviews
      </Typography>
      <Box
        sx={{
          width: "100%",
          margin: "auto",
          padding: "2rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          // boxShadow: 3,
          display: "flex",

          "@media(min-width:400px) and (max-width:900px)": {
            flexDirection: "column",
          },
        }}
      >
        {/* Ratings Summary */}
        <Box sx={{ marginBottom: "2rem" }}>
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            {reviews.length > 0
              ? `${(
                  reviews.reduce((sum, review) => sum + review.ratings, 0) /
                  reviews.length
                ).toFixed(1)} out of 5`
              : "No ratings yet"}
          </Typography>
          {getRatingSummary().map((item) => (
            <Box
              key={item.star}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <Typography variant="body2" sx={{ minWidth: "50px" }}>
                {item.star} star
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: "#e0e0e0",
                  height: "10px",
                  borderRadius: "5px",
                  marginX: "0.5rem",
                  width: "20rem",
                  marginLeft: "119px",
                }}
              >
                <Box
                  sx={{
                    width: `${item.percentage}%`,
                    backgroundColor: "#ffc107",
                    height: "10px",
                    borderRadius: "5px",
                  }}
                />
              </Box>
              <Typography variant="body2">{item.count}</Typography>
            </Box>
          ))}
        </Box>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <Box>
            {reviews.slice(0, visibleReview-1).map((review, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                  padding: "1rem",
                  borderBottom: "1px solid #e0e0e0",
                  width: "52rem",
                  marginLeft: "50px",
                  "@media(min-width:400px) and (max-width:900px)": {
                    width: "23rem",
                  },
                }}
                className="hello"
              >
                <Avatar>{review.user_name[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {review.user_name}
                  </Typography>
                  <Rating value={review.ratings} readOnly size="small" />
                  <Typography variant="body2">{review.review_title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.review_description}
                  </Typography>
                  {review.uploaded_image && (
                    <Box
                      component="img"
                      src={review.uploaded_image}
                      alt="Review"
                      sx={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "8px",
                        marginTop: "0.5rem",
                      }}
                    />
                  )}
                </Box>
              </Box>
            ))}
              {reviews.length > 5 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#c026d3",
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#9b1a99" },
                
                  }}
                  onClick={() => {
                    if (visibleReview >= reviews.length) {
                
                      setvisibleReview(5);
                    } else {
                                  
                      setvisibleReview((prev) => prev + 5);
                    }
                  }}
                >
                  {visibleReview >= reviews.length ? "Show Less" : "Show More"}
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Typography sx={{ textAlign: "center", margin: "0 auto" }}>
            No reviews yet.
          </Typography>
        )}
          </Box>
        

      {/* Write a Review Button */}
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          display: "block",
          margin: "2rem auto",
          backgroundColor: "#c026d3",
          color: "#fff",
          textTransform: "none",
          "&:hover": { backgroundColor: "#9b1a99" },
        }}
      >
        Write a Review
      </Button>

      {/* Modal for Writing a Review */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="review-modal-title"
        aria-describedby="review-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography
            id="review-modal-title"
            variant="h6"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Share Your Thoughts
          </Typography>

          <Rating
            name="rating"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            sx={{ alignSelf: "center", marginBottom: "1rem" }}
          />

          {/* <TextField
            label="Review Title"
            variant="outlined"
            fullWidth
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            sx={{
              backgroundColor: "#fafafa",
              borderRadius: "8px",
            }}
          /> */}

          <TextField
            label="Review Content"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            sx={{
              backgroundColor: "#fafafa",
              borderRadius: "8px",
            }}
          />

          {error && (
            <Typography
              color="error"
              variant="body2"
              sx={{ textAlign: "center" }}
            >
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#c026d3",
              color: "#fff",
              borderRadius: "20px",
              textTransform: "none",
              padding: "12px 25px",
              "&:hover": { backgroundColor: "#388e3c" },
            }}
          >
            Submit Review
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Review;
