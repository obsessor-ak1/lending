import marimo

__generated_with = "0.23.15"
app = marimo.App(width="medium", auto_download=["html"])


@app.cell
def _():
    import marimo as mo

    return (mo,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    # Random Forests
    In this notebook, we are going to improve our previous baseline by using a more powerful approach modelling technique i.e. Random Forests.
    """)
    return


@app.cell
def _():
    import matplotlib.pyplot as plt
    import numpy as np
    import pandas as pd
    import seaborn as sns

    from sklearn.compose import ColumnTransformer
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.impute import KNNImputer
    from sklearn.metrics import classification_report, confusion_matrix
    from sklearn.model_selection import train_test_split, cross_validate
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import OneHotEncoder, StandardScaler, PolynomialFeatures

    sns.set_theme()
    return (
        ColumnTransformer,
        KNNImputer,
        OneHotEncoder,
        Pipeline,
        PolynomialFeatures,
        RandomForestClassifier,
        StandardScaler,
        classification_report,
        confusion_matrix,
        cross_validate,
        np,
        pd,
        sns,
        train_test_split,
    )


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Loading and Preprocessing Datasets
    Now, we will load the dataset and apply some basic preprocessing.
    """)
    return


@app.cell
def _(np, pd):
    full_data = pd.read_csv("../data/credit_risk_dataset.csv")
    # Basic transforms
    full_data["person_income"] = np.log(full_data["person_income"])
    full_data.rename(columns={"person_income": "log_person_income"}, inplace=True)
    full_data["cb_person_default_on_file"] = full_data["cb_person_default_on_file"] == 'Y'
    return (full_data,)


@app.function
def transform_features(data):
    data["home_median_log_income"] = data.groupby("person_home_ownership")["log_person_income"].transform("median")
    data["home_mean_loan_amnt"] = data.groupby("person_home_ownership")["loan_amnt"].transform("mean")
    data["intent_median_log_income"] = data.groupby("loan_intent")["log_person_income"].transform("median")
    data["intent_mean_loan_amnt"] = data.groupby("loan_intent")["loan_amnt"].transform("mean")


@app.cell
def _(full_data):
    data = transform_features(full_data)
    return


@app.cell
def _(full_data, train_test_split):
    features = [
        "person_age",
        "log_person_income",
        "person_home_ownership",
        "person_emp_length",
        "loan_intent",
        "loan_amnt",
        "loan_int_rate",
        "loan_percent_income",
        "cb_person_default_on_file",
        "cb_person_cred_hist_length"
    ]
    numeric_features = [
        "person_age", "log_person_income", "person_emp_length", "loan_amnt", "loan_int_rate",
        "loan_percent_income", "cb_person_cred_hist_length"
    ]
    target = "loan_status"
    X, y = full_data[features], full_data[target]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, train_size=0.8, shuffle=True
    )
    return X_test, X_train, numeric_features, y_test, y_train


@app.cell
def _(
    ColumnTransformer,
    KNNImputer,
    OneHotEncoder,
    Pipeline,
    PolynomialFeatures,
    StandardScaler,
    numeric_features,
):
    imputer = KNNImputer(n_neighbors=8)
    cat_encoder = OneHotEncoder(handle_unknown="ignore")
    scaler = StandardScaler()

    numeric_transformation = Pipeline([
        ("missing_values", imputer),
        ("standardization", scaler),
        ("polynomial_features", PolynomialFeatures(degree=2, interaction_only=True, include_bias=False))
    ])
    col_transform = ColumnTransformer([
        ("num_transforms", numeric_transformation, numeric_features),
        ("cat_encoding", cat_encoder, ["person_home_ownership", "loan_intent"])
    ])
    return (col_transform,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Training Random Forests Classifier
    Now, we will train Random Forests Classifier on our data set. It is an ensemble tree based model which uses bootstrap sampling and random feature sampling to achieve great performance gains over a single decision tree.
    """)
    return


@app.cell
def _(Pipeline, RandomForestClassifier, col_transform):
    model = RandomForestClassifier(
        n_estimators=1000, min_samples_leaf=10, n_jobs=4
    )
    model_pipeline = Pipeline([
        ("preprocessing", col_transform),
        ("model", model)
    ])
    return (model_pipeline,)


@app.cell
def _(X_train, model_pipeline, y_train):
    model_pipeline.fit(X_train, y_train)
    return


@app.cell
def _(X_test, confusion_matrix, model_pipeline, y_test):
    y_pred = model_pipeline.predict(X_test)
    conf_mat = confusion_matrix(y_test, y_pred, normalize="all")
    return conf_mat, y_pred


@app.cell
def _(conf_mat, sns):
    sns.heatmap(conf_mat, annot=True)
    return


@app.cell
def _(classification_report, y_pred, y_test):
    report = classification_report(y_test, y_pred, labels=[0, 1])
    print(report)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Cross Validation
    To get a robust estimator, we will perform k-Fold  Cross Validation. We will use the k = 5. Then we will use the best estimator (estimator with best validation score) for final testing.
    """)
    return


@app.cell
def _(X_train, cross_validate, model_pipeline, y_train):
    cv_results = cross_validate(
        model_pipeline,
        X_train,
        y_train,
        scoring="f1",
        cv=5,
        n_jobs=4,
        return_estimator=True
    )
    return (cv_results,)


@app.cell
def _(cv_results):
    best_estimator_id = cv_results["test_score"].argmax()
    best_estimator = cv_results["estimator"][best_estimator_id]
    return (best_estimator,)


@app.cell
def _(X_test, best_estimator, confusion_matrix, y_pred, y_test):
    y_pred_cv = best_estimator.predict(X_test)
    conf_mat_cv = confusion_matrix(y_test, y_pred, normalize="all")
    return


@app.cell
def _(conf_mat, sns):
    sns.heatmap(conf_mat, annot=True)
    return


@app.cell
def _(classification_report, y_pred, y_test):
    report_cv = classification_report(y_test, y_pred, labels=[0, 1])
    print(report_cv)
    return


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
