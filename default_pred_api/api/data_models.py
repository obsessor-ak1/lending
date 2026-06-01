from enum import Enum

from pydantic import BaseModel, computed_field


class HomeOwnerShip(Enum):
    MORTGAGE = "mortgage"
    OWN = "own"
    RENT = "rent"
    OTHER = "other"

class LoanIntent(Enum):
    EDUCATION = "education"
    MEDICAL = "medical"
    PERSONAL = "personal"
    DEBTCONSOLIDATION = "debtconsolidation"
    HOMEIMPROVEMENT = "homeimprovement"
    BUSINESS = "business"
    OTHER = "other"


class CreditProfile(BaseModel):
    person_age: int
    person_income: float
    person_home_ownership: HomeOwnerShip
    person_emp_length: int
    loan_intent: LoanIntent
    loan_amnt: float
    loan_int_rate: float

    @computed_field
    @property
    def loan_percent_income(self) -> float:
        return self.loan_amnt / self.person_income

    cb_person_default_on_file: bool
    cb_person_cred_hist_length: int


