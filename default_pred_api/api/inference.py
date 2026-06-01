import joblib
import pandas as pd

from api.data_models import CreditProfile

CURRENT_MODEL  = "logistic_reg"

model_catalog = {
    "logistic_reg": {
        "path": r"../artifacts/logistic_regression.pkl",
        "model": None
    }
}

def load_model(name: str):
    try:
        model_path = model_catalog[name]["path"]
        model_obj = model_catalog[name]["model"]
        if model_obj is None:
            model_obj = joblib.load(model_path)
            model_catalog[name]["model"] = model_obj
    except FileNotFoundError:
        print("Model not found")
        raise ValueError("Failed to load model")


# Load model during startup
load_model(CURRENT_MODEL)

def predict(profile: CreditProfile):
    """Makes prediction from selected model."""
    model = model_catalog[CURRENT_MODEL]["model"]
    assert model is not None and "Model could not loaded"
    profile_dict = profile.model_dump(mode="json")
    profile_df = pd.DataFrame([profile_dict])
    prediction = model.predict_proba(profile_df)
    return {"default_probability": prediction.tolist()[0]}
