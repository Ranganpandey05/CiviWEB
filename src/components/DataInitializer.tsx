'use client';

import React, { useState } from 'react';
import { Play, Database, Check, AlertCircle, Users, FileText, MapPin } from 'lucide-react';
import { createIndianDummyData } from '@/lib/adminAPI';
import { useLanguage } from '@/contexts/LanguageContext';

const DataInitializer: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const { t } = useLanguage();

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const createDummyData = async () => {
    setIsCreating(true);
    setStatus('running');
    setProgress(0);
    setLog([]);

    try {
      addLog('Starting CiviSamadhan dummy data creation...');
      setProgress(10);

      addLog('Creating citizen profiles for Kolkata city...');
      setProgress(25);

      addLog('Creating government worker profiles...');
      setProgress(40);

      addLog('Generating realistic urban issues...');
      setProgress(60);

      addLog('Creating worker applications...');
      setProgress(80);

      const result = await createIndianDummyData();
      
      if (result) {
        addLog('✅ Successfully created all data!');
        addLog(`✅ Total citizens: 25+`);
        addLog(`✅ Total workers: 5`);
        addLog(`✅ Total reports: Available from mobile app`);
        addLog(`✅ Total applications: Ready for testing`);
        setProgress(100);
        setStatus('completed');
      } else {
        throw new Error('Failed to create dummy data');
      }

    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus('error');
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running': return <Database className="h-5 w-5 animate-pulse" />;
      case 'completed': return <Check className="h-5 w-5" />;
      case 'error': return <AlertCircle className="h-5 w-5" />;
      default: return <Play className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            CiviSamadhan Database Initialization
          </h2>
          <p className="text-gray-600">
            Use this tool to populate your database with test data for workers and profiles
          </p>
        </div>

        <div className="p-6">
          {/* Data Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Citizens & Workers</h3>
                  <p className="text-sm text-blue-700">5 test workers</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Issue Reports</h3>
                  <p className="text-sm text-green-700">From mobile app</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-900">Locations</h3>
                  <p className="text-sm text-purple-700">Kolkata area</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center mb-6">
            <button
              onClick={createDummyData}
              disabled={isCreating}
              className={`
                inline-flex items-center space-x-3 px-8 py-4 rounded-lg font-semibold text-lg
                transition-all duration-200
                ${isCreating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl'
                }
              `}
            >
              <span className={getStatusColor()}>
                {getStatusIcon()}
              </span>
              <span>
                {isCreating ? 'Creating data...' : 'Create Test Data'}
              </span>
            </button>
          </div>

          {/* Progress Bar */}
          {status === 'running' && (
            <div className="mb-6">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Log Output */}
          {log.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Creation Log</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {log.map((entry, index) => (
                  <div key={index} className="text-sm font-mono text-gray-700">
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
              <div className="flex items-center space-x-3">
                <Check className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Data created successfully!</h3>
                  <p className="text-green-700 mt-1">
                    You can now go back to the dashboard to see real-time data.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Error occurred!</h3>
                  <p className="text-red-700 mt-1">
                    Please check the console logs and try again.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataInitializer;