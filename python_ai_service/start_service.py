#!/usr/bin/env python3
"""
NE HealthNet AI Prediction Service Startup Script
"""

import uvicorn
import sys
import os
from pathlib import Path

# Add the current directory to Python path
sys.path.append(str(Path(__file__).parent))

def main():
    """Start the AI prediction service"""
    print("🚀 Starting NE HealthNet AI Prediction Service...")
    print("📊 Loading CSV data and training ML models...")
    print("🌐 Starting FastAPI server on http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/health")
    print("-" * 50)
    
    try:
        uvicorn.run(
            "app:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Shutting down AI Prediction Service...")
    except Exception as e:
        print(f"❌ Error starting service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
