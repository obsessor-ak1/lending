const HOME_OWNERSHIP_MAP = {
  0: "rent",
  1: "own",
  2: "mortgage",
  3: "other",
};

const LOAN_INTENT_MAP = {
  VENTURE: "business",
  EDUCATION: "education",
  MEDICAL: "medical",
  PERSONAL: "personal",
  DEBTCONSOLIDATION: "debtconsolidation",
  HOMEIMPROVEMENT: "homeimprovement",
  OTHER: "other",
};

export function buildDefaultPredictionPayload(application) {
  const profile = application?.borrower?.profile;

  if (!profile) {
    return null;
  }

  const personIncome = Number(profile.income);
  const loanAmount = Number(application.amount);
  const interestRate = Number(application.interest_rate);

  if (
    !Number.isFinite(personIncome) ||
    !Number.isFinite(loanAmount) ||
    !Number.isFinite(interestRate)
  ) {
    return null;
  }

  return {
    person_age: Number(profile.age),
    person_income: personIncome,
    person_home_ownership: HOME_OWNERSHIP_MAP[profile.home_ownership] || "other",
    person_emp_length: Number(profile.employment_duration),
    loan_intent: LOAN_INTENT_MAP[application.purpose] || "other",
    loan_amnt: loanAmount,
    loan_int_rate: interestRate,
    cb_person_default_on_file: Boolean(profile.prev_default),
    cb_person_cred_hist_length: Number(profile.cred_hist_length),
  };
}

export function normalizeDefaultProbability(value) {
  if (Array.isArray(value)) {
    const defaultProbability = Number(value[value.length - 1]);
    return Number.isFinite(defaultProbability) ? defaultProbability : null;
  }

  const probability = Number(value);
  return Number.isFinite(probability) ? probability : null;
}

export function getLoanQualityAssessment(defaultProbability) {
  if (!Number.isFinite(defaultProbability)) {
    return null;
  }

  if (defaultProbability < 0.1) {
    return {
      label: "Excellent",
      tone: "emerald",
      description: "Very low estimated default risk.",
    };
  }

  if (defaultProbability < 0.25) {
    return {
      label: "Good",
      tone: "green",
      description: "Low default risk with a healthy profile.",
    };
  }

  if (defaultProbability < 0.45) {
    return {
      label: "Moderate",
      tone: "amber",
      description: "Middle-of-the-road risk. Review the request carefully.",
    };
  }

  if (defaultProbability < 0.65) {
    return {
      label: "Risky",
      tone: "orange",
      description: "Elevated default risk. Additional scrutiny is recommended.",
    };
  }

  return {
    label: "High Risk",
    tone: "rose",
    description: "Very high default risk for this loan profile.",
  };
}

export function formatProbabilityPercent(defaultProbability) {
  if (!Number.isFinite(defaultProbability)) {
    return null;
  }

  return `${(defaultProbability * 100).toFixed(1)}%`;
}