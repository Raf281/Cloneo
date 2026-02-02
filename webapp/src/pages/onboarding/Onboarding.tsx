import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Main onboarding page that redirects to the first step
const Onboarding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the first step of onboarding
    navigate("/onboarding/avatar", { replace: true });
  }, [navigate]);

  return null;
};

export default Onboarding;
