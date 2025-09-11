'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { MapPin, Users, AlertTriangle, Filter, Maximize2, Navigation, Eye, Phone, Calendar, User, Camera, Globe } from 'lucide-react'

interface Issue {
  id: number
  issueNumber: string
  title: string
  description: string
  category: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'Reported' | 'Acknowledged' | 'Assigned' | 'In Progress' | 'Completed' | 'Verified'
  latitude: number
  longitude: number
  address: string
  created: string
  citizenName: string
  citizenPhone: string
  assignedWorker?: string
  workerId?: string
  photos: string[]
  videos?: string[]
  preciseLocation: boolean
}

interface Worker {
  id: number
  workerId: string
  name: string
  phone: string
  latitude: number
  longitude: number
  status: 'available' | 'busy' | 'offline'
  department: string
  currentAssignments: number
  rating: number
}

const IssueHeatmap = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [showWorkers, setShowWorkers] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [language, setLanguage] = useState<'en' | 'hi'>('en')

  // Delhi/NCR coordinates as center
  const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }

  // Realistic Indian civic issues data
  const issues: Issue[] = [
    {
      id: 1,
      issueNumber: 'CIV-2024-001',
      title: 'सड़क में बड़ा गड्ढा',
      description: 'मुख्य सड़क पर गहरा गड्ढा है जिससे दुर्घटना हो सकती है। बारिश के बाद पानी भर जाता है।',
      category: 'Road Maintenance',
      priority: 'High',
      status: 'Reported',
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'कनॉट प्लेस मुख्य मार्ग, नई दिल्ली',
      created: '2024-01-15T10:30:00Z',
      citizenName: 'राज शर्मा',
      citizenPhone: '+91-9876543210',
      photos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
      preciseLocation: true
    },
    {
      id: 2,
      issueNumber: 'CIV-2024-002',
      title: 'स्ट्रीट लाइट बंद है',
      description: 'रात को अंधेरा रहता है, महिलाओं की सुरक्षा की समस्या है।',
      category: 'Electrical',
      priority: 'Medium',
      status: 'Assigned',
      latitude: 28.6129,
      longitude: 77.2295,
      address: 'इंडिया गेट परिसर, नई दिल्ली',
      created: '2024-01-14T16:45:00Z',
      citizenName: 'प्रिया गुप्ता',
      citizenPhone: '+91-9876543211',
      assignedWorker: 'राज कुमार',
      workerId: 'ELEC001',
      photos: ['/api/placeholder/400/300'],
      preciseLocation: true
    },
    {
      id: 3,
      issueNumber: 'CIV-2024-003',
      title: 'कचरा गाड़ी नहीं आई',
      description: 'तीन दिन से कचरा गाड़ी नहीं आई, बदबू आ रही है।',
      category: 'Sanitation',
      priority: 'Urgent',
      status: 'In Progress',
      latitude: 28.6562,
      longitude: 77.2410,
      address: 'लाल किला एरिया, चांदनी चौक',
      created: '2024-01-14T08:20:00Z',
      citizenName: 'मोहन लाल',
      citizenPhone: '+91-9876543212',
      assignedWorker: 'सुनील कुमार',
      workerId: 'SAN001',
      photos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
      preciseLocation: true
    },
    {
      id: 4,
      issueNumber: 'CIV-2024-004',
      title: 'पानी की पाइप फटी',
      description: 'पानी बर्बाद हो रहा है, सड़क पर भर गया है।',
      category: 'Water Supply',
      priority: 'High',
      status: 'Acknowledged',
      latitude: 28.5355,
      longitude: 77.3910,
      address: 'नोएडा सेक्टर 18, उत्तर प्रदेश',
      created: '2024-01-13T14:20:00Z',
      citizenName: 'अमित कुमार',
      citizenPhone: '+91-9876543213',
      photos: ['/api/placeholder/400/300'],
      videos: ['/api/placeholder/video'],
      preciseLocation: true
    },
    {
      id: 5,
      issueNumber: 'CIV-2024-005',
      title: 'पार्क में टूटे झूले',
      description: 'बच्चों के लिए खतरनाक है, मरम्मत की जरूरत है।',
      category: 'Parks & Recreation',
      priority: 'Medium',
      status: 'Completed',
      latitude: 28.4595,
      longitude: 77.0266,
      address: 'गुड़गांव साइबर सिटी पार्क',
      created: '2024-01-12T11:30:00Z',
      citizenName: 'सुनीता देवी',
      citizenPhone: '+91-9876543214',
      assignedWorker: 'विकास सिंह',
      workerId: 'PARK001',
      photos: ['/api/placeholder/400/300'],
      preciseLocation: true
    }
  ]

  const workers: Worker[] = [
    {
      id: 1,
      workerId: 'ROAD001',
      name: 'राम प्रसाद शर्मा',
      phone: '+91-9988776655',
      latitude: 28.6140,
      longitude: 77.2088,
      status: 'available',
      department: 'Roads & Infrastructure',
      currentAssignments: 0,
      rating: 4.8
    },
    {
      id: 2,
      workerId: 'ELEC001',
      name: 'राज कुमार',
      phone: '+91-9988776656',
      latitude: 28.6130,
      longitude: 77.2290,
      status: 'busy',
      department: 'Electrical',
      currentAssignments: 2,
      rating: 4.6
    },
    {
      id: 3,
      workerId: 'SAN001',
      name: 'सुनील कुमार',
      phone: '+91-9988776657',
      latitude: 28.5360,
      longitude: 77.3915,
      status: 'available',
      department: 'Sanitation',
      currentAssignments: 1,
      rating: 4.9
    },
    {
      id: 4,
      workerId: 'WATER001',
      name: 'अशोक यादव',
      phone: '+91-9988776658',
      latitude: 28.5400,
      longitude: 77.3800,
      status: 'busy',
      department: 'Water Supply',
      currentAssignments: 1,
      rating: 4.7
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return '#DC2626' // Red-600
      case 'High': return '#EA580C' // Orange-600  
      case 'Medium': return '#CA8A04' // Yellow-600
      case 'Low': return '#16A34A' // Green-600
      default: return '#6B7280' // Gray-500
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported': return '#EF4444' // Red
      case 'Acknowledged': return '#F97316' // Orange
      case 'Assigned': return '#EAB308' // Yellow
      case 'In Progress': return '#3B82F6' // Blue
      case 'Completed': return '#22C55E' // Green
      case 'Verified': return '#10B981' // Emerald
      default: return '#6B7280' // Gray
    }
  }

  const getWorkerStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#22C55E' // Green
      case 'busy': return '#EAB308' // Yellow
      case 'offline': return '#6B7280' // Gray
      default: return '#6B7280'
    }
  }

  // Initialize Google Maps with Apple Maps style
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
            // Apple Maps inspired styling
            {
              featureType: 'administrative',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#6b7280' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry.fill',
              stylers: [{ color: '#f3f4f6' }]
            },
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry.fill',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#e5e7eb' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.fill',
              stylers: [{ color: '#fef3c7' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#dbeafe' }]
            }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
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
    const newMarkers: any[] = []

    // Filter issues
    const filteredIssues = issues.filter(issue => {
      if (selectedFilter === 'all') return true
      if (selectedFilter === 'open') return ['Reported', 'Acknowledged'].includes(issue.status)
      if (selectedFilter === 'urgent') return issue.priority === 'Urgent'
      if (selectedFilter === 'high') return issue.priority === 'High'
      if (selectedFilter === 'assigned') return ['Assigned', 'In Progress'].includes(issue.status)
      return true
    })

    // Add issue markers with enhanced info
    filteredIssues.forEach(issue => {
      const marker = new google.maps.Marker({
        position: { lat: issue.latitude, lng: issue.longitude },
        map: map,
        title: issue.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: getPriorityColor(issue.priority),
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 3
        }
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-4 max-w-sm">
            <div class="flex items-start justify-between mb-3">
              <h3 class="font-bold text-gray-900 text-lg">${issue.title}</h3>
              <span class="px-2 py-1 rounded-full text-xs font-medium" style="background-color: ${getStatusColor(issue.status)}20; color: ${getStatusColor(issue.status)}">
                ${issue.status}
              </span>
            </div>
            
            <div class="space-y-2 text-sm mb-4">
              <p class="text-gray-700">${issue.description}</p>
              <div class="flex items-center space-x-4">
                <span class="flex items-center">
                  <span class="w-2 h-2 rounded-full mr-2" style="background-color: ${getPriorityColor(issue.priority)}"></span>
                  ${issue.priority}
                </span>
                <span class="text-gray-500">${issue.issueNumber}</span>
              </div>
              <p class="text-gray-600">📍 ${issue.address}</p>
              <p class="text-gray-600">👤 ${issue.citizenName} • 📞 ${issue.citizenPhone}</p>
              ${issue.assignedWorker ? `<p class="text-blue-600">🔧 Assigned to: ${issue.assignedWorker}</p>` : ''}
            </div>
            
            <div class="flex space-x-2">
              <button onclick="viewIssueDetails(${issue.id})" class="px-4 py-2 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 transition-colors">
                View Details
              </button>
              ${!issue.assignedWorker ? `<button onclick="assignWorker(${issue.id})" class="px-4 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors">
                Assign Worker
              </button>` : ''}
            </div>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
        setSelectedIssue(issue)
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
            scale: 8,
            fillColor: getWorkerStatusColor(worker.status),
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            rotation: 0
          }
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-4">
              <h3 class="font-bold text-gray-900 mb-2">${worker.name}</h3>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium">ID:</span> ${worker.workerId}</p>
                <p><span class="font-medium">Department:</span> ${worker.department}</p>
                <p><span class="font-medium">Phone:</span> ${worker.phone}</p>
                <div class="flex items-center space-x-2">
                  <span class="font-medium">Status:</span>
                  <span class="px-2 py-1 rounded-full text-xs" style="background-color: ${getWorkerStatusColor(worker.status)}20; color: ${getWorkerStatusColor(worker.status)}">
                    ${worker.status}
                  </span>
                </div>
                <p><span class="font-medium">Current Tasks:</span> ${worker.currentAssignments}</p>
                <p><span class="font-medium">Rating:</span> ⭐ ${worker.rating}/5</p>
              </div>
              <button onclick="contactWorker('${worker.phone}')" class="mt-3 w-full px-4 py-2 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors">
                Contact Worker
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
    if (selectedFilter === 'open') return ['Reported', 'Acknowledged'].includes(issue.status)
    if (selectedFilter === 'urgent') return issue.priority === 'Urgent'
    if (selectedFilter === 'high') return issue.priority === 'High'
    if (selectedFilter === 'assigned') return ['Assigned', 'In Progress'].includes(issue.status)
    return true
  })

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 p-6 bg-gradient-to-r from-orange-50 to-green-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'hi' ? 'समस्याओं का लाइव मैप' : 'Live Issues Map'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {language === 'hi' 
                ? 'शहर भर की समस्याओं का रियल-टाइम दृश्य' 
                : 'Real-time visualization of city-wide issues'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
            >
              <option value="all">{language === 'hi' ? 'सभी समस्याएं' : 'All Issues'}</option>
              <option value="open">{language === 'hi' ? 'नई समस्याएं' : 'Open Issues'}</option>
              <option value="assigned">{language === 'hi' ? 'असाइन की गई' : 'Assigned'}</option>
              <option value="urgent">{language === 'hi' ? 'तत्काल' : 'Urgent Only'}</option>
              <option value="high">{language === 'hi' ? 'उच्च प्राथमिकता' : 'High Priority'}</option>
            </select>
            
            <label className="flex items-center text-sm font-medium">
              <input
                type="checkbox"
                checked={showWorkers}
                onChange={(e) => setShowWorkers(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              {language === 'hi' ? 'कर्मचारी दिखाएं' : 'Show Workers'}
            </label>
            
            <button 
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Globe className="h-4 w-4" />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-[500px]">
        {isLoading ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">
                {language === 'hi' ? 'मैप लोड हो रहा है...' : 'Loading map...'}
              </p>
            </div>
          </div>
        ) : (
          <div ref={mapRef} className="w-full h-full rounded-lg" />
        )}

        {/* Enhanced Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-xs">
          <h5 className="font-bold text-gray-900 mb-3">
            {language === 'hi' ? 'संकेतक' : 'Legend'}
          </h5>
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-700 mb-2">
              {language === 'hi' ? 'समस्या प्राथमिकता:' : 'Issue Priority:'}
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
              <span>{language === 'hi' ? 'तत्काल' : 'Urgent'}</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-orange-600 mr-2"></div>
              <span>{language === 'hi' ? 'उच्च' : 'High'}</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-yellow-600 mr-2"></div>
              <span>{language === 'hi' ? 'मध्यम' : 'Medium'}</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
              <span>{language === 'hi' ? 'कम' : 'Low'}</span>
            </div>
            {showWorkers && (
              <>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="text-xs font-medium text-gray-700 mb-2">
                    {language === 'hi' ? 'कर्मचारी स्थिति:' : 'Worker Status:'}
                  </div>
                  <div className="flex items-center text-xs">
                    <Navigation className="w-3 h-3 text-green-600 mr-2" />
                    <span>{language === 'hi' ? 'उपलब्ध' : 'Available'}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Navigation className="w-3 h-3 text-yellow-600 mr-2" />
                    <span>{language === 'hi' ? 'व्यस्त' : 'Busy'}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Stats overlay */}
        <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {issues.filter(i => ['Reported', 'Acknowledged'].includes(i.status)).length}
              </div>
              <div className="text-xs text-gray-500">
                {language === 'hi' ? 'नई समस्याएं' : 'Open Issues'}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {workers.filter(w => w.status === 'available').length}
              </div>
              <div className="text-xs text-gray-500">
                {language === 'hi' ? 'उपलब्ध कर्मचारी' : 'Available Workers'}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {issues.filter(i => ['Assigned', 'In Progress'].includes(i.status)).length}
              </div>
              <div className="text-xs text-gray-500">
                {language === 'hi' ? 'प्रगति में' : 'In Progress'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueHeatmap