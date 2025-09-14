'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer, Marker, InfoWindow } from '@react-google-maps/api';
import { 
  MapPin, 
  Zap, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Users,
  Activity,
  Filter,
  RefreshCw
} from 'lucide-react';

import {
  getTasksForHeatmap,
  getWorkersWithLocation,
  subscribeToTasks,
  subscribeToWorkerLocations,
  Profile,
  Task,
  getTasks
} from '@/lib/adminAPI';

interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
  status: string;
  priority: string;
  title: string;
  id: string;
}

interface IssueHeatmapProps {
  adminId: string;
}

export default function IssueHeatmap({ adminId }: IssueHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [workers, setWorkers] = useState<Profile[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<HeatmapPoint | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Profile | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showWorkers, setShowWorkers] = useState(true);
  const [showIssues, setShowIssues] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [recentIssues, setRecentIssues] = useState<Task[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['visualization']
  });

  // Kolkata Sector V center
  const mapCenter = {
    lat: 22.5743,
    lng: 88.4348
  };

  const mapOptions = {
    zoom: 13,
    center: mapCenter,
    mapTypeId: 'roadmap' as google.maps.MapTypeId,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  useEffect(() => {
    loadMapData();
    
    // Set up real-time subscriptions
    const tasksSubscription = subscribeToTasks((payload) => {
      console.log('Real-time task update:', payload);
      loadMapData();
      setLastUpdate(new Date());
    });

    const workersSubscription = subscribeToWorkerLocations((payload) => {
      console.log('Real-time worker location update:', payload);
      loadWorkers();
      setLastUpdate(new Date());
    });

    return () => {
      tasksSubscription.unsubscribe();
      workersSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    filterHeatmapData();
  }, [filterStatus, filterPriority]);

  const loadMapData = async () => {
    try {
      setLoading(true);
      
      // Load heatmap data
      const heatmapPoints = await getTasksForHeatmap();
      setHeatmapData(heatmapPoints);
      
      // Load recent issues
      const tasks = await getTasks();
      setRecentIssues(tasks.slice(0, 5));
      
      // Load workers
      await loadWorkers();
      
    } catch (error) {
      console.error('Error loading map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkers = async () => {
    try {
      const workersData = await getWorkersWithLocation();
      setWorkers(workersData);
    } catch (error) {
      console.error('Error loading workers:', error);
    }
  };

  const filterHeatmapData = () => {
    // Filter is applied in the component render
  };

  const getFilteredHeatmapData = () => {
    return heatmapData.filter(point => {
      if (filterStatus !== 'all' && point.status !== filterStatus) return false;
      if (filterPriority !== 'all' && point.priority !== filterPriority) return false;
      return true;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b'; // Amber
      case 'assigned': return '#3b82f6'; // Blue
      case 'in_progress': return '#8b5cf6'; // Purple
      case 'completed': return '#10b981'; // Emerald
      case 'verified': return '#06b6d4'; // Cyan
      default: return '#6b7280'; // Gray
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Zap className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Activity className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getWorkerStatusIcon = (worker: Profile) => {
    const now = new Date();
    const lastUpdate = new Date(worker.updated_at);
    const minutesAgo = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
    
    if (minutesAgo < 5) {
      return '🟢'; // Green - Active
    } else if (minutesAgo < 15) {
      return '🟡'; // Yellow - Recently active
    } else {
      return '🔴'; // Red - Offline
    }
  };

  const filteredData = getFilteredHeatmapData();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading CiviSamadhan Real-time Map...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Real-time Issue Heatmap</h1>
            <p className="text-gray-600">Live visualization of citizen reports and worker locations</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <button
              onClick={loadMapData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Total Issues</p>
                <p className="text-xl font-bold text-blue-900">{heatmapData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-green-600">Active Workers</p>
                <p className="text-xl font-bold text-green-900">{workers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600">Urgent Issues</p>
                <p className="text-xl font-bold text-purple-900">
                  {heatmapData.filter(p => p.priority === 'urgent').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-orange-600">In Progress</p>
                <p className="text-xl font-bold text-orange-900">
                  {heatmapData.filter(p => p.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="verified">Verified</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Heatmap</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showWorkers}
                onChange={(e) => setShowWorkers(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Workers</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showIssues}
                onChange={(e) => setShowIssues(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Issue Markers</span>
            </label>
          </div>
        </div>
      </div>

      {/* Map and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '600px' }}
              zoom={mapOptions.zoom}
              center={mapOptions.center}
              options={mapOptions}
              onLoad={(map) => {
                mapRef.current = map;
              }}
            >
              {/* Heatmap Layer */}
              {showHeatmap && filteredData.length > 0 && (
                <HeatmapLayer
                  data={filteredData.map(point => ({
                    location: new google.maps.LatLng(point.lat, point.lng),
                    weight: point.weight
                  }))}
                  options={{
                    radius: 30,
                    opacity: 0.6,
                    gradient: [
                      'rgba(0, 255, 255, 0)',
                      'rgba(0, 255, 255, 1)',
                      'rgba(0, 191, 255, 1)',
                      'rgba(0, 127, 255, 1)',
                      'rgba(0, 63, 255, 1)',
                      'rgba(0, 0, 255, 1)',
                      'rgba(0, 0, 223, 1)',
                      'rgba(0, 0, 191, 1)',
                      'rgba(0, 0, 159, 1)',
                      'rgba(0, 0, 127, 1)',
                      'rgba(63, 0, 91, 1)',
                      'rgba(127, 0, 63, 1)',
                      'rgba(191, 0, 31, 1)',
                      'rgba(255, 0, 0, 1)'
                    ]
                  }}
                />
              )}

              {/* Issue Markers */}
              {showIssues && filteredData.map((point) => (
                <Marker
                  key={point.id}
                  position={{ lat: point.lat, lng: point.lng }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: getStatusColor(point.status),
                    fillOpacity: 0.8,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                  }}
                  onClick={() => setSelectedIssue(point)}
                />
              ))}

              {/* Worker Markers */}
              {showWorkers && workers.map((worker) => (
                <Marker
                  key={worker.id}
                  position={{ 
                    lat: worker.current_latitude!, 
                    lng: worker.current_longitude! 
                  }}
                  icon={{
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 6,
                    fillColor: '#22c55e',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    rotation: 0
                  }}
                  onClick={() => setSelectedWorker(worker)}
                />
              ))}

              {/* Issue Info Window */}
              {selectedIssue && (
                <InfoWindow
                  position={{ lat: selectedIssue.lat, lng: selectedIssue.lng }}
                  onCloseClick={() => setSelectedIssue(null)}
                >
                  <div className="p-3 max-w-sm">
                    <div className="flex items-center gap-2 mb-2">
                      {getPriorityIcon(selectedIssue.priority)}
                      <h3 className="font-semibold text-gray-900">{selectedIssue.title}</h3>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Status:</span> {selectedIssue.status}</p>
                      <p><span className="font-medium">Priority:</span> {selectedIssue.priority}</p>
                      <p><span className="font-medium">Location:</span> {selectedIssue.lat.toFixed(4)}, {selectedIssue.lng.toFixed(4)}</p>
                    </div>
                    <button
                      onClick={() => {
                        // Handle view details
                        console.log('View issue details:', selectedIssue.id);
                      }}
                      className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                  </div>
                </InfoWindow>
              )}

              {/* Worker Info Window */}
              {selectedWorker && (
                <InfoWindow
                  position={{ 
                    lat: selectedWorker.current_latitude!, 
                    lng: selectedWorker.current_longitude! 
                  }}
                  onCloseClick={() => setSelectedWorker(null)}
                >
                  <div className="p-3 max-w-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getWorkerStatusIcon(selectedWorker)}</span>
                      <h3 className="font-semibold text-gray-900">{selectedWorker.full_name}</h3>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Department:</span> {selectedWorker.department}</p>
                      <p><span className="font-medium">Speciality:</span> {selectedWorker.speciality}</p>
                      <p><span className="font-medium">Last Update:</span> {new Date(selectedWorker.updated_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Issues */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Issues</h3>
            </div>
            <div className="p-4 space-y-3">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-start gap-2">
                    {getPriorityIcon(issue.priority)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900 mb-1">{issue.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{issue.description.substring(0, 60)}...</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-full bg-gray-100 text-gray-800`}>
                          {issue.status}
                        </span>
                        <span className="text-gray-500">
                          {new Date(issue.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Workers */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Active Workers</h3>
            </div>
            <div className="p-4 space-y-3">
              {workers.slice(0, 5).map((worker) => (
                <div key={worker.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <span className="text-lg">{getWorkerStatusIcon(worker)}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{worker.full_name}</h4>
                    <p className="text-xs text-gray-600">{worker.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Legend</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Issue Status</h4>
                <div className="space-y-1">
                  {[
                    { status: 'pending', color: '#f59e0b', label: 'Pending' },
                    { status: 'assigned', color: '#3b82f6', label: 'Assigned' },
                    { status: 'in_progress', color: '#8b5cf6', label: 'In Progress' },
                    { status: 'completed', color: '#10b981', label: 'Completed' },
                    { status: 'verified', color: '#06b6d4', label: 'Verified' }
                  ].map(({ status, color, label }) => (
                    <div key={status} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full border border-white" 
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-xs text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Worker Status</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span>🟢</span>
                    <span className="text-xs text-gray-600">Active (&lt; 5 min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🟡</span>
                    <span className="text-xs text-gray-600">Recent (&lt; 15 min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔴</span>
                    <span className="text-xs text-gray-600">Offline (&gt; 15 min)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}