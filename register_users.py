import requests
import json

base_url = "http://localhost:8080/api/auth/register"

users = [
    {
        "username": "student",
        "email": "student@test.com",
        "password": "password",
        "role": "STUDENT"
    },
    {
        "username": "admin",
        "email": "admin@test.com",
        "password": "password",
        "role": "ADMIN"
    }
]

for user in users:
    try:
        response = requests.post(base_url, json=user)
        print(f"Registering {user['username']}: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Failed to register {user['username']}: {e}")
