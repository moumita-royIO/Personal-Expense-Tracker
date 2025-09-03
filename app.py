from flask import Flask, render_template, redirect, url_for, request, jsonify
from flask_pymongo import PyMongo
from form import TransactionForm
from dotenv import load_dotenv
from bson.objectid import ObjectId
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "supersecretkey-change-in-production")

# MongoDB Configuration - supports both local and cloud databases
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    # Fallback to individual environment variables
    username = os.getenv("MONGO_USER")
    password = os.getenv("MONGO_PASS")
    host = os.getenv("MONGO_HOST", "localhost:27017")
    database = os.getenv("MONGO_DB")
    app_name = host.split(".")[0]
    
    if username and password:
        # For MongoDB Atlas or authenticated connections
        if "mongodb.net" in host:
            # MongoDB Atlas format
            mongo_uri = f"mongodb+srv://{username}:{password}@{host}/{database}?retryWrites=true&w=majority&appName={app_name}"
        else:
            # Local MongoDB with authentication
            mongo_uri = f"mongodb://{username}:{password}@{host}/{database}"
    else:
        # Local MongoDB without authentication
        mongo_uri = f"mongodb://{host}/{database}"

app.config["MONGO_URI"] = mongo_uri

mongo = PyMongo(app)

@app.route("/", methods=["GET", "POST"])
def index():
    form = TransactionForm()
    if form.validate_on_submit():
        mongo.db.transactions.insert_one({
            "month": form.month.data,
            "description": form.description.data,
            "amount": float(form.amount.data),
            "type": form.type.data
        })
        return redirect(url_for("index"))
    
    # Fetch transactions to display
    transactions = list(mongo.db.transactions.find())
    return render_template("index.html", form=form, transactions=transactions)

@app.route("/delete/<transaction_id>", methods=["POST"])
def delete_transaction(transaction_id):
    try:
        # Delete the transaction from MongoDB
        result = mongo.db.transactions.delete_one({"_id": ObjectId(transaction_id)})
        if result.deleted_count == 1:
            return jsonify({"success": True, "message": "Transaction deleted successfully"})
        else:
            return jsonify({"success": False, "message": "Transaction not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": "Error deleting transaction"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
