# NE HealthNet - Northeast India Health Monitoring System

## 🌟 Overview
NE HealthNet is a comprehensive health monitoring and management system designed specifically for Northeast India. It provides multilingual support for 25+ regional languages, open access health reporting for citizens, and role-based dashboards for health workers and administrators. The system is built as a full-stack application with a React frontend and Express.js backend, featuring real-time data persistence and comprehensive health analytics.

## 🚀 Key Features

### 🌐 Multilingual Support (25+ Languages)
- **English, Hindi, Assamese, Bengali, Nepali**
- **Northeast Regional Languages**: Bodo, Karbi, Mishing, Manipuri, Khasi, Garo, Jaintia, Mizo, Nagamese, Ao, Angami, Sema, Lotha, Nyishi, Apatani, Adi, Mishmi, Monpa, Tripuri, Kokborok
- **Dynamic Language Switching**: Real-time language change without page reload
- **Localized Content**: All UI elements, forms, and content translated

### 🔓 Open Access Features (No Login Required)
- **Health Issue Reporting**: Submit detailed health reports with symptoms, photos, and location
- **Community Alerts**: View real-time health alerts and disease outbreak notifications
- **Health Awareness**: Access educational content and prevention information
- **Water Quality Information**: Public access to water quality data and testing results
- **Interactive Northeast Map**: Explore health data across Northeast India regions

### 👥 Role-Based Access Control
- **Public Users**: Blue theme, basic health reporting and alert viewing
- **Health Workers**: Green theme, staff dashboard, water testing, medicine distribution
- **Administrators**: Purple theme, admin dashboard, analytics, user management, AI predictions

### 🗺️ Geographic Features
- **Interactive Maps**: Leaflet-based maps showing health data across Northeast India
- **District-wise Analytics**: Health statistics and reports organized by districts
- **GADM Integration**: Administrative boundary data for accurate geographic representation
- **Location-based Reporting**: Precise location tracking for health incidents

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Modern React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive, modern UI design
- **React Router** for client-side routing
- **i18next** for comprehensive internationalization
- **Leaflet** for interactive mapping
- **Lucide React** for consistent iconography

### Backend (Express.js + Node.js)
- **Express.js** REST API server for data management
- **CORS** enabled for cross-origin requests
- **JSON File Storage**: Direct file-based data persistence
- **RESTful API**: Standard HTTP endpoints for CRUD operations
- **Error Handling**: Comprehensive error handling and validation
- **Health Monitoring**: Built-in health check endpoints

### Data & Storage
- **API-First Architecture**: Frontend communicates with backend via REST API
- **JSON Data Files**: Persistent storage in `Data-UAD/` directory
- **Fallback Mechanism**: Local storage fallback when API is unavailable
- **Real-time Persistence**: Immediate data saving to JSON files
- **Client-Side State Management**: React contexts for application state

### Data & Analytics
- **Health Reports**: Structured health incident reporting with photo uploads
- **Alert System**: Real-time health alerts and notifications with API persistence
- **User Management**: Complete user CRUD operations via API
- **Analytics Dashboard**: Comprehensive health statistics and trends
- **Server-Side Processing**: Backend data validation and processing

## 🛠️ Technology Stack

### Frontend
```json
{
  "react": "^18.3.1",
  "typescript": "^5.5.3",
  "vite": "^5.4.2",
  "tailwindcss": "^3.4.1",
  "react-router-dom": "^7.8.2",
  "i18next": "^25.4.2",
  "leaflet": "^1.9.4",
  "lucide-react": "^0.344.0",
  "react-leaflet": "^4.2.1",
  "axios": "^1.6.0"
}
```

### Backend
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "concurrently": "^8.2.2",
  "fs-extra": "^11.1.1"
}
```

### Data Storage
```json
{
  "apiFirst": "REST API with Express.js backend",
  "jsonFiles": "Persistent JSON file storage in Data-UAD/",
  "localStorage": "Browser fallback when API unavailable",
  "clientState": "React contexts for application state management"
}
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ne-healthnet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the full-stack application**
   ```bash
   # Starts both backend and frontend servers
   npm run dev
   ```

4. **Access the application**
   - **Frontend**: `http://localhost:5173`
   - **Backend API**: `http://localhost:3001`
   - **API Health Check**: `http://localhost:3001/api/health`

### Alternative: Run Servers Separately

```bash
# Terminal 1 - Backend Server
npm run server

# Terminal 2 - Frontend Client
npm run client
```

## 🔌 API Endpoints

The backend provides RESTful API endpoints for data management:

