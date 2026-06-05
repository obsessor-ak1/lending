from huggingface_hub import hf_hub_download
import joblib
import pandas as pd

from api.data_models import CreditProfile
from api.settings import settings


CURRENT_MODEL  = None


def load_model():
    global CURRENT_MODEL
    try:
        model_path = hf_hub_download(
            repo_id=settings.hf_repo_name,
            filename=settings.hf_model_filename,
            token=settings.hf_token
        )
        print(f"Model file downloaded at path {model_path}")
        model_obj = joblib.load(model_path)
        if model_obj is None:
            raise ValueError("Failed to load model")
        CURRENT_MODEL = model_obj
        print("Model loaded successfully")
    except (ValueError, FileNotFoundError):
        print("Model not found")
        raise ValueError("Failed to load model")


# Load model during startup
load_model()

def predict(profile: CreditProfile):
    """Makes prediction from selected model."""
    model = CURRENT_MODEL
    assert model is not None and "Model could not loaded"
    profile_dict = profile.model_dump(mode="json")
    profile_df = pd.DataFrame([profile_dict])
    prediction = model.predict_proba(profile_df)
    return {"default_probability": prediction.tolist()[0]}
