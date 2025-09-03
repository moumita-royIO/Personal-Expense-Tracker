from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, SelectField, SubmitField
from wtforms.validators import DataRequired

class TransactionForm(FlaskForm):
    month = StringField("Month", validators=[DataRequired()])
    description = StringField("Description", validators=[DataRequired()])
    amount = DecimalField("Amount", validators=[DataRequired()])
    type = SelectField("Type", choices=[("expense", "Expense"), ("income", "Income")], validators=[DataRequired()])
    submit = SubmitField("Add Transaction")
