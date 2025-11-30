import { useLocation, useSearchParams } from 'react-router-dom';
import ResumeBuilder from './ResumeBuilder';
import ExistingResumeBuilder from './ExistingResumeBuilder';
import ResumeBuilderList from './ResumeBuilderList';

const Builder = () => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  const resumeId = searchParams.get('id');
  
  // Show list page by default
  if (!state?.builder && !action && !resumeId) {
    return <ResumeBuilderList />;
  }
  
  // Show new resume builder
  if (state?.builder === 'new-resume' || action === 'create') {
    return <ResumeBuilder />;
  }
  
  // Show edit existing resume builder
  if (state?.builder === 'edit-resume' || state?.resumeId || resumeId || action === 'edit') {
    return <ExistingResumeBuilder />;
  }
  
  // Default to list
  return <ResumeBuilderList />;
};

export default Builder;
