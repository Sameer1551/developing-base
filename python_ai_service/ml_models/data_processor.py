import pandas as pd
import numpy as np
from pathlib import Path
import logging
from typing import Dict, List, Any
import os

logger = logging.getLogger(__name__)

class DataProcessor:
    def __init__(self):
        self.csv_data = None
        self.processed_data = None
        self.csv_files_info = {}
        
    def load_csv_data(self) -> pd.DataFrame:
        """Load and combine all CSV files"""
        try:
            # Get the path to CSV files (assuming they're in the parent directory)
            csv_dir = Path(__file__).parent.parent.parent / "New folder"
            
            if not csv_dir.exists():
                logger.warning(f"CSV directory not found: {csv_dir}")
                return self._generate_sample_data()
            
            all_dataframes = []
            
            # Load health data CSV files
            health_files = [
                "hyper_realistic_health_data.csv",
                "monsoon_jun-jul2024.csv", 
                "postmonsoon_aug-oct2024.csv",
                "pre_monsoon_health_data_1000.csv",
                "winter_health_data_1000.csv",
                "winter_health_data_Nov-Jan.csv"
            ]
            
            for file_name in health_files:
                file_path = csv_dir / file_name
                if file_path.exists():
                    try:
                        df = pd.read_csv(file_path)
                        df['source_file'] = file_name
                        all_dataframes.append(df)
                        self.csv_files_info[file_name] = len(df)
                        logger.info(f"Loaded {file_name}: {len(df)} records")
                    except Exception as e:
                        logger.error(f"Error loading {file_name}: {str(e)}")
            
            # Load environmental data
            env_files = [
                "rainfall_health_data_2024-2025.csv",
                "water_quality_report_2024-2025.csv"
            ]
            
            for file_name in env_files:
                file_path = csv_dir / file_name
                if file_path.exists():
                    try:
                        df = pd.read_csv(file_path)
                        df['source_file'] = file_name
                        all_dataframes.append(df)
                        self.csv_files_info[file_name] = len(df)
                        logger.info(f"Loaded {file_name}: {len(df)} records")
                    except Exception as e:
                        logger.error(f"Error loading {file_name}: {str(e)}")
            
            if not all_dataframes:
                logger.warning("No CSV files found, generating sample data")
                return self._generate_sample_data()
            
            # Combine all dataframes
            self.csv_data = pd.concat(all_dataframes, ignore_index=True)
            
            # Clean and standardize data
            self.csv_data = self._clean_data(self.csv_data)
            
            logger.info(f"Total records loaded: {len(self.csv_data)}")
            return self.csv_data
            
        except Exception as e:
            logger.error(f"Error loading CSV data: {str(e)}")
            return self._generate_sample_data()
    
    def _clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and standardize the data"""
        try:
            # Standardize column names
            column_mapping = {
                'District': 'district',
                'Disease': 'disease', 
                'Cases': 'cases',
                'Temperature': 'temperature',
                'Humidity': 'humidity',
                'Rainfall': 'rainfall',
                'Water Quality': 'water_quality',
                'Population Density': 'population_density',
                'Vaccination Rate': 'vaccination_rate',
                'Date': 'date',
                'Risk Level': 'risk_level'
            }
            
            df = df.rename(columns=column_mapping)
            
            # Convert date columns
            date_columns = ['date', 'Date', 'created_at', 'timestamp']
            for col in date_columns:
                if col in df.columns:
                    try:
                        df[col] = pd.to_datetime(df[col], errors='coerce')
                    except:
                        pass
            
            # Fill missing values
            numeric_columns = ['cases', 'temperature', 'humidity', 'rainfall', 'water_quality', 'population_density', 'vaccination_rate']
            for col in numeric_columns:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce')
                    df[col] = df[col].fillna(df[col].median())
            
            # Standardize district names
            if 'district' in df.columns:
                df['district'] = df['district'].str.title().str.strip()
            
            # Standardize disease names
            if 'disease' in df.columns:
                df['disease'] = df['disease'].str.title().str.strip()
            
            return df
            
        except Exception as e:
            logger.error(f"Error cleaning data: {str(e)}")
            return df
    
    def _generate_sample_data(self) -> pd.DataFrame:
        """Generate sample data if CSV files are not available"""
        logger.info("Generating sample data...")
        
        districts = ["Imphal East", "Imphal West", "Bishnupur", "Senapati", "Churachandpur"]
        diseases = ["Cholera", "Dengue", "Malaria", "Typhoid", "Diarrhea"]
        
        sample_data = []
        for i in range(1000):
            sample_data.append({
                'district': np.random.choice(districts),
                'disease': np.random.choice(diseases),
                'cases': np.random.randint(1, 100),
                'temperature': np.random.uniform(20, 35),
                'humidity': np.random.uniform(40, 90),
                'rainfall': np.random.uniform(0, 500),
                'water_quality': np.random.uniform(1, 10),
                'population_density': np.random.uniform(50, 200),
                'vaccination_rate': np.random.uniform(0.3, 0.9),
                'date': pd.Timestamp.now() - pd.Timedelta(days=np.random.randint(0, 365)),
                'source_file': 'sample_data'
            })
        
        return pd.DataFrame(sample_data)
    
    def get_district_data(self, district: str) -> pd.DataFrame:
        """Get data for a specific district"""
        if self.csv_data is None:
            self.load_csv_data()
        
        return self.csv_data[self.csv_data['district'] == district].copy()
    
    def get_disease_data(self, disease: str) -> pd.DataFrame:
        """Get data for a specific disease"""
        if self.csv_data is None:
            self.load_csv_data()
        
        return self.csv_data[self.csv_data['disease'] == disease].copy()
    
    def get_environmental_data(self, district: str = None) -> pd.DataFrame:
        """Get environmental data"""
        if self.csv_data is None:
            self.load_csv_data()
        
        env_data = self.csv_data[['district', 'temperature', 'humidity', 'rainfall', 'water_quality', 'date']].copy()
        
        if district:
            env_data = env_data[env_data['district'] == district]
        
        return env_data.dropna()
    
    def get_population_data(self, district: str = None) -> pd.DataFrame:
        """Get population data"""
        if self.csv_data is None:
            self.load_csv_data()
        
        pop_data = self.csv_data[['district', 'population_density', 'vaccination_rate', 'date']].copy()
        
        if district:
            pop_data = pop_data[pop_data['district'] == district]
        
        return pop_data.dropna()
    
    def get_csv_info(self) -> Dict[str, int]:
        """Get information about loaded CSV files"""
        return self.csv_files_info.copy()
    
    def get_data_summary(self) -> Dict[str, Any]:
        """Get summary statistics of the data"""
        if self.csv_data is None:
            self.load_csv_data()
        
        return {
            'total_records': len(self.csv_data),
            'districts': self.csv_data['district'].nunique() if 'district' in self.csv_data.columns else 0,
            'diseases': self.csv_data['disease'].nunique() if 'disease' in self.csv_data.columns else 0,
            'date_range': {
                'start': self.csv_data['date'].min().isoformat() if 'date' in self.csv_data.columns else None,
                'end': self.csv_data['date'].max().isoformat() if 'date' in self.csv_data.columns else None
            },
            'csv_files': self.csv_files_info
        }
