import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, FileText, MessageSquare, Star, Download } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const CandidateDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    // TODO: Fetch candidate from API
    const fetchCandidate = async () => {
      try {
        setIsLoading(true);
        // Simulated data
        setTimeout(() => {
          setCandidate({
            id: parseInt(id),
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            jobTitle: 'Senior Frontend Developer',
            appliedDate: '2024-01-10',
            stage: 'screening',
            score: 92,
            resume: {
              url: '#',
              fileName: 'john_doe_resume.pdf',
            },
            coverLetter: 'I am very interested in this position and believe my skills align perfectly with your requirements.',
            experience: [
              {
                title: 'Senior Frontend Developer',
                company: 'Tech Corp',
                duration: '2020 - Present',
                description: 'Led frontend development team and built scalable web applications.',
              },
              {
                title: 'Frontend Developer',
                company: 'StartupXYZ',
                duration: '2018 - 2020',
                description: 'Developed and maintained React applications.',
              },
            ],
            education: [
              {
                degree: 'Bachelor of Science in Computer Science',
                school: 'University of California',
                year: '2018',
              },
            ],
            skills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'CSS', 'HTML'],
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching candidate:', error);
        setIsLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const getStageColor = (stage) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      screening: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      offer: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[stage] || colors.applied;
  };

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  if (!candidate) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Candidate not found</p>
        <button
          onClick={() => navigate('/dashboard/recruiter/candidates')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/recruiter/candidates')}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{candidate.name}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Applied on {new Date(candidate.appliedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getStageColor(candidate.stage)}`}>
            {candidate.stage}
          </span>
          <div className="flex items-center gap-1 rounded-md bg-yellow-100 px-3 py-1 dark:bg-yellow-900/30">
            <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">{candidate.score}%</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Contact Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{candidate.location}</span>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          {candidate.coverLetter && (
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Cover Letter</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{candidate.coverLetter}</p>
            </div>
          )}

          {/* Experience */}
          {candidate.experience && candidate.experience.length > 0 && (
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Experience</h2>
              <div className="space-y-4">
                {candidate.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-600 pl-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company} • {exp.duration}</p>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {candidate.education && candidate.education.length > 0 && (
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Education</h2>
              <div className="space-y-4">
                {candidate.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{edu.school} • {edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resume */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.resume.fileName}</p>
              <button
                onClick={() => window.open(candidate.resume.url, '_blank')}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/dashboard/recruiter/messages?candidateId=${id}`)}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <MessageSquare className="h-4 w-4" />
                Send Message
              </button>
              <button
                onClick={() => navigate(`/dashboard/recruiter/interviews/new?candidateId=${id}`)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;

