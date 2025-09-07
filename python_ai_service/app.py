from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import joblib
import os
from pathlib import Path
import logging

# Import our ML modules
from ml_models.disease_predictor import DiseasePredictor
from ml_models.data_processor import DataProcessor
from ml_models.forecast_engine import ForecastEngine

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="NE HealthNet AI Prediction Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class PredictionRequest(BaseModel):
    district: str
    disease: Optional[str] = None
    timeframe_days: int = 30
    include_environmental: bool = True
    include_population: bool = True

class PredictionResponse(BaseModel):
    id: str
    district: str
    disease: str
    riskLevel: str
    probability: float
    confidence: float
    timeframe: str
    factors: List[str]
    environmentalData: Dict[str, float]
    populationData: Dict[str, float]
    historicalTrend: Dict[str, List]
    recommendations: List[str]
    createdAt: str
    updatedAt: str
    modelVersion: str

class RefreshResponse(BaseModel):
    success: bool
    message: str
    predictions_updated: int
    timestamp: str

# Initialize ML components
data_processor = DataProcessor()
disease_predictor = DiseasePredictor()
forecast_engine = ForecastEngine()

@app.on_event("startup")
async def startup_event():
    """Initialize ML models on startup"""
    try:
        logger.info("Initializing AI models...")
        
        # Load and process CSV data
        csv_data = data_processor.load_csv_data()
        logger.info(f"Loaded {len(csv_data)} records from CSV files")
        
        # Train models
        disease_predictor.train_models(csv_data)
        forecast_engine.train_models(csv_data)
        
        logger.info("AI models initialized successfully!")
        
    except Exception as e:
        logger.error(f"Error initializing models: {str(e)}")
        raise e

@app.get("/")
async def root():
    return {
        "message": "NE HealthNet AI Prediction Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "predict": "/predict",
            "refresh": "/refresh",
            "health": "/health",
            "models": "/models/info"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": disease_predictor.is_trained() and forecast_engine.is_trained()
    }

@app.get("/models/info")
async def models_info():
    """Get information about loaded models"""
    return {
        "disease_predictor": {
            "trained": disease_predictor.is_trained(),
            "models": disease_predictor.get_model_info()
        },
        "forecast_engine": {
            "trained": forecast_engine.is_trained(),
            "models": forecast_engine.get_model_info()
        },
        "data_processor": {
            "csv_files_loaded": data_processor.get_csv_info()
        }
    }

@app.post("/predict", response_model=List[PredictionResponse])
async def predict_disease_outbreaks(request: PredictionRequest):
    """Generate AI predictions for disease outbreaks"""
    try:
        logger.info(f"Generating predictions for district: {request.district}")
        
        # Get predictions from ML models
        predictions = disease_predictor.predict(
            district=request.district,
            disease=request.disease,
            timeframe_days=request.timeframe_days,
            include_environmental=request.include_environmental,
            include_population=request.include_population
        )
        
        # Convert to response format
        response_predictions = []
        for pred in predictions:
            response_predictions.append(PredictionResponse(
                id=f"pred-{datetime.now().strftime('%Y%m%d%H%M%S')}-{len(response_predictions)}",
                district=pred["district"],
                disease=pred["disease"],
                riskLevel=pred["risk_level"],
                probability=pred["probability"],
                confidence=pred["confidence"],
                timeframe=pred["timeframe"],
                factors=pred["factors"],
                environmentalData=pred["environmental_data"],
                populationData=pred["population_data"],
                historicalTrend=pred["historical_trend"],
                recommendations=pred["recommendations"],
                createdAt=datetime.now().isoformat(),
                updatedAt=datetime.now().isoformat(),
                modelVersion="v2.1"
            ))
        
        logger.info(f"Generated {len(response_predictions)} predictions")
        return response_predictions
        
    except Exception as e:
        logger.error(f"Error generating predictions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/refresh", response_model=RefreshResponse)
async def refresh_predictions():
    """Refresh all predictions with latest data"""
    try:
        logger.info("Refreshing predictions...")
        
        # Reload CSV data
        csv_data = data_processor.load_csv_data()
        
        # Retrain models with latest data
        disease_predictor.train_models(csv_data)
        forecast_engine.train_models(csv_data)
        
        logger.info("Predictions refreshed successfully!")
        
        return RefreshResponse(
            success=True,
            message="Predictions refreshed successfully",
            predictions_updated=len(csv_data),
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error refreshing predictions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predictions/all")
async def get_all_predictions():
    """Get predictions for all districts"""
    try:
        # Get predictions for all districts
        all_predictions = []
        districts = ["Imphal East", "Imphal West", "Bishnupur", "Senapati", "Churachandpur"]
        
        for district in districts:
            predictions = disease_predictor.predict(
                district=district,
                timeframe_days=30,
                include_environmental=True,
                include_population=True
            )
            all_predictions.extend(predictions)
        
        return all_predictions
        
    except Exception as e:
        logger.error(f"Error getting all predictions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/forecast/{district}")
async def get_forecast(district: str, days: int = 30):
    """Get detailed forecast for a specific district"""
    try:
        forecast = forecast_engine.predict(district=district, days=days)
        return forecast
        
    except Exception as e:
        logger.error(f"Error getting forecast for {district}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
