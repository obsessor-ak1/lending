from typing import Annotated

from fastapi import FastAPI, Body, Depends, HTTPException
from fastapi.security import APIKeyHeader
from api.settings import settings

from api.data_models import CreditProfile
from api.inference import predict

app = FastAPI(title="Default Prediction API")

api_key_header = APIKeyHeader(name=settings.api_header, auto_error=True)

async def validate_key(key: Annotated[str, Depends(api_key_header)]):
    if key != settings.api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")


@app.post("/default_pred/default", dependencies=[Depends(validate_key)])
def default_rediction(
    profile: Annotated[CreditProfile, Body()]
) -> dict:
    """Returns the default probability as response."""
    prediction = predict(profile)
    return prediction

