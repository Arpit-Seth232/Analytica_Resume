import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, DollarSign, Building, ExternalLink, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { jobsAPI } from '../config/api';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [country, setCountry] = useState('in');
  const [employmentType, setEmploymentType] = useState('FULLTIME');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const countries = [
    { value: 'in', label: 'India' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'sg', label: 'Singapore' }
  ];

  const employmentTypes = [
    { value: 'FULLTIME', label: 'Full Time' },
    { value: 'PARTTIME', label: 'Part Time' },
    { value: 'CONTRACTOR', label: 'Contract' },
    { value: 'INTERN', label: 'Internship' }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await jobsAPI.search(searchQuery, country, employmentType);
      
      if (response.data.isSearchSuccessFull) {
        setJobs(response.data.data.data || []);
        toast.success(`Found ${response.data.data.data?.length || 0} jobs`);
      } else {
        toast.error('Search failed. Please try again.');
        setJobs([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Search failed. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min, max, currency = 'USD') => {
    if (!min && !max) return 'Salary not specified';
    
    const formatNumber = (num) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
      return num.toString();
    };

    if (min && max) {
      return `${currency} ${formatNumber(min)} - ${formatNumber(max)}`;
    }
    return `${currency} ${formatNumber(min || max)}`;
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Search through thousands of job opportunities from top companies worldwide
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Input
                  label="Job Title or Keywords"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                  placeholder="e.g. Software Engineer, Marketing Manager"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                >
                  {countries.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                >
                  {employmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                loading={loading}
                size="lg"
                className="px-12"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Jobs
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8"
          >
            <div className="text-center">
              <LoadingSpinner size="lg" text="Searching for jobs..." />
            </div>
          </motion.div>
        )}

        {/* Results */}
        {hasSearched && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {jobs.length > 0 ? `${jobs.length} Jobs Found` : 'No Jobs Found'}
              </h2>
              {jobs.length > 0 && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Showing results for "{searchQuery}"</span>
                </div>
              )}
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or keywords
                </p>
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job.job_id || index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          {job.employer_logo && (
                            <img
                              src={job.employer_logo}
                              alt={job.employer_name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {job.job_title}
                            </h3>
                            <div className="flex items-center space-x-4 text-gray-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <Building className="w-4 h-4" />
                                <span className="text-sm">{job.employer_name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">
                                  {job.job_city}, {job.job_country}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">
                                  {getTimeAgo(job.job_posted_at_datetime_utc)}
                                </span>
                              </div>
                            </div>
                            
                            {job.job_description && (
                              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                {job.job_description.substring(0, 200)}...
                              </p>
                            )}

                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {job.job_employment_type}
                              </span>
                              {job.job_is_remote && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  Remote
                                </span>
                              )}
                              {job.job_required_experience?.no_experience_required && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  No Experience Required
                                </span>
                              )}
                            </div>

                            {(job.job_min_salary || job.job_max_salary) && (
                              <div className="flex items-center space-x-1 text-green-600 mb-4">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-medium">
                                  {formatSalary(job.job_min_salary, job.job_max_salary)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 lg:mt-0 lg:ml-6 flex-shrink-0">
                        <a
                          href={job.job_apply_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Jobs;