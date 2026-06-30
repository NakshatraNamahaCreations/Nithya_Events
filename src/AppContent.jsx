import { Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import ScrollToTop from "./utils/ScrollToTop";
import { Box } from "@mui/material";

function AppContent() {
  const location = useLocation();
  const loading = useSelector((state) => state.loader.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const isLandingPage = location.pathname === "/landing-page";

  return (
    <>
      <Loading loading={loading} />
      <ScrollToTop />

      <Box style={{ paddingTop: isLandingPage ? "0" : "4rem" }}>
        <Suspense fallback={<Loading />}>
          {!isLandingPage && <PageHeader />}
          <Routes>
            {/* All your routes */}
            <Route path="/landing-page" element={<LandingPage />} />
            {/* Other routes */}
          </Routes>
          {!isLandingPage && <Footer />}
        </Suspense>
      </Box>
    </>
  );
}