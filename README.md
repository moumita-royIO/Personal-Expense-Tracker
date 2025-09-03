# Flask Expense Tracker with Jinja Template (Dockerized)

A simple Flask-based Expense Tracker web application that allows users to manage their monthly expenses.
This project is containerized with Docker and can be deployed on AWS App Runner, ECS, or any Docker-compatible platform.

## Techstack 
- Backend: Python (Flask)
- Frontend: HTML, CSS (Jinja templates)
- Database: MongoDB Atlas
- Deployment: Docker, AWS (App Runner, ECS, CloudFront)
- Data visualization: MongoDB charts for monthly expense reports



## Setup Instructions to test locally

1> Clone the repo
```bash
git clone https://github.com/moumita-royIO/personal-expanse-tracker.git
cd personal-expanse-tracker
```

2> Create a virtual environment (optional but recommended). Running pip install becomes easier!
```bash
python3 -m venv venv
source venv/bin/activate
```

3> Install dependencies
```bash
pip install -r requirements.txt
```

4> Configure environment variables
```bash
Create a .env file (use the `.env.example` file as a reference):
```

5> Run the app
```bash
python app.py
```

Visit: http://localhost:5000

## 🐳 Run with Docker

1> Build the image
```bash
docker build -t expense-tracker .
```

2> Run the container
```bash
docker run -d -p 5000:5000 --env-file .env expense-tracker
```

## ☁️ Deployment Options are multiple

* AWS App Runner → Deploy Docker image directly

* AWS ECS/Fargate → Scalable container deployment

## Future Enhancements that can be supported:
- Adding user authentication (login/register)



