// AI Prediction Service - Integration with Python ML Backend
const PYTHON_AI_SERVICE_URL = 'http://localhost:8000';

export interface Prediction {
  id: string;
  district: string;
  disease: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  probability: number;
  confidence: number;
  timeframe: string;
  factors: string[];
  environmentalData: {
    temperature: number;
    humidity: number;
    rainfall: number;
    waterQuality: number;
  };
  populationData: {
    density: number;
    vaccinationRate: number;
    mobility: number;
  };
  historicalTrend: {
    cases: number[];
    dates: string[];
  };
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
  modelVersion: string;
}

export interface PredictionRequest {
  district: string;
  disease?: string;
  timeframe_days?: number;
  include_environmental?: boolean;
  include_population?: boolean;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  predictions_updated: number;
  timestamp: string;
}

export interface ForecastResponse {
  district: string;
  forecast_period: string;
  generated_at: string;
  disease_forecasts: Record<string, any>;
  summary: {
    total_predicted_cases: number;
    highest_risk_disease: string;
    average_confidence: number;
    diseases_forecasted: number;
    risk_assessment: string;
  };
}

class AIPredictionService {
  private baseUrl: string;

  constructor(baseUrl: string = PYTHON_AI_SERVICE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Check if the Python AI service is running
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('AI service health check failed:', error);
      return false;
    }
  }

  /**
   * Get information about loaded ML models
   */
  async getModelInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/models/info`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get model info:', error);
      throw error;
    }
  }

  /**
   * Generate AI predictions for disease outbreaks
   */
  async generatePredictions(request: PredictionRequest): Promise<Prediction[]> {
    try {
      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          district: request.district,
          disease: request.disease || null,
          timeframe_days: request.timeframe_days || 30,
          include_environmental: request.include_environmental !== false,
          include_population: request.include_population !== false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to generate predictions:', error);
      throw error;
    }
  }

  /**
   * Get predictions for all districts
   */
  async getAllPredictions(): Promise<Prediction[]> {
    try {
      const response = await fetch(`${this.baseUrl}/predictions/all`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get all predictions:', error);
      throw error;
    }
  }

  /**
   * Refresh predictions with latest data
   */
  async refreshPredictions(): Promise<RefreshResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to refresh predictions:', error);
      throw error;
    }
  }

  /**
   * Get detailed forecast for a specific district
   */
  async getForecast(district: string, days: number = 30): Promise<ForecastResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/forecast/${encodeURIComponent(district)}?days=${days}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get forecast:', error);
      throw error;
    }
  }

  /**
   * Generate predictions for multiple districts
   */
  async generateMultiDistrictPredictions(districts: string[]): Promise<Prediction[]> {
    try {
      const allPredictions: Prediction[] = [];
      
      // Generate predictions for each district
      for (const district of districts) {
        try {
          const predictions = await this.generatePredictions({
            district,
            timeframe_days: 30,
            include_environmental: true,
            include_population: true,
          });
          allPredictions.push(...predictions);
        } catch (error) {
          console.error(`Failed to generate predictions for ${district}:`, error);
          // Continue with other districts
        }
      }

      return allPredictions;
    } catch (error) {
      console.error('Failed to generate multi-district predictions:', error);
      throw error;
    }
  }

  /**
   * Get predictions with fallback to mock data
   */
  async getPredictionsWithFallback(districts: string[] = ['Senapati', 'Churachandpur']): Promise<Prediction[]> {
    try {
      // First try to get real predictions
      const isHealthy = await this.checkHealth();
      
      if (isHealthy) {
        return await this.generateMultiDistrictPredictions(districts);
      } else {
        console.warn('AI service not available, using mock data');
        return this.getMockPredictions(districts);
      }
    } catch (error) {
      console.error('Failed to get predictions, using mock data:', error);
      return this.getMockPredictions(districts);
    }
  }

  /**
   * Mock predictions for when AI service is not available
   */
  private getMockPredictions(districts: string[]): Prediction[] {
    const diseases = ['Cholera', 'Dengue', 'Malaria', 'Typhoid'];
    const riskLevels: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];
    
    const mockPredictions: Prediction[] = [];
    
    districts.forEach((district, districtIndex) => {
      diseases.forEach((disease, diseaseIndex) => {
        const riskLevel = riskLevels[(districtIndex + diseaseIndex) % 3];
        
        mockPredictions.push({
          id: `mock-pred-${districtIndex}-${diseaseIndex}`,
          district,
          disease,
          riskLevel,
          probability: Math.random() * 0.6 + 0.3, // 0.3 to 0.9
          confidence: Math.random() * 0.3 + 0.6, // 0.6 to 0.9
          timeframe: '30 days',
          factors: [
            'Environmental conditions',
            'Seasonal patterns',
            'Population density',
            'Water quality issues'
          ],
          environmentalData: {
            temperature: Math.random() * 15 + 20, // 20 to 35
            humidity: Math.random() * 50 + 40, // 40 to 90
            rainfall: Math.random() * 500, // 0 to 500
            waterQuality: Math.random() * 9 + 1 // 1 to 10
          },
          populationData: {
            density: Math.random() * 150 + 50, // 50 to 200
            vaccinationRate: Math.random() * 0.6 + 0.3, // 0.3 to 0.9
            mobility: Math.random() * 0.4 + 0.4 // 0.4 to 0.8
          },
          historicalTrend: {
            cases: Array.from({ length: 90 }, (_, i) => {
              // Generate realistic historical data with some trend
              const baseValue = 10 + Math.sin(i * 0.1) * 5; // Seasonal variation
              const randomVariation = (Math.random() - 0.5) * 8; // Random noise
              return Math.max(0, Math.floor(baseValue + randomVariation));
            }),
            dates: Array.from({ length: 90 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (89 - i)); // Last 90 days
              return date.toISOString().split('T')[0];
            })
          },
          recommendations: [
            `Monitor ${disease} cases closely`,
            'Maintain prevention measures',
            'Prepare response resources',
            'Increase public awareness'
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          modelVersion: 'mock-v1.0'
        });
      });
    });
    
    return mockPredictions;
  }
}

// Export singleton instance
export const aiPredictionService = new AIPredictionService();

// Export class for testing
export { AIPredictionService };
