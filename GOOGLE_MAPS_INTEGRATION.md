# Google Maps Integration for CiviSamadhan

## Setup Instructions

### 1. Google Cloud Platform Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API (optional)

### 2. Get API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API key"
3. Restrict the API key:
   - **Application restrictions**: HTTP referrers
   - **Website restrictions**: Add your domains (localhost:3000, your production domain)
   - **API restrictions**: Select only the APIs you enabled

### 3. Environment Variables
Add to your `.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 4. Install Google Maps Package
```bash
npm install @googlemaps/js-api-loader
```

### 5. Updated Heatmap Component
Replace the existing IssueHeatmap component with this enhanced version:

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { MapPin, Users, AlertTriangle, Filter, Maximize2, Navigation } from 'lucide-react'

interface Issue {
  id: number
  title: string
  category: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'Open' | 'In Progress' | 'Resolved'
  latitude: number
  longitude: number
  address: string
  created: string
  assignedWorker?: string
}

interface Worker {
  id: number
  name: string
  latitude: number
  longitude: number
  status: 'available' | 'busy' | 'offline'
  department: string
}

const IssueHeatmapWithGoogleMaps = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [showWorkers, setShowWorkers] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Delhi coordinates as center
  const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }

  // Mock data - replace with real API calls
  const issues: Issue[] = [
    {
      id: 1,
      title: 'सड़क में गड्ढा',
      category: 'Road Maintenance',
      priority: 'High',
      status: 'Open',
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Connaught Place, New Delhi',
      created: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'स्ट्रीट लाइट खराब',
      category: 'Infrastructure',
      priority: 'Medium',
      status: 'In Progress',
      latitude: 28.6129,
      longitude: 77.2295,
      address: 'India Gate, New Delhi',
      created: '2024-01-14T16:45:00Z',
      assignedWorker: 'राज कुमार'
    },
    {
      id: 3,
      title: 'कचरा फैला हुआ',
      category: 'Sanitation',
      priority: 'Urgent',
      status: 'Open',
      latitude: 28.6562,
      longitude: 77.2410,
      address: 'Red Fort Area, New Delhi',
      created: '2024-01-14T08:20:00Z'
    },
    {
      id: 4,
      title: 'पानी की पाइप लीक',
      category: 'Water Services',
      priority: 'High',
      status: 'Open',
      latitude: 28.5355,
      longitude: 77.3910,
      address: 'Noida Sector 18',
      created: '2024-01-13T14:20:00Z'
    },
    {
      id: 5,
      title: 'बिजली की समस्या',
      category: 'Electrical',
      priority: 'Medium',
      status: 'In Progress',
      latitude: 28.4595,
      longitude: 77.0266,
      address: 'Gurgaon Cyber City',
      created: '2024-01-12T11:30:00Z'
    }
  ]

  const workers: Worker[] = [
    {
      id: 1,
      name: 'राम प्रसाद',
      latitude: 28.6140,
      longitude: 77.2088,
      status: 'available',
      department: 'Roads'
    },
    {
      id: 2,
      name: 'राज कुमार',
      latitude: 28.6130,
      longitude: 77.2290,
      status: 'busy',
      department: 'Electrical'
    },
    {
      id: 3,
      name: 'सुनील कुमार',
      latitude: 28.5360,
      longitude: 77.3915,
      status: 'available',
      department: 'Sanitation'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return '#EF4444'
      case 'High': return '#F97316'
      case 'Medium': return '#EAB308'
      case 'Low': return '#22C55E'
      default: return '#6B7280'
    }
  }

  const getWorkerStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#22C55E'
      case 'busy': return '#EAB308'
      case 'offline': return '#6B7280'
      default: return '#6B7280'
    }
  }

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return

      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: 'weekly',
          libraries: ['geometry', 'places']
        })

        const google = await loader.load()
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: 11,
          mapTypeId: 'roadmap',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        })

        setMap(mapInstance)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        setIsLoading(false)
      }
    }

    if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      initMap()
    } else {
      console.warn('Google Maps API key not found')
      setIsLoading(false)
    }
  }, [])

  // Update markers when filter changes
  useEffect(() => {
    if (!map) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    const newMarkers: google.maps.Marker[] = []

    // Filter issues
    const filteredIssues = issues.filter(issue => {
      if (selectedFilter === 'all') return true
      if (selectedFilter === 'open') return issue.status === 'Open'
      if (selectedFilter === 'urgent') return issue.priority === 'Urgent'
      if (selectedFilter === 'high') return issue.priority === 'High'
      return true
    })

    // Add issue markers
    filteredIssues.forEach(issue => {
      const marker = new google.maps.Marker({
        position: { lat: issue.latitude, lng: issue.longitude },
        map: map,
        title: issue.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getPriorityColor(issue.priority),
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-bold text-gray-900 mb-2">${issue.title}</h3>
            <div class="space-y-1 text-sm">
              <p><span class="font-medium">Category:</span> ${issue.category}</p>
              <p><span class="font-medium">Priority:</span> 
                <span class="px-2 py-1 rounded text-xs" style="background-color: ${getPriorityColor(issue.priority)}20; color: ${getPriorityColor(issue.priority)}">
                  ${issue.priority}
                </span>
              </p>
              <p><span class="font-medium">Status:</span> ${issue.status}</p>
              <p><span class="font-medium">Location:</span> ${issue.address}</p>
              ${issue.assignedWorker ? `<p><span class="font-medium">Assigned to:</span> ${issue.assignedWorker}</p>` : ''}
            </div>
            <button class="mt-2 bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600">
              View Details
            </button>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      newMarkers.push(marker)
    })

    // Add worker markers if enabled
    if (showWorkers) {
      workers.forEach(worker => {
        const marker = new google.maps.Marker({
          position: { lat: worker.latitude, lng: worker.longitude },
          map: map,
          title: worker.name,
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: getWorkerStatusColor(worker.status),
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            rotation: 0
          }
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-3">
              <h3 class="font-bold text-gray-900 mb-2">${worker.name}</h3>
              <div class="space-y-1 text-sm">
                <p><span class="font-medium">Department:</span> ${worker.department}</p>
                <p><span class="font-medium">Status:</span> 
                  <span class="px-2 py-1 rounded text-xs" style="background-color: ${getWorkerStatusColor(worker.status)}20; color: ${getWorkerStatusColor(worker.status)}">
                    ${worker.status}
                  </span>
                </p>
              </div>
              <button class="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
                Assign Issue
              </button>
            </div>
          `
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })

        newMarkers.push(marker)
      })
    }

    setMarkers(newMarkers)
  }, [map, selectedFilter, showWorkers])

  const filteredIssues = issues.filter(issue => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'open') return issue.status === 'Open'
    if (selectedFilter === 'urgent') return issue.priority === 'Urgent'
    if (selectedFilter === 'high') return issue.priority === 'High'
    return true
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              समस्याओं का नक्शा (Issues Heatmap)
            </h3>
            <p className="text-sm text-gray-500">
              Real-time visualization of reported issues across the city
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Issues</option>
              <option value="open">Open Issues</option>
              <option value="urgent">Urgent Only</option>
              <option value="high">High Priority</option>
            </select>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={showWorkers}
                onChange={(e) => setShowWorkers(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              Show Workers
            </label>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-96">
        {isLoading ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : (
          <div ref={mapRef} className="w-full h-full" />
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <h5 className="font-medium text-gray-900 mb-3">Legend</h5>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Urgent Issues</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Low Priority</span>
            </div>
            {showWorkers && (
              <>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex items-center text-sm">
                    <Navigation className="w-3 h-3 text-green-600 mr-2" />
                    <span>Available Workers</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Navigation className="w-3 h-3 text-yellow-600 mr-2" />
                    <span>Busy Workers</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats overlay */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">{filteredIssues.filter(i => i.status === 'Open').length}</div>
              <div className="text-xs text-gray-500">Open Issues</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{workers.filter(w => w.status === 'available').length}</div>
              <div className="text-xs text-gray-500">Available Workers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueHeatmapWithGoogleMaps
```

## Implementation Steps

1. **Set up Google Cloud Project** and get API key
2. **Add environment variable** to `.env.local`
3. **Install the Google Maps package**: `npm install @googlemaps/js-api-loader`
4. **Replace the existing heatmap component** with the enhanced version above
5. **Update the import** in your dashboard page

## Features Included

- **Real-time issue markers** with color coding by priority
- **Worker location tracking** with status indicators
- **Interactive info windows** with issue details
- **Filtering capabilities** by priority and status
- **Bilingual support** (Hindi/English)
- **Click handlers** for issue assignment
- **Responsive design** with proper loading states

## Cost Optimization Tips

1. **Restrict API usage** to specific domains
2. **Enable only required APIs**
3. **Implement caching** for static data
4. **Use marker clustering** for high-density areas
5. **Implement lazy loading** for off-screen issues

The map will automatically center on Delhi and show real issue locations from your database once you connect the API endpoints.