### User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Add a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Alert Management
- `GET /api/alerts` - Get all alerts (sorted by creation date)
- `POST /api/alerts` - Add a new alert
- `PUT /api/alerts/:id` - Update an alert
- `DELETE /api/alerts/:id` - Delete an alert

### System
- `GET /api/health` - Health check endpoint

### Data Persistence
- **User Data**: Stored in `Data-UAD/DATAUAD.json`
- **Alert Data**: Stored in `Data-UAD/alert.json`
- **Real-time Updates**: Changes are immediately saved to JSON files
- **Fallback Support**: Frontend falls back to localStorage if API is unavailable

## 📱 User Interfaces

### Public Interface
- **Home Page**: Health statistics, quick access to reporting
- **Report Issues**: Comprehensive health incident reporting form
- **Check Alerts**: Real-time health alerts and notifications
- **Awareness**: Health education and prevention information
- **Water Quality**: Public water quality data and testing results
- **Northeast Map**: Interactive map with health data visualization

### Staff Dashboard
- **Reports Management**: View and process health reports
- **Water Testing**: Submit water quality test results
- **Medicine Distribution**: Track medicine distribution
- **Statistics**: District-wise health statistics

### Admin Dashboard
- **User Management**: Create and manage user accounts
- **Alert Management**: Create and manage health alerts
- **Analytics**: Comprehensive health analytics and trends
- **AI Predictions**: Disease outbreak predictions and risk assessment
- **Resource Deployment**: Manage health resources and personnel

## 🌍 Multilingual Support

The system supports 25+ languages with complete localization:

### Supported Languages
- **Major Languages**: English, Hindi, Assamese, Bengali, Nepali
- **Northeast Regional**: Bodo, Karbi, Mishing, Manipuri, Khasi, Garo, Jaintia, Mizo, Nagamese, Ao, Angami, Sema, Lotha, Nyishi, Apatani, Adi, Mishmi, Monpa, Tripuri, Kokborok

### Language Features
- **Dynamic Switching**: Change language without page reload
- **Localized Content**: All UI elements, forms, and messages translated
- **Regional Context**: Health information adapted for local contexts
- **Browser Detection**: Automatic language detection based on browser settings

## 🔐 Security Features

### Client-Side Security
- **Input Validation**: Comprehensive input sanitization and validation
- **XSS Protection**: Input sanitization and output encoding
- **Local Data Encryption**: Secure storage of sensitive data in browser
- **HTTPS Ready**: Production-ready HTTPS configuration

## 📊 Data Management

### Health Reports
- **Structured Reporting**: Standardized health incident reporting
- **Photo Uploads**: Support for multiple photo attachments
- **Location Tracking**: Precise geographic location capture
- **Urgency Levels**: Critical, High, Medium, Low priority classification
- **Status Tracking**: Pending, In Progress, Processed, Resolved statuses

### Alert System
- **Real-time Alerts**: Immediate notification of health incidents
- **Geographic Targeting**: District and location-specific alerts
- **Priority Management**: Critical, High, Medium, Low priority alerts
- **Response Tracking**: Alert response time and resolution tracking

## 🗺️ Geographic Features

### Interactive Maps
- **Leaflet Integration**: High-performance interactive maps
- **GADM Data**: Administrative boundary data for Northeast India
- **Health Data Overlay**: Visual representation of health incidents
- **District Boundaries**: Clear administrative divisions

### Location Services
- **Precise Location**: GPS and manual location input
- **District Mapping**: Automatic district assignment based on location
- **Regional Analytics**: Health data aggregated by geographic regions

## 🤖 AI & Analytics

### Machine Learning Features
- **Disease Prediction**: AI models for outbreak prediction
- **Health Trend Analysis**: Pattern recognition in health data
- **Risk Assessment**: Automated risk scoring for health incidents
- **Anomaly Detection**: Identification of unusual health patterns

### Analytics Dashboard
- **Real-time Statistics**: Live health data and metrics
- **Trend Analysis**: Historical data analysis and trends
- **Geographic Analytics**: Location-based health insights
- **Performance Metrics**: System performance and usage statistics

## 🚀 Deployment

### Development
```bash
# Start full-stack development environment
npm run dev
```

### Production Build
```bash
# Build frontend for production
npm run build
```

### Full-Stack Deployment Options

#### Option 1: Traditional VPS/Cloud Server
- **Frontend**: Serve built files from `dist/` directory
- **Backend**: Run Express server with PM2 or similar process manager
- **Requirements**: Node.js runtime, file system access for JSON storage

