import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, UserPlus, X, Plus, Loader2, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import InputField from '../../components/forms/InputField';
import DropDownField from '../../components/forms/DropDownField';
import { useAppSelector } from '../../store/hooks';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const CreateRecruiterAccount = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  
  // Organization form data
  const [organizationData, setOrganizationData] = useState({
    organizationName: '',
    industry: '',
    size: 'small',
    website: '',
    subscriptionPlan: 'starter',
  });

  // Team members data
  const [teamMembers, setTeamMembers] = useState([
    {
      id: Date.now(),
      email: '',
      fullName: '',
      role: 'recruiter',
      department: '',
    },
  ]);

  // Check if user is super admin
  if (user?.role !== 'super_admin') {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Only super administrators can create accounts.
          </p>
        </div>
      </div>
    );
  }

  const handleOrganizationChange = (field, value) => {
    setOrganizationData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear errors for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleMemberChange = (id, field, value) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
    // Clear errors for this member
    const errorKey = `member_${id}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addMember = () => {
    setTeamMembers((prev) => [
      ...prev,
      {
        id: Date.now(),
        email: '',
        fullName: '',
        role: 'recruiter',
        department: '',
      },
    ]);
  };

  const removeMember = (id) => {
    if (teamMembers.length > 1) {
      setTeamMembers((prev) => prev.filter((member) => member.id !== id));
      // Clear errors for this member
      setErrors((prev) => {
        const newErrors = { ...prev };
        Object.keys(newErrors).forEach((key) => {
          if (key.startsWith(`member_${id}_`)) {
            delete newErrors[key];
          }
        });
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate organization name
    if (!organizationData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    // Validate team members
    teamMembers.forEach((member, index) => {
      if (!member.email.trim()) {
        newErrors[`member_${member.id}_email`] = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(member.email)) {
        newErrors[`member_${member.id}_email`] = 'Invalid email format';
      }

      if (!member.fullName.trim()) {
        newErrors[`member_${member.id}_fullName`] = 'Full name is required';
      }
    });

    // Check for duplicate emails
    const emails = teamMembers.map((m) => m.email.toLowerCase().trim());
    const duplicates = emails.filter((email, index) => emails.indexOf(email) !== index);
    if (duplicates.length > 0) {
      teamMembers.forEach((member) => {
        if (duplicates.includes(member.email.toLowerCase().trim())) {
          newErrors[`member_${member.id}_email`] = 'Duplicate email address';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        organizationName: organizationData.organizationName,
        industry: organizationData.industry,
        size: organizationData.size,
        website: organizationData.website,
        subscriptionPlan: organizationData.subscriptionPlan,
        emails: teamMembers.map((member) => ({
          email: member.email.trim(),
          fullName: member.fullName.trim(),
          role: member.role,
          department: member.department.trim() || undefined,
        })),
      };

      const result = await adminAPI.createOrganizationWithMembers(payload);

      setSuccess({
        message: result.message || 'Organization and accounts created successfully!',
        usersCreated: result.usersCreated,
        usersInvited: result.usersInvited,
        errors: result.errors,
      });

      // Reset form after successful creation
      setTimeout(() => {
        setOrganizationData({
          organizationName: '',
          industry: '',
          size: 'small',
          website: '',
          subscriptionPlan: 'starter',
        });
        setTeamMembers([
          {
            id: Date.now(),
            email: '',
            fullName: '',
            role: 'recruiter',
            department: '',
          },
        ]);
        setSuccess(null);
      }, 5000);
    } catch (error) {
      console.error('Error creating accounts:', error);
      setErrors({
        submit: error.message || 'Failed to create accounts. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Recruiter Accounts
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Create new recruiter accounts with multiple team members. Invitation emails will be sent to all specified addresses.
        </p>
      </div>

      {success && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 dark:text-green-200 mb-1">
                {success.message}
              </h3>
              <p className="text-sm text-green-800 dark:text-green-300">
                {success.usersCreated} user(s) processed, {success.usersInvited} invitation(s) sent.
              </p>
              {success.errors && success.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                    Some issues occurred:
                  </p>
                  <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-400">
                    {success.errors.map((error, index) => (
                      <li key={index}>
                        {error.email}: {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-300">{errors.submit}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Organization Information */}
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <InputField
                type="text"
                placeholder="Enter organization name"
                value={organizationData.organizationName}
                onChange={(value) => handleOrganizationChange('organizationName', value)}
                icon="building"
                hasError={errors.organizationName}
                name="organizationName"
              />
              {errors.organizationName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.organizationName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry
              </label>
              <InputField
                type="text"
                placeholder="e.g., Technology, Healthcare, Finance"
                value={organizationData.industry}
                onChange={(value) => handleOrganizationChange('industry', value)}
                icon="briefcase"
                name="industry"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Size
              </label>
              <DropDownField
                value={organizationData.size}
                onChange={(value) => handleOrganizationChange('size', value)}
                options={[
                  { value: 'startup', label: 'Startup (1-10)' },
                  { value: 'small', label: 'Small (11-50)' },
                  { value: 'medium', label: 'Medium (51-200)' },
                  { value: 'large', label: 'Large (201-1000)' },
                  { value: 'enterprise', label: 'Enterprise (1000+)' },
                ]}
                getOptionLabel={(option) => option.label || option}
                getOptionValue={(option) => option.value || option}
                placeholder="Select company size"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <InputField
                type="url"
                placeholder="https://example.com"
                value={organizationData.website}
                onChange={(value) => handleOrganizationChange('website', value)}
                icon="globe"
                name="website"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subscription Plan
              </label>
              <DropDownField
                value={organizationData.subscriptionPlan}
                onChange={(value) => handleOrganizationChange('subscriptionPlan', value)}
                options={[
                  { value: 'starter', label: 'Starter' },
                  { value: 'professional', label: 'Professional' },
                  { value: 'enterprise', label: 'Enterprise' },
                ]}
                getOptionLabel={(option) => option.label || option}
                getOptionValue={(option) => option.value || option}
                placeholder="Select subscription plan"
              />
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Team Members
            </h2>
            <button
              type="button"
              onClick={addMember}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Member
            </button>
          </div>

          <div className="space-y-6">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Member {index + 1}
                  </h3>
                  {teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <InputField
                      type="email"
                      placeholder="user@example.com"
                      value={member.email}
                      onChange={(value) => handleMemberChange(member.id, 'email', value)}
                      icon="email"
                      hasError={errors[`member_${member.id}_email`]}
                      name={`member_${member.id}_email`}
                    />
                    {errors[`member_${member.id}_email`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors[`member_${member.id}_email`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <InputField
                      type="text"
                      placeholder="John Doe"
                      value={member.fullName}
                      onChange={(value) => handleMemberChange(member.id, 'fullName', value)}
                      icon="user"
                      hasError={errors[`member_${member.id}_fullName`]}
                      name={`member_${member.id}_fullName`}
                    />
                    {errors[`member_${member.id}_fullName`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors[`member_${member.id}_fullName`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <DropDownField
                      value={member.role}
                      onChange={(value) => handleMemberChange(member.id, 'role', value)}
                      options={[
                        { value: 'admin', label: 'Admin' },
                        { value: 'manager', label: 'Manager' },
                        { value: 'recruiter', label: 'Recruiter' },
                      ]}
                      getOptionLabel={(option) => option.label || option}
                      getOptionValue={(option) => option.value || option}
                      placeholder="Select role"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department
                    </label>
                    <InputField
                      type="text"
                      placeholder="e.g., HR, Engineering, Sales"
                      value={member.department}
                      onChange={(value) => handleMemberChange(member.id, 'department', value)}
                      icon="briefcase"
                      name={`member_${member.id}_department`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/admin')}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create Accounts
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecruiterAccount;

