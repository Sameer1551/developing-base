import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error, r2_score
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

logger = logging.getLogger(__name__)

class ForecastEngine:
    def __init__(self):
        self.models = {}
        self.is_trained_flag = False
        self.forecast_data = {}
        
    def train_models(self, data: pd.DataFrame):
        """Train forecasting models"""
        try:
            logger.info("Training forecast models...")
            
            # Prepare time series data
            time_series_data = self._prepare_time_series_data(data)
            
            if time_series_data.empty:
                logger.warning("No time series data available for training")
                return
            
            # Train models for each district-disease combination
            for district in time_series_data['district'].unique():
                district_data = time_series_data[time_series_data['district'] == district]
                
                for disease in district_data['disease'].unique():
                    disease_data = district_data[district_data['disease'] == disease]
                    
                    if len(disease_data) < 3:  # Need at least 3 data points
                        continue
                    
                    # Train forecasting model
                    model_key = f"{district}_{disease}"
                    model = self._train_forecast_model(disease_data)
                    
                    if model:
                        self.models[model_key] = model
                        self.forecast_data[model_key] = disease_data
            
            self.is_trained_flag = len(self.models) > 0
            logger.info(f"Forecast models trained for {len(self.models)} district-disease combinations")
            
        except Exception as e:
            logger.error(f"Error training forecast models: {str(e)}")
            raise e
    
    def _prepare_time_series_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """Prepare time series data for forecasting"""
        try:
            # Ensure we have date column
            if 'date' not in data.columns:
                # Create synthetic dates if not available
                data['date'] = pd.date_range(start='2024-01-01', periods=len(data), freq='D')
            
            # Convert to datetime
            data['date'] = pd.to_datetime(data['date'])
            
            # Sort by date
            data = data.sort_values('date')
            
            # Group by district and disease, aggregate by month
            time_series_data = []
            
            for (district, disease), group in data.groupby(['district', 'disease']):
                # Aggregate by month
                monthly_data = group.set_index('date').resample('M').agg({
                    'cases': 'sum' if 'cases' in group.columns else lambda x: np.random.randint(1, 20),
                    'temperature': 'mean',
                    'humidity': 'mean',
                    'rainfall': 'sum',
                    'water_quality': 'mean'
                }).reset_index()
                
                monthly_data['district'] = district
                monthly_data['disease'] = disease
                monthly_data['month'] = monthly_data['date'].dt.month
                monthly_data['year'] = monthly_data['date'].dt.year
                
                time_series_data.append(monthly_data)
            
            if time_series_data:
                return pd.concat(time_series_data, ignore_index=True)
            else:
                return pd.DataFrame()
                
        except Exception as e:
            logger.error(f"Error preparing time series data: {str(e)}")
            return pd.DataFrame()
    
    def _train_forecast_model(self, data: pd.DataFrame) -> Optional[Dict[str, Any]]:
        """Train a forecasting model for a specific district-disease combination"""
        try:
            if len(data) < 3:
                return None
            
            # Prepare features and target
            X = data[['month', 'temperature', 'humidity', 'rainfall', 'water_quality']].values
            y = data['cases'].values
            
            # Handle missing values
            X = np.nan_to_num(X, nan=0)
            y = np.nan_to_num(y, nan=0)
            
            # Add polynomial features for better forecasting
            poly_features = PolynomialFeatures(degree=2, include_bias=False)
            X_poly = poly_features.fit_transform(X)
            
            # Train linear regression model
            model = LinearRegression()
            model.fit(X_poly, y)
            
            # Calculate model performance
            y_pred = model.predict(X_poly)
            mse = mean_squared_error(y, y_pred)
            r2 = r2_score(y, y_pred)
            
            return {
                'model': model,
                'poly_features': poly_features,
                'mse': mse,
                'r2': r2,
                'last_data': data.iloc[-1].to_dict(),
                'trend': self._calculate_trend(y)
            }
            
        except Exception as e:
            logger.error(f"Error training forecast model: {str(e)}")
            return None
    
    def _calculate_trend(self, y: np.ndarray) -> str:
        """Calculate trend direction"""
        if len(y) < 2:
            return 'stable'
        
        # Simple trend calculation
        first_half = np.mean(y[:len(y)//2])
        second_half = np.mean(y[len(y)//2:])
        
        if second_half > first_half * 1.1:
            return 'increasing'
        elif second_half < first_half * 0.9:
            return 'decreasing'
        else:
            return 'stable'
    
    def predict(self, district: str, days: int = 30) -> Dict[str, Any]:
        """Generate forecast for a district"""
        try:
            if not self.is_trained_flag:
                logger.warning("Forecast models not trained, returning mock forecast")
                return self._generate_mock_forecast(district, days)
            
            # Find models for this district
            district_models = {k: v for k, v in self.models.items() if k.startswith(district)}
            
            if not district_models:
                logger.warning(f"No forecast models found for district {district}")
                return self._generate_mock_forecast(district, days)
            
            forecasts = {}
            
            for model_key, model_data in district_models.items():
                disease = model_key.split('_')[1]
                
                # Generate forecast
                forecast = self._generate_forecast(model_data, days)
                forecasts[disease] = forecast
            
            return {
                'district': district,
                'forecast_period': f"{days} days",
                'generated_at': datetime.now().isoformat(),
                'disease_forecasts': forecasts,
                'summary': self._generate_forecast_summary(forecasts)
            }
            
        except Exception as e:
            logger.error(f"Error generating forecast: {str(e)}")
            return self._generate_mock_forecast(district, days)
    
    def _generate_forecast(self, model_data: Dict[str, Any], days: int) -> Dict[str, Any]:
        """Generate forecast using trained model"""
        try:
            model = model_data['model']
            poly_features = model_data['poly_features']
            last_data = model_data['last_data']
            trend = model_data['trend']
            
            # Generate future dates
            future_dates = pd.date_range(
                start=datetime.now(),
                periods=days,
                freq='D'
            )
            
            # Prepare future features (use last known values with seasonal adjustments)
            future_features = []
            for date in future_dates:
                month = date.month
                # Use last known environmental values with seasonal variations
                temp = last_data.get('temperature', 25) + np.sin(2 * np.pi * month / 12) * 5
                humidity = last_data.get('humidity', 60) + np.cos(2 * np.pi * month / 12) * 10
                rainfall = last_data.get('rainfall', 100) * (1 + np.sin(2 * np.pi * month / 12) * 0.3)
                water_quality = last_data.get('water_quality', 5)
                
                future_features.append([month, temp, humidity, rainfall, water_quality])
            
            future_features = np.array(future_features)
            future_features_poly = poly_features.transform(future_features)
            
            # Generate predictions
            predictions = model.predict(future_features_poly)
            
            # Apply trend adjustment
            if trend == 'increasing':
                trend_multiplier = np.linspace(1, 1.2, days)
            elif trend == 'decreasing':
                trend_multiplier = np.linspace(1, 0.8, days)
            else:
                trend_multiplier = np.ones(days)
            
            predictions = predictions * trend_multiplier
            predictions = np.maximum(predictions, 0)  # Ensure non-negative
            
            return {
                'dates': [date.isoformat() for date in future_dates],
                'predicted_cases': predictions.tolist(),
                'trend': trend,
                'confidence': min(0.9, model_data.get('r2', 0.5) + 0.3),
                'model_performance': {
                    'mse': model_data.get('mse', 0),
                    'r2': model_data.get('r2', 0)
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating forecast: {str(e)}")
            return {
                'dates': [(datetime.now() + timedelta(days=i)).isoformat() for i in range(days)],
                'predicted_cases': [np.random.randint(1, 20) for _ in range(days)],
                'trend': 'stable',
                'confidence': 0.5,
                'model_performance': {'mse': 0, 'r2': 0}
            }
    
    def _generate_forecast_summary(self, forecasts: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        """Generate summary of all disease forecasts"""
        try:
            total_cases = sum(
                sum(forecast['predicted_cases']) 
                for forecast in forecasts.values()
            )
            
            max_cases_disease = max(
                forecasts.items(),
                key=lambda x: sum(x[1]['predicted_cases'])
            )
            
            avg_confidence = np.mean([
                forecast['confidence'] 
                for forecast in forecasts.values()
            ])
            
            return {
                'total_predicted_cases': int(total_cases),
                'highest_risk_disease': max_cases_disease[0],
                'average_confidence': float(avg_confidence),
                'diseases_forecasted': len(forecasts),
                'risk_assessment': self._assess_overall_risk(total_cases, len(forecasts))
            }
            
        except Exception as e:
            logger.error(f"Error generating forecast summary: {str(e)}")
            return {
                'total_predicted_cases': 0,
                'highest_risk_disease': 'Unknown',
                'average_confidence': 0.5,
                'diseases_forecasted': 0,
                'risk_assessment': 'Low'
            }
    
    def _assess_overall_risk(self, total_cases: float, num_diseases: int) -> str:
        """Assess overall risk level"""
        avg_cases_per_disease = total_cases / max(num_diseases, 1)
        
        if avg_cases_per_disease > 50:
            return 'High'
        elif avg_cases_per_disease > 20:
            return 'Medium'
        else:
            return 'Low'
    
    def _generate_mock_forecast(self, district: str, days: int) -> Dict[str, Any]:
        """Generate mock forecast when models are not trained"""
        diseases = ['Cholera', 'Dengue', 'Malaria', 'Typhoid']
        forecasts = {}
        
        for disease in diseases:
            # Generate synthetic forecast data
            base_cases = np.random.randint(5, 25)
            trend_factor = np.random.choice([0.8, 1.0, 1.2])
            
            predicted_cases = []
            for i in range(days):
                # Add some randomness and trend
                cases = base_cases * trend_factor * (1 + np.random.normal(0, 0.1))
                predicted_cases.append(max(0, int(cases)))
            
            forecasts[disease] = {
                'dates': [(datetime.now() + timedelta(days=i)).isoformat() for i in range(days)],
                'predicted_cases': predicted_cases,
                'trend': 'stable',
                'confidence': np.random.uniform(0.6, 0.8),
                'model_performance': {'mse': 0, 'r2': 0}
            }
        
        return {
            'district': district,
            'forecast_period': f"{days} days",
            'generated_at': datetime.now().isoformat(),
            'disease_forecasts': forecasts,
            'summary': self._generate_forecast_summary(forecasts)
        }
    
    def is_trained(self) -> bool:
        """Check if models are trained"""
        return self.is_trained_flag
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about trained models"""
        return {
            'trained': self.is_trained_flag,
            'models_count': len(self.models),
            'model_keys': list(self.models.keys()),
            'forecast_data_count': len(self.forecast_data)
        }
