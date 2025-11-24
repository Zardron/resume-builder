import { useLocation } from 'react-router-dom';
import ResumeBuilder from './ResumeBuilder';
import ExistingResumeBuilder from './ExistingResumeBuilder';

const Builder = () => {
  const { state } = useLocation();
  const isNewResume = state?.builder === 'new-resume';
  
  return isNewResume ? <ResumeBuilder /> : <ExistingResumeBuilder />;
};

export default Builder;
