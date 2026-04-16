from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import joblib
import pandas as pd
import os
import pickle

app = FastAPI(title="DreamDrive AI Recommendation Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserPreferences(BaseModel):
    monthlySalary: int
    budget: int
    fuelType: str
    bodyType: Optional[str] = "Any"
    transmission: Optional[str] = "Any"
    seating: Optional[int] = None

class CarRecommendation(BaseModel):
    index: int
    brand: str
    model: str
    variant: str
    body_type: str
    fuel_type: str
    engine_cc: float
    transmission: str
    mileage: float
    price_min_inr: int
    price_max_inr: int
    segment: str
    seating: int
    launch_year: int
    country: str
    price_normalized: float
    score: float

MODEL_PATH = "car_recommendation_model.pkl"
DATASET_PATH = "../public/data/cleaned_car_dataset.csv"
ai_model: Any = None
car_dataset: Optional[pd.DataFrame] = None

@app.on_event("startup")
def load_all_assets() -> None:
    global ai_model, car_dataset
    if os.path.exists(MODEL_PATH):
        try:
            with open(MODEL_PATH, "rb") as f:
                ai_model = pickle.load(f)
        except Exception:
            try:
                ai_model = joblib.load(MODEL_PATH)
            except Exception:
                pass
        
    if os.path.exists(DATASET_PATH):
        try:
            df = pd.read_csv(DATASET_PATH)
            df = df.fillna({
                "brand": "Unknown", "model": "Unknown", "variant": "Unknown",
                "body_type": "Unknown", "fuel_type": "Unknown", "transmission": "Unknown",
                "segment": "", "country": ""
            })
            car_dataset = df.fillna(0)
        except Exception:
            pass

@app.get("/")
def read_root() -> Dict[str, str]:
    return {"status": "online", "message": "DreamDrive AI Engine is running."}

@app.post("/predict", response_model=List[CarRecommendation])
def predict_cars(prefs: UserPreferences) -> List[Dict[str, Any]]:
    if ai_model is None:
        raise HTTPException(status_code=503, detail="AI Model not loaded on server.")

    try:
        input_data = pd.DataFrame([{
            "monthly_salary": prefs.monthlySalary,
            "budget": prefs.budget,
            "fuel_type": prefs.fuelType,
            "transmission": prefs.transmission
        }])

        prediction = ai_model.predict(input_data)
        predicted_car_string: str = str(prediction[0]).lower()
        
        output_cars: List[Dict[str, Any]] = []
        if car_dataset is not None:
            matches: List[Dict[str, Any]] = []
            
            for idx, row in car_dataset.iterrows():
                brand_model: str = f"{row['brand']} {row['model']}".lower()
                if brand_model in predicted_car_string or predicted_car_string in brand_model:
                    rec: Dict[str, Any] = {
                        "index": int(row.get("Unnamed: 0", idx)),
                        "brand": str(row.get("brand")),
                        "model": str(row.get("model")),
                        "variant": str(row.get("variant", "")),
                        "body_type": str(row.get("body_type")),
                        "fuel_type": str(row.get("fuel_type")),
                        "engine_cc": float(row.get("engine_cc", 0)),
                        "transmission": str(row.get("transmission")),
                        "mileage": float(row.get("mileage_kmpl_or_range", 0) if pd.notna(row.get("mileage_kmpl_or_range")) else 0),
                        "price_min_inr": int(row.get("price_min_inr", 0)),
                        "price_max_inr": int(row.get("price_max_inr", 0)),
                        "segment": str(row.get("segment", "")),
                        "seating": int(row.get("seating", 4)),
                        "launch_year": int(row.get("launch_year", 2020)),
                        "country": str(row.get("country", "")),
                        "price_normalized": float(row.get("price", 0)),
                        "score": float(row.get("score", 0))
                    }
                    matches.append(rec)
            
            if matches:
                matches.sort(key=lambda x: float(x["score"]), reverse=True)
                output_cars = [matches[i] for i in range(min(12, len(matches)))]
        
        return output_cars

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))