# NE HealthNet AI Prediction Service

A Python-based AI service for predicting disease outbreaks in Northeast India using machine learning models trained on health and environmental data.

## 🌟 Features

- **Disease Outbreak Prediction**: ML models to predict disease outbreaks
- **Environmental Analysis**: Weather, water quality, and environmental factor analysis
- **Population Health Metrics**: Vaccination rates, population density analysis
- **Time Series Forecasting**: Future trend prediction using historical data
- **RESTful API**: FastAPI-based service with automatic documentation
- **CSV Data Integration**: Processes your health data CSV files

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd python_ai_service
pip install -r requirements.txt
```

### 2. Start the Service

```bash
python start_service.py
```

The service will start on `http://localhost:8000`

### 3. Access API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📊 API Endpoints

### Core Endpoints

- `GET /` - Service information
- `GET /health` - Health check
- `GET /models/info` - Model information
- `POST /predict` - Generate predictions
- `POST /refresh` - Refresh models with latest data
- `GET /predictions/all` - Get all predictions
- `GET /forecast/{district}` - Get detailed forecast

### Example Usage

#### Generate Predictions

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "district": "Senapati",
    "disease": "Cholera",
    "timeframe_days": 30,
    "include_environmental": true,
    "include_population": true
  }'
```

#### Get Forecast

```bash
curl "http://localhost:8000/forecast/Senapati?days=30"
```

## 🤖 ML Models

### Disease Predictor
- **Random Forest Classifier**: Risk level prediction
- **Gradient Boosting**: Ensemble prediction
- **Features**: Temperature, humidity, rainfall, water quality, population density, vaccination rate

### Forecast Engine
- **Linear Regression**: Time series forecasting
- **Polynomial Features**: Non-linear trend capture
- **Seasonal Adjustment**: Monthly and yearly patterns

## 📁 Data Processing

The service automatically processes your CSV files from the `New folder` directory:

- `hyper_realistic_health_data.csv`
- `monsoon_jun-jul2024.csv`
- `postmonsoon_aug-oct2024.csv`
- `pre_monsoon_health_data_1000.csv`
- `winter_health_data_1000.csv`
- `winter_health_data_Nov-Jan.csv`
- `rainfall_health_data_2024-2025.csv`
- `water_quality_report_2024-2025.csv`

## 🔧 Configuration

### Environment Variables

- `CSV_DATA_PATH`: Path to CSV files (default: `../New folder`)
- `MODEL_SAVE_PATH`: Path to save trained models
- `LOG_LEVEL`: Logging level (default: `INFO`)

### Model Parameters

- **Random Forest**: 100 estimators, max depth 10
- **Gradient Boosting**: 100 estimators, learning rate 0.1
- **Polynomial Features**: Degree 2 for forecasting

## 📈 Prediction Output

```json
{
  "id": "pred-20241219143000-0",
  "district": "Senapati",
  "disease": "Cholera",
  "riskLevel": "High",
  "probability": 0.78,
  "confidence": 0.85,
  "timeframe": "30 days",
  "factors": ["High temperature", "Poor water quality", "Low vaccination rate"],
  "environmentalData": {
    "temperature": 28.5,
    "humidity": 85,
    "rainfall": 450,
    "waterQuality": 3.2
  },
  "populationData": {
    "density": 125,
    "vaccinationRate": 0.45,
    "mobility": 0.72
  },
  "historicalTrend": {
    "cases": [12, 18, 25, 31, 28, 35],
    "dates": ["2024-01-01", "2024-02-01", "2024-03-01", "2024-04-01", "2024-05-01", "2024-06-01"]
  },
  "recommendations": [
    "Deploy emergency water purification units",
    "Increase cholera vaccination coverage",
    "Set up temporary health camps",
    "Implement water quality monitoring"
  ],
  "createdAt": "2024-12-19T10:30:00Z",
  "updatedAt": "2024-12-19T14:45:00Z",
  "modelVersion": "v2.1"
}
```

## 🔗 Integration with Frontend

The service is designed to integrate seamlessly with your React frontend:

1. **Update Node.js Backend**: Add API calls to this Python service
2. **Replace Mock Data**: Use real predictions from the ML models
3. **Real-time Updates**: Call `/refresh` endpoint to update models
4. **Chart Integration**: Use prediction data for your visualization charts

## 🛠️ Development

### Project Structure

```
python_ai_service/
├── app.py                 # FastAPI application
├── start_service.py       # Startup script
├── requirements.txt       # Dependencies
├── README.md             # This file
└── ml_models/
    ├── __init__.py
    ├── data_processor.py # CSV data processing
    ├── disease_predictor.py # ML models for disease prediction
    └── forecast_engine.py   # Time series forecasting
```

### Adding New Models

1. Create new model class in `ml_models/`
2. Import and initialize in `app.py`
3. Add new endpoints as needed
4. Update API documentation

## 🚨 Troubleshooting

### Common Issues

1. **CSV Files Not Found**: Ensure CSV files are in the correct directory
2. **Model Training Errors**: Check data quality and column names
3. **Port Already in Use**: Change port in `start_service.py`
4. **Memory Issues**: Reduce data size or increase system memory

### Logs

Check console output for detailed logs:
- Model training progress
- API request/response logs
- Error messages and stack traces

## 📞 Support

For issues or questions:
1. Check the logs for error messages
2. Verify CSV data format
3. Ensure all dependencies are installed
4. Check API documentation at `/docs`

## 🔄 Updates

To update models with new data:
1. Add new CSV files to the data directory
2. Call `POST /refresh` endpoint
3. Models will retrain automatically
4. New predictions will use updated models