#### Option 2: Platform-as-a-Service
- **Railway**: Deploy both frontend and backend
- **Heroku**: Deploy with buildpacks for Node.js
- **DigitalOcean App Platform**: Full-stack deployment
- **AWS Elastic Beanstalk**: Container-based deployment

#### Option 3: Container Deployment
```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "server"]
```

### Environment Variables
```bash
# Backend configuration
PORT=3001
NODE_ENV=production
```

### Static Hosting (Frontend Only)
For frontend-only deployment with API fallback:
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: Deploy from GitHub Actions
- **AWS S3**: Upload build files to S3 bucket

## 📁 Project Structure

```
ne-healthnet/
├── src/                          # Frontend React application
│   ├── components/               # Reusable React components
│   │   ├── AdminDashboard/       # Admin-specific components
│   │   ├── Dashboard/            # Staff dashboard components
│   │   ├── ReportForm/           # Health reporting form components
│   │   └── ...
│   ├── contexts/                 # React contexts (Auth, Language)
│   ├── locales/                  # Translation files (25+ languages)
│   ├── pages/                    # Main application pages
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions (API integration)
├── server/                       # Backend Express.js server
│   └── index.js                  # Main server file with API endpoints
├── Data-UAD/                     # Data persistence directory
│   ├── DATAUAD.json              # User data storage
│   ├── alert.json                # Alert data storage
│   └── population.json           # Population data
├── public/                       # Static assets
│   └── data/                     # Geographic and health data
├── dist/                         # Production build output
├── scripts/                      # Utility scripts
├── package.json                  # Dependencies and scripts
├── BACKEND_SETUP.md              # Backend setup documentation
└── README.md                     # This file
```

## 🧪 Testing

### Testing Features
1. **Public Access**: Navigate without login to test open access features
2. **Language Switching**: Test all 25+ supported languages
3. **Role-based Access**: Switch between different user roles to test interfaces
4. **Geographic Features**: Test map functionality and location services
5. **Form Submission**: Test health reporting and alert creation
6. **API Integration**: Test user and alert CRUD operations via REST API
7. **Data Persistence**: Test real-time data saving to JSON files
8. **Fallback Mechanism**: Test localStorage fallback when API is unavailable

### API Testing
```bash
# Test API endpoints
curl http://localhost:3001/api/health
curl http://localhost:3001/api/users
curl http://localhost:3001/api/alerts
```

## 🔧 Configuration

### Language Configuration
Languages are configured in `src/i18n.ts` and translation files are located in `src/locales/`.

### Backend Configuration
- **Server Port**: Configured in `server/index.js` (default: 3001)
- **CORS**: Enabled for cross-origin requests
- **Data Files**: JSON files in `Data-UAD/` directory
- **API Endpoints**: RESTful endpoints for data management

### Data Configuration
- **User Data**: Stored in `Data-UAD/DATAUAD.json` via API
- **Alert Data**: Stored in `Data-UAD/alert.json` via API
- **Geographic Data**: Static JSON files in `public/data/`
- **Health Data**: Static JSON files in `public/data/`
- **Fallback Storage**: Browser localStorage when API unavailable

## 📈 Performance

### Frontend Optimization
- **Vite**: Fast development and optimized production builds
- **Code Splitting**: Lazy loading of components and pages
- **Image Optimization**: Optimized images and assets
- **Caching**: Browser caching for static assets

### Data Optimization
- **Local Storage**: Efficient browser-based data storage
- **Static Assets**: Optimized static file delivery
- **Client-Side Caching**: Browser caching for improved performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Ensure multilingual support for new content

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@healthnet.gov.in
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🗺️ Roadmap

### Phase 1 (Completed)
- ✅ Multilingual support (25+ languages)
- ✅ Open access health reporting
- ✅ Role-based dashboards
- ✅ Interactive maps
- ✅ Full-stack architecture with Express.js backend
- ✅ REST API for data management
- ✅ Real-time data persistence

### Phase 2 (Current/Upcoming)
- 🔄 Mobile app development
- 🔄 Advanced AI/ML models
- 🔄 Real-time notifications
- 🔄 Database integration (PostgreSQL/MongoDB)
- 🔄 User authentication and authorization
- 🔄 Advanced analytics and reporting

### Phase 3 (Future)
- 📋 IoT device integration
- 📋 Blockchain for data integrity
- 📋 Advanced predictive analytics
- 📋 Telemedicine integration
- 📋 Community health worker app
- 📋 Microservices architecture

---

**NE HealthNet - Empowering Northeast India with accessible, multilingual health monitoring technology.**
