import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import os

logger = logging.getLogger(__name__)

class DiseasePredictor:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.label_encoders = {}
        self.is_trained_flag = False
        self.feature_columns = [
            'temperature', 'humidity', 'rainfall', 'water_quality',
            'population_density', 'vaccination_rate'
        ]
        
    def train_models(self, data: pd.DataFrame):
        """Train ML models for disease prediction"""
        try:
            logger.info("Training disease prediction models...")
            
            # Prepare training data
            X, y = self._prepare_training_data(data)
            
            if X.empty or y.empty:
                logger.warning("No training data available")
                return
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Train Random Forest
            rf_model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                class_weight='balanced'
            )
            rf_model.fit(X_train_scaled, y_train)
            
            # Train Gradient Boosting
            gb_model = GradientBoostingClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=6,
                random_state=42
            )
            gb_model.fit(X_train_scaled, y_train)
            
            # Evaluate models
            rf_score = accuracy_score(y_test, rf_model.predict(X_test_scaled))
            gb_score = accuracy_score(y_test, gb_model.predict(X_test_scaled))
            
            logger.info(f"Random Forest accuracy: {rf_score:.3f}")
            logger.info(f"Gradient Boosting accuracy: {gb_score:.3f}")
            
            # Store models
            self.models = {
                'random_forest': rf_model,
                'gradient_boosting': gb_model
            }
            self.scalers['main'] = scaler
            
            # Create label encoders for districts and diseases
            self.label_encoders['district'] = LabelEncoder()
            self.label_encoders['disease'] = LabelEncoder()
            
            self.label_encoders['district'].fit(data['district'].unique())
            self.label_encoders['disease'].fit(data['disease'].unique())
            
            self.is_trained_flag = True
            logger.info("Disease prediction models trained successfully!")
            
        except Exception as e:
            logger.error(f"Error training models: {str(e)}")
            raise e
    
    def _prepare_training_data(self, data: pd.DataFrame) -> tuple:
        """Prepare training data for ML models"""
        try:
            # Filter data with all required columns
            required_cols = ['district', 'disease'] + self.feature_columns
            available_cols = [col for col in required_cols if col in data.columns]
            
            if len(available_cols) < 3:  # Need at least district, disease, and one feature
                logger.warning("Insufficient columns for training")
                return pd.DataFrame(), pd.Series()
            
            # Create training data
            train_data = data[available_cols].copy()
            train_data = train_data.dropna()
            
            if len(train_data) < 10:
                logger.warning("Insufficient data for training")
                return pd.DataFrame(), pd.Series()
            
            # Create target variable (risk level based on cases)
            if 'cases' in data.columns:
                train_data['risk_level'] = pd.cut(
                    data['cases'], 
                    bins=[0, 10, 25, float('inf')], 
                    labels=['Low', 'Medium', 'High']
                )
            else:
                # Generate synthetic risk levels based on environmental factors
                risk_score = (
                    train_data['temperature'].fillna(25) * 0.2 +
                    train_data['humidity'].fillna(60) * 0.3 +
                    train_data['rainfall'].fillna(100) * 0.2 +
                    (10 - train_data['water_quality'].fillna(5)) * 0.3
                )
                train_data['risk_level'] = pd.cut(
                    risk_score, 
                    bins=[0, 20, 40, float('inf')], 
                    labels=['Low', 'Medium', 'High']
                )
            
            # Prepare features and target
            feature_cols = [col for col in self.feature_columns if col in train_data.columns]
            X = train_data[feature_cols].copy()
            y = train_data['risk_level'].copy()
            
            # Fill missing values
            X = X.fillna(X.median())
            
            return X, y
            
        except Exception as e:
            logger.error(f"Error preparing training data: {str(e)}")
            return pd.DataFrame(), pd.Series()
    
    def predict(self, district: str, disease: Optional[str] = None, 
                timeframe_days: int = 30, include_environmental: bool = True,
                include_population: bool = True) -> List[Dict[str, Any]]:
        """Generate predictions for a district"""
        try:
            if not self.is_trained_flag:
                logger.warning("Models not trained, returning mock predictions")
                return self._generate_mock_predictions(district, disease, timeframe_days)
            
            # Get recent data for the district
            recent_data = self._get_recent_district_data(district)
            
            if recent_data.empty:
                logger.warning(f"No recent data for district {district}")
                return self._generate_mock_predictions(district, disease, timeframe_days)
            
            predictions = []
            
            # Predict for each disease in the district
            diseases = recent_data['disease'].unique() if disease is None else [disease]
            
            for dis in diseases:
                disease_data = recent_data[recent_data['disease'] == dis]
                
                if disease_data.empty:
                    continue
                
                # Get latest environmental and population data
                latest_data = disease_data.iloc[-1]
                
                # Prepare features for prediction
                features = self._prepare_prediction_features(latest_data)
                
                if features is None:
                    continue
                
                # Make prediction
                features_scaled = self.scalers['main'].transform([features])
                
                # Use ensemble prediction
                rf_pred = self.models['random_forest'].predict_proba(features_scaled)[0]
                gb_pred = self.models['gradient_boosting'].predict_proba(features_scaled)[0]
                
                # Average predictions
                ensemble_pred = (rf_pred + gb_pred) / 2
                
                # Get risk level
                risk_levels = ['Low', 'Medium', 'High']
                risk_idx = np.argmax(ensemble_pred)
                risk_level = risk_levels[risk_idx]
                probability = float(ensemble_pred[risk_idx])
                confidence = float(np.max(ensemble_pred))
                
                # Generate prediction details
                prediction = {
                    'district': district,
                    'disease': dis,
                    'risk_level': risk_level,
                    'probability': probability,
                    'confidence': confidence,
                    'timeframe': f"{timeframe_days} days",
                    'factors': self._generate_factors(latest_data, risk_level),
                    'environmental_data': {
                        'temperature': float(latest_data.get('temperature', 25)),
                        'humidity': float(latest_data.get('humidity', 60)),
                        'rainfall': float(latest_data.get('rainfall', 100)),
                        'water_quality': float(latest_data.get('water_quality', 5))
                    },
                    'population_data': {
                        'density': float(latest_data.get('population_density', 100)),
                        'vaccination_rate': float(latest_data.get('vaccination_rate', 0.6)),
                        'mobility': float(np.random.uniform(0.4, 0.8))  # Synthetic mobility data
                    },
                    'historical_trend': self._generate_historical_trend(disease_data),
                    'recommendations': self._generate_recommendations(dis, risk_level, latest_data)
                }
                
                predictions.append(prediction)
            
            return predictions
            
        except Exception as e:
            logger.error(f"Error generating predictions: {str(e)}")
            return self._generate_mock_predictions(district, disease, timeframe_days)
    
    def _get_recent_district_data(self, district: str) -> pd.DataFrame:
        """Get recent data for a district (last 6 months)"""
        # This would typically query a database or recent CSV data
        # For now, we'll generate synthetic recent data
        return pd.DataFrame({
            'district': [district] * 10,
            'disease': ['Cholera', 'Dengue', 'Malaria', 'Typhoid', 'Diarrhea'] * 2,
            'temperature': np.random.uniform(20, 35, 10),
            'humidity': np.random.uniform(40, 90, 10),
            'rainfall': np.random.uniform(0, 500, 10),
            'water_quality': np.random.uniform(1, 10, 10),
            'population_density': np.random.uniform(50, 200, 10),
            'vaccination_rate': np.random.uniform(0.3, 0.9, 10),
            'cases': np.random.randint(1, 50, 10),
            'date': [datetime.now() - timedelta(days=i) for i in range(10)]
        })
    
    def _prepare_prediction_features(self, data: pd.Series) -> Optional[List[float]]:
        """Prepare features for prediction"""
        try:
            features = []
            for col in self.feature_columns:
                if col in data:
                    features.append(float(data[col]))
                else:
                    # Use default values if data is missing
                    defaults = {
                        'temperature': 25,
                        'humidity': 60,
                        'rainfall': 100,
                        'water_quality': 5,
                        'population_density': 100,
                        'vaccination_rate': 0.6
                    }
                    features.append(defaults.get(col, 0))
            
            return features
            
        except Exception as e:
            logger.error(f"Error preparing features: {str(e)}")
            return None
    
    def _generate_factors(self, data: pd.Series, risk_level: str) -> List[str]:
        """Generate contributing factors based on data"""
        factors = []
        
        if data.get('temperature', 25) > 30:
            factors.append('High temperature')
        if data.get('humidity', 60) > 80:
            factors.append('High humidity')
        if data.get('rainfall', 100) > 300:
            factors.append('Heavy rainfall')
        if data.get('water_quality', 5) < 4:
            factors.append('Poor water quality')
        if data.get('vaccination_rate', 0.6) < 0.5:
            factors.append('Low vaccination rate')
        if data.get('population_density', 100) > 150:
            factors.append('High population density')
        
        if not factors:
            factors = ['Seasonal patterns', 'Environmental conditions']
        
        return factors[:5]  # Limit to 5 factors
    
    def _generate_historical_trend(self, data: pd.DataFrame) -> Dict[str, List]:
        """Generate historical trend data"""
        if len(data) < 2:
            # Generate synthetic trend
            cases = [5, 8, 12, 15, 18, 20]
            dates = [(datetime.now() - timedelta(days=i*30)).isoformat() for i in range(6)]
        else:
            # Use actual data if available
            cases = data['cases'].tolist()[-6:] if 'cases' in data.columns else [5, 8, 12, 15, 18, 20]
            dates = data['date'].dt.strftime('%Y-%m-%d').tolist()[-6:] if 'date' in data.columns else [(datetime.now() - timedelta(days=i*30)).isoformat() for i in range(6)]
        
        return {
            'cases': cases,
            'dates': dates
        }
    
    def _generate_recommendations(self, disease: str, risk_level: str, data: pd.Series) -> List[str]:
        """Generate AI recommendations based on disease and risk level"""
        recommendations = []
        
        if risk_level == 'High':
            recommendations.extend([
                f'Deploy emergency response team for {disease}',
                'Increase surveillance and monitoring',
                'Implement immediate containment measures'
            ])
        elif risk_level == 'Medium':
            recommendations.extend([
                f'Increase {disease} awareness campaigns',
                'Monitor environmental conditions closely',
                'Prepare response resources'
            ])
        else:
            recommendations.extend([
                'Maintain current prevention measures',
                'Continue regular monitoring',
                'Prepare for seasonal variations'
            ])
        
        # Disease-specific recommendations
        if disease == 'Cholera':
            recommendations.append('Improve water treatment and sanitation')
        elif disease == 'Dengue':
            recommendations.append('Conduct vector control activities')
        elif disease == 'Malaria':
            recommendations.append('Distribute mosquito nets and repellents')
        elif disease == 'Typhoid':
            recommendations.append('Ensure food safety and hygiene')
        
        return recommendations[:4]  # Limit to 4 recommendations
    
    def _generate_mock_predictions(self, district: str, disease: Optional[str], timeframe_days: int) -> List[Dict[str, Any]]:
        """Generate mock predictions when models are not trained"""
        diseases = ['Cholera', 'Dengue', 'Malaria', 'Typhoid'] if disease is None else [disease]
        predictions = []
        
        for dis in diseases:
            risk_levels = ['Low', 'Medium', 'High']
            risk_level = np.random.choice(risk_levels, p=[0.4, 0.4, 0.2])
            
            prediction = {
                'district': district,
                'disease': dis,
                'risk_level': risk_level,
                'probability': np.random.uniform(0.3, 0.9),
                'confidence': np.random.uniform(0.6, 0.9),
                'timeframe': f"{timeframe_days} days",
                'factors': ['Environmental conditions', 'Seasonal patterns', 'Population density'],
                'environmental_data': {
                    'temperature': np.random.uniform(20, 35),
                    'humidity': np.random.uniform(40, 90),
                    'rainfall': np.random.uniform(0, 500),
                    'water_quality': np.random.uniform(1, 10)
                },
                'population_data': {
                    'density': np.random.uniform(50, 200),
                    'vaccination_rate': np.random.uniform(0.3, 0.9),
                    'mobility': np.random.uniform(0.4, 0.8)
                },
                'historical_trend': {
                    'cases': [5, 8, 12, 15, 18, 20],
                    'dates': [(datetime.now() - timedelta(days=i*30)).isoformat() for i in range(6)]
                },
                'recommendations': [
                    f'Monitor {dis} cases closely',
                    'Maintain prevention measures',
                    'Prepare response resources'
                ]
            }
            predictions.append(prediction)
        
        return predictions
    
    def is_trained(self) -> bool:
        """Check if models are trained"""
        return self.is_trained_flag
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about trained models"""
        return {
            'trained': self.is_trained_flag,
            'models': list(self.models.keys()) if self.models else [],
            'feature_columns': self.feature_columns,
            'scalers': list(self.scalers.keys()) if self.scalers else []
        }
