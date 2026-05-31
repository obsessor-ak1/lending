import marimo

__generated_with = "0.23.4"
app = marimo.App(width="medium", auto_download=["html"])


@app.cell
def _():
    import marimo as mo

    return (mo,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    # Credit Risk Dataset
    In this notebook we will be inspecting the Credit Risk Dataset which will later use to perform risky loan classification
    """)
    return


@app.cell
def _():
    import matplotlib.pyplot as plt
    import pandas as pd
    import seaborn as sns

    return pd, sns


@app.cell
def _(sns):
    sns.set_theme()
    return


@app.cell
def _(pd):
    full_data = pd.read_csv("../data/credit_risk_dataset.csv")
    full_data.info()
    return (full_data,)


@app.cell
def _(full_data):
    data = full_data.sample(10000)
    return (data,)


@app.cell
def _(data):
    data
    return


@app.cell
def _(data):
    numeric_cols = data.select_dtypes(include=[int, float])
    return (numeric_cols,)


@app.cell
def _(numeric_cols):
    corr = numeric_cols.corr(method="pearson")
    return (corr,)


@app.cell
def _(corr, sns):
    sns.heatmap(corr, annot=True)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    Clearly no specific correlation found here, except for some columns:
    * loan_status: int_rate and loan_percent_income
    * loan_amnt: person_income (bovious)
    """)
    return


@app.cell
def _(numeric_cols, sns):
    sns.pairplot(data=numeric_cols, hue="loan_status")
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    #### Some Observations
    * People with low income are more likely to default in general
    * People with higher loan income percentage are also more likely to default across all other varying parameters.
    * Higher interest rate loans are also much more likely to end in default.
    """)
    return


@app.cell
def _(data, sns):
    sns.relplot(data=data, x="loan_amnt", y="loan_percent_income", col="person_home_ownership", hue="loan_status")
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    * Renters are much more likely to default given the loan income ratio is high than non renters.
    * People who own a house default usually when loan amount is small.
    * People who mortgage home are less likely to default, or can default regardless of loan income ratio or loan amount.
    """)
    return


@app.cell
def _(data, sns):
    sns.relplot(
        data=data,
        x="loan_percent_income",
        y="loan_int_rate",
        hue="loan_status",
        col="loan_intent", col_wrap=3
    )
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    * Debt consolidation and medical loans are much more likely to default when the interest rate and loan income percentage is higher.
    """)
    return


@app.cell
def _(data, sns):
    sns.histplot(
        data=data, x="loan_grade", hue="loan_status", multiple="stack"
    )
    return


@app.cell
def _(data):
    data.groupby(by="loan_grade").loan_status.mean()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    As expected the no. of defaulters increase as the loan grade decreases.
    """)
    return


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
