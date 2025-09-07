import React, { useState } from 'react';
import { Search, BookOpen, Video, Download, ExternalLink, Clock, Filter, AlertTriangle, Shield, Droplets, Users, TrendingUp, Star, Bookmark, Share2, TestTube, Leaf } from 'lucide-react';
// import { useLanguage } from '../contexts/LanguageContext';

type AwarenessContent = {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'infographic' | 'guide';
  duration?: string;
  image: string;
  downloadUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  views: number;
  lastUpdated: string;
  tags: string[];
};

function AwarenessPage() {
  // const { } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['Water Purification', 'Water Storage', 'Water Testing', 'Waterborne Diseases', 'Water Conservation', 'Emergency Water', 'Community Water', 'Water Infrastructure'];

  const awarenessContent: AwarenessContent[] = [
    {
      id: '1',
      title: 'Safe Water Storage and Purification Methods',
      description: 'Comprehensive guide to storing and purifying water to prevent waterborne diseases. Learn about boiling, chlorination, and filtration techniques.',
      category: 'Water Purification',
      type: 'guide',
      duration: '8 min read',
      image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=400',
      difficulty: 'beginner',
      rating: 4.8,
      views: 1247,
      lastUpdated: '2 days ago',
      tags: ['water purification', 'storage', 'prevention']
    },
    {
      id: '2',
      title: 'Boiling Water: The Most Effective Purification Method',
      description: 'Step-by-step guide to properly boil water for safe consumption. Learn the correct temperature and duration for maximum effectiveness.',
      category: 'Water Purification',
      type: 'video',
      duration: '4 min',
      image: 'https://images.pexels.com/photos/4167542/pexels-photo-4167542.jpeg?auto=compress&cs=tinysrgb&w=400',
      difficulty: 'beginner',
      rating: 4.9,
      views: 2156,
      lastUpdated: '1 week ago',
      tags: ['boiling', 'purification', 'temperature', 'safety']
    },
    {
      id: '3',
      title: 'Cholera: Waterborne Disease Prevention Guide',
      description: 'Comprehensive infographic covering cholera symptoms, transmission through contaminated water, prevention methods, and emergency response procedures.',
      category: 'Waterborne Diseases',
      type: 'infographic',
      image: 'https://images.pexels.com/photos/3279197/pexels-photo-3279197.jpeg?auto=compress&cs=tinysrgb&w=400',
      downloadUrl: '#',
      difficulty: 'intermediate',
      rating: 4.7,
      views: 1893,
      lastUpdated: '3 days ago',
      tags: ['cholera', 'waterborne', 'symptoms', 'prevention', 'emergency']
    },
    {
      id: '4',
      title: 'Emergency Water Treatment During Disasters',
      description: 'Essential water treatment procedures for emergency situations including natural disasters, power outages, and water supply contamination.',
      category: 'Emergency Water',
      type: 'video',
      duration: '15 min',
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
      difficulty: 'intermediate',
      rating: 4.9,
      views: 3421,
      lastUpdated: '5 days ago',
      tags: ['emergency', 'disaster', 'water treatment', 'survival']
    },
    {
      id: '5',
      title: 'Water Conservation: Community Action Plan',
      description: 'Complete guide to water conservation practices for communities. Includes rainwater harvesting, efficient usage, and sustainable practices.',
      category: 'Water Conservation',
      type: 'article',
      duration: '10 min read',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400',
      difficulty: 'beginner',
      rating: 4.6,
      views: 1567,
      lastUpdated: '1 week ago',
      tags: ['conservation', 'rainwater', 'efficiency', 'sustainability']
    },
    {
      id: '6',
      title: 'Dengue Prevention: Eliminating Standing Water',
      description: 'Strategic infographic showing how communities can prevent dengue fever by eliminating standing water sources and proper water management.',
      category: 'Waterborne Diseases',
      type: 'infographic',
      image: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400',
      downloadUrl: '#',
      difficulty: 'intermediate',
      rating: 4.5,
      views: 1342,
      lastUpdated: '4 days ago',
      tags: ['dengue', 'standing water', 'mosquito control', 'prevention']
    },
    {
      id: '7',
      title: 'Water Quality Testing: DIY Methods for Communities',
      description: 'Learn simple methods to test water quality at home and in communities using household items and when to seek professional testing.',
      category: 'Water Testing',
      type: 'article',
      duration: '12 min read',
      image: 'https://images.pexels.com/photos/4056728/pexels-photo-4056728.jpeg?auto=compress&cs=tinysrgb&w=400',
      difficulty: 'beginner',
      rating: 4.8,
      views: 987,
      lastUpdated: '2 weeks ago',
      tags: ['water testing', 'DIY', 'quality assessment', 'community']
    },
    {
      id: '8',
      title: 'Community Water Infrastructure Maintenance',
      description: 'Essential guide for maintaining community water systems including pipes, storage tanks, and distribution networks to prevent contamination.',
      category: 'Water Infrastructure',
      type: 'guide',
      duration: '20 min read',
      image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=400',
      difficulty: 'intermediate',
      rating: 4.7,
      views: 2341,
      lastUpdated: '1 week ago',
      tags: ['infrastructure', 'maintenance', 'pipes', 'storage tanks']
    },
    {
      id: '9',
      title: 'Water Quality Testing: DIY Methods',
      description: 'Learn simple methods to test water quality at home using household items and when to seek professional testing.',
      category: 'Water Testing',
      type: 'video',
      duration: '7 min',
      image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=400',
      difficulty: 'intermediate',
      rating: 4.4,
      views: 1123,
      lastUpdated: '6 days ago',
      tags: ['water testing', 'DIY', 'quality assessment', 'safety']
    },
    {
      id: '10',
      title: 'Solar Water Disinfection (SODIS) Method',
      description: 'Learn how to use sunlight to disinfect water in clear plastic bottles. An effective, low-cost method for water purification.',
      category: 'Water Purification',
      type: 'guide',
      duration: '6 min read',
      image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=400',
      difficulty: 'beginner',
      rating: 4.6,
      views: 892,
      lastUpdated: '1 week ago',
      tags: ['SODIS', 'solar', 'disinfection', 'low-cost']
    },
    {
      id: '11',
      title: 'Typhoid Fever: Water Contamination Prevention',
      description: 'Complete guide to preventing typhoid fever through proper water treatment, sanitation practices, and community awareness.',
      category: 'Waterborne Diseases',
      type: 'infographic',
      duration: '8 min read',
      image: 'https://images.pexels.com/photos/3279197/pexels-photo-3279197.jpeg?auto=compress&cs=tinysrgb&w=400',
      difficulty: 'intermediate',
      rating: 4.5,
      views: 1456,
      lastUpdated: '3 days ago',
      tags: ['typhoid', 'water contamination', 'sanitation', 'prevention']
    },
    {
      id: '12',
      title: 'Rainwater Harvesting: Community Implementation',
      description: 'Step-by-step guide to implementing rainwater harvesting systems in communities for sustainable water supply and conservation.',
      category: 'Water Conservation',
      type: 'guide',
      duration: '15 min read',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400',
      difficulty: 'advanced',
      rating: 4.7,
      views: 1123,
      lastUpdated: '5 days ago',
      tags: ['rainwater', 'harvesting', 'community', 'sustainability']
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'infographic': return <Download className="h-4 w-4" />;
      case 'guide': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'text-blue-600 bg-blue-50';
      case 'video': return 'text-green-600 bg-green-50';
      case 'infographic': return 'text-purple-600 bg-purple-50';
      case 'guide': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredContent = awarenessContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || content.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Water Awareness Center</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access verified information about water-related problems, purification methods, and prevention strategies 
            for your community's water safety. Stay informed, stay healthy.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{awarenessContent.length}</h3>
            <p className="text-sm text-gray-600">Water Resources</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">15K+</h3>
            <p className="text-sm text-gray-600">Monthly Views</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">4.7</h3>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">8</h3>
            <p className="text-sm text-gray-600">Water Categories</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search water topics, purification methods, diseases..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((content) => (
              <div
                key={content.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={content.image}
                    alt={content.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    <span className="bg-white text-gray-900 text-xs font-semibold px-2 py-1 rounded-full">
                      {content.category}
                    </span>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(content.type)}`}>
                      {getTypeIcon(content.type)}
                      <span className="capitalize">{content.type}</span>
                    </span>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(content.difficulty)}`}>
                      <Shield className="h-3 w-3" />
                      <span className="capitalize">{content.difficulty}</span>
                    </span>
                  </div>
                  {content.duration && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{content.duration}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {content.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {content.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {content.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating and Views */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(content.rating)}
                      </div>
                      <span className="text-sm text-gray-600">({content.rating})</span>
                    </div>
                    <span className="text-sm text-gray-500">{content.views} views</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 group">
                      <span>Read More</span>
                      <ExternalLink className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100">
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100">
                        <Share2 className="h-4 w-4" />
                      </button>
                      {content.downloadUrl && (
                        <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100">
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContent.map((content) => (
              <div key={content.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all">
                <div className="flex space-x-6">
                  <img
                    src={content.image}
                    alt={content.title}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(content.type)}`}>
                          {getTypeIcon(content.type)}
                          <span className="capitalize">{content.type}</span>
                        </span>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(content.difficulty)}`}>
                          <Shield className="h-3 w-3" />
                          <span className="capitalize">{content.difficulty}</span>
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{content.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{content.category}</span>
                        {content.duration && <span>{content.duration}</span>}
                        <span>{content.views} views</span>
                        <span>Updated {content.lastUpdated}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Read More →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Emergency Guidelines */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Emergency Water Guidelines</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Know the warning signs of water contamination and immediate steps to take for water-related emergencies. 
              Quick action can prevent waterborne diseases and save lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                View Emergency Guide
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Featured Topics */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Water Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <Droplets className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Water Purification</h3>
              <p className="text-gray-600 text-sm mb-4">Learn about boiling, chlorination, and filtration methods</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Explore →</button>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
              <TestTube className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Water Testing</h3>
              <p className="text-gray-600 text-sm mb-4">DIY methods to test water quality at home</p>
              <button className="text-green-600 hover:text-green-700 font-medium text-sm">Explore →</button>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
              <Leaf className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Water Conservation</h3>
              <p className="text-gray-600 text-sm mb-4">Sustainable practices and rainwater harvesting</p>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">Explore →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AwarenessPage;