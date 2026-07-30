import marimo

__generated_with = "0.23.14"
app = marimo.App(width="medium", auto_download=["html"])


@app.cell(hide_code=True)
def _():
    import marimo as mo

    return (mo,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    # Baseline
    In this notebook, we will perform preprocessing steps and create a simple baseline model for our loan default prediction task.
    """)
    return


@app.cell
def _():
    import joblib

    import matplotlib.pyplot as plt
    import pandas as pd
    import seaborn as sns
    from sklearn.model_selection import train_test_split
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import StandardScaler, OneHotEncoder
    from sklearn.impute import KNNImputer
    from sklearn.compose import ColumnTransformer
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import confusion_matrix, classification_report

    return (
        ColumnTransformer,
        KNNImputer,
        LogisticRegression,
        OneHotEncoder,
        Pipeline,
        StandardScaler,
        classification_report,
        confusion_matrix,
        joblib,
        pd,
        sns,
        train_test_split,
    )


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Loading and Preprocessing
    First we are going to load and preprocess the dataset.
    """)
    return


@app.cell
def _(pd):
    full_data = pd.read_csv("../data/credit_risk_dataset.csv")
    full_data.info()
    return (full_data,)


@app.cell
def _():
    features = [
        "person_age",
        "person_income",
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
        "person_age", "person_income", "person_emp_length", "loan_amnt", "loan_int_rate",
        "loan_percent_income", "cb_person_cred_hist_length"
    ]
    target = "loan_status"
    return features, numeric_features, target


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    The column `loan_grade` is explicitly excluded because that is not known in advance for a given loan application.
    """)
    return


@app.cell
def _(full_data):
    full_data["cb_person_default_on_file"] = full_data["cb_person_default_on_file"] == 'Y'
    return


@app.cell
def _(features, full_data, target):
    X, y = full_data[features], full_data[target]
    return X, y


@app.cell
def _(full_data, sns):
    sns.histplot(data=full_data, x="cb_person_default_on_file", hue="loan_status", bins=2)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    #### Train/Test Split
    First we will perform a train test split with 80% data for training.
    """)
    return


@app.cell
def _(X, train_test_split, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, train_size=0.8, shuffle=True
    )
    return X_test, X_train, y_test, y_train


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    #### Missing Values
    Clearly the columns `person_emp_length` and `loan_int_rate` both have missing values, we will fill them using `KNNImputer`
    """)
    return


@app.cell
def _(KNNImputer, X_train, numeric_features):
    imputer = KNNImputer(n_neighbors=8)
    imputer.fit_transform(X_train[numeric_features]).shape
    return (imputer,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    #### Categorical Features
    On the categorical features we are using we must perform one hot encoding.
    """)
    return


@app.cell
def _(OneHotEncoder):
    cat_encoder = OneHotEncoder(handle_unknown="ignore")
    return (cat_encoder,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    #### Scaling
    Since multiple features are on different scale (numerical ones), we must perform Standard Scaling to put them on same scale with 0 mean and unit variance.
    """)
    return


@app.cell
def _(StandardScaler):
    scaler = StandardScaler()
    return (scaler,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    #### Combining
    Now, we shall combine all these transformations in a `ColumnTransformer`
    """)
    return


@app.cell
def _(
    ColumnTransformer,
    Pipeline,
    cat_encoder,
    imputer,
    numeric_features,
    scaler,
):
    numeric_transformation = Pipeline([
        ("missing_values", imputer),
        ("standardization", scaler)
    ])
    col_transform = ColumnTransformer([
        ("num_transforms", numeric_transformation, numeric_features),
        ("cat_encoding", cat_encoder, ["person_home_ownership", "loan_intent"])
    ])
    return (col_transform,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Training the Model
    Now, we will train our baseline Logistic Regression model based on this.
    """)
    return


@app.cell
def _(LogisticRegression, Pipeline, col_transform):
    model = LogisticRegression(n_jobs=2)
    model_pipeline = Pipeline([
        ("preprocessing", col_transform),
        ("model", model)
    ])
    return (model_pipeline,)


@app.cell
def _(X_train, model_pipeline, y_train):
    model_pipeline.fit(X_train, y_train)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ### Prediction
    Now, we are going to make prediction on the test set.
    """)
    return


@app.cell
def _(X_test, model_pipeline):
    y_pred = model_pipeline.predict(X_test)
    return (y_pred,)


@app.cell
def _(confusion_matrix, y_pred, y_test):
    conf_mat = confusion_matrix(y_test, y_pred, normalize="all")
    return (conf_mat,)


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
    Since, here we are having class imbalance the performance of default is a bit poor.
    """)
    return


@app.cell
def _(joblib, model_pipeline):
    joblib.dump(model_pipeline, "../artifacts/logistic_regression.pkl")
    return


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
