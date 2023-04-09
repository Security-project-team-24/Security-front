import { Button } from "@chakra-ui/button";
import React from "react";
import { useNavigate } from "react-router";

export const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate("/create-certificate")}>
        Generate certificate
      </Button>
      <Button onClick={() => navigate("/display-certificates")}>
        View certificates
      </Button>
    </div>
  );
};
