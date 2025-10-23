import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { MapPin, Zap, Shield, TreePine } from 'lucide-react';

export default function InteractiveMap() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Amazon Rainforest', lat: -3.4653, lng: -62.2159, type: 'forest', status: 'active', funding: 45000 },
    { id: 2, name: 'Great Barrier Reef', lat: -18.2871, lng: 147.6992, type: 'marine', status: 'active', funding: 78000 },
    { id: 3, name: 'Yellowstone Wildlife', lat: 44.4280, lng: -110.5885, type: 'wildlife', status: 'completed', funding: 92000 },
    { id: 4, name: 'Madagascar Lemurs', lat: -18.7669, lng: 46.8691, type: 'wildlife', status: 'active', funding: 34000 }
  ]);

  const getProjectIcon = (type) => {
    switch (type) {
      case 'forest': return <TreePine className="h-4 w-4 text-green-600" />;
      case 'marine': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'wildlife': return <Shield className="h-4 w-4 text-purple-600" />;
      default: return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Global Conservation Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 mb-6">
          <div className="absolute inset-0 bg-world-map opacity-10 bg-center bg-no-repeat bg-contain"></div>
          <div className="relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2,847</div>
                <div className="text-sm text-gray-600">km² Protected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-gray-600">Species Monitored</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">$2.4M</div>
                <div className="text-sm text-gray-600">Total Funding</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Featured Projects</h4>
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} getProjectIcon={getProjectIcon} getStatusColor={getStatusColor} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCard({ project, getProjectIcon, getStatusColor }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        {getProjectIcon(project.type)}
        <div>
          <h5 className="font-semibold text-gray-900">{project.name}</h5>
          <p className="text-sm text-gray-600">
            {project.lat.toFixed(2)}°, {project.lng.toFixed(2)}°
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-semibold text-gray-900">${project.funding.toLocaleString()}</div>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>
    </div>
  );
}