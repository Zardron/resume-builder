import React from "react";
import { useLocation } from "react-router-dom";
import ResumeBuilder from "./ResumeBuilder";
import ExistingResumeBuilder from "./ExistingResumeBuilder";

const Builder = () => {
  const { builder } = useLocation().state;
  return (
    <>
    {builder === "new-resume" ? <ResumeBuilder /> : <ExistingResumeBuilder />}
    </>
  );
};

export default Builder;
