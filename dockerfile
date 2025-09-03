# Use Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY app.py .
COPY form.py .
COPY templates/ ./templates
COPY static/ ./static

# Expose Flask port
EXPOSE 5000

# Run Flask
CMD ["python", "app.py"]
