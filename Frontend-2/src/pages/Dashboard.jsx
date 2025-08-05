import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Brain, TrendingUp, Award, Download, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { resumeAPI } from '../config/api';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setResumeData(null);
      setAnalysisData(null);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await resumeAPI.upload(formData);
      
      if (response.data.success) {
        setResumeData(response.data.resume);
        toast.success('Resume uploaded successfully!');
        
        // Automatically start analysis
        await handleAnalyze(response.data.resume.text);
      } else {
        toast.error('Upload failed. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (resumeText) => {
    if (!resumeText) {
      toast.error('No resume text to analyze');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await resumeAPI.analyze(resumeText);
      
      if (response.data.isAnalysisSuccessFull) {
        setAnalysisData(response.data.analysed_data);
        toast.success('Analysis completed!');
      } else {
        toast.error('Analysis failed. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const renderAnalysisResults = () => {
    if (!analysisData) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
      >
        {/* Match Score */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Match Score</h3>
              <p className="text-sm text-gray-500">Overall compatibility</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {analysisData.match_score}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${analysisData.match_score}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
              <p className="text-sm text-gray-500">Years of experience</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {analysisData.experience_years}
            </div>
            <div className="text-gray-500">Years</div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Skills Identified</h3>
              <p className="text-sm text-gray-500">{analysisData.skills.length} skills found</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysisData.skills.slice(0, 8).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
            {analysisData.skills.length > 8 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                +{analysisData.skills.length - 8} more
              </span>
            )}
          </div>
        </div>

        {/* Recommended Roles */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recommended Roles</h3>
              <p className="text-sm text-gray-500">Perfect matches for you</p>
            </div>
          </div>
          <div className="space-y-2">
            {analysisData.recommended_roles.map((role, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">{role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Suggestions</h3>
          <div className="space-y-3">
            {analysisData.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
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
            Resume Analysis Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your resume to get AI-powered insights, skill analysis, and personalized recommendations
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-white" />
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {!file ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-gray-600 mb-6">
                  Select a PDF file to get started with your analysis
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  className="mb-4"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose PDF File
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    Change File
                  </Button>
                  <Button
                    onClick={handleUpload}
                    loading={uploading}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload & Analyze'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {(uploading || analyzing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8"
          >
            <div className="text-center">
              <LoadingSpinner 
                size="lg" 
                text={uploading ? 'Uploading your resume...' : 'Analyzing your resume with AI...'}
              />
            </div>
          </motion.div>
        )}

        {/* Resume Preview */}
        {resumeData && !analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resume Content</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {resumeData.text.substring(0, 500)}...
              </p>
            </div>
          </motion.div>
        )}

        {/* Analysis Results */}
        {renderAnalysisResults()}
      </div>
    </div>
  );
};

export default Dashboard;