import requests
import json

base_url = "http://localhost:8081/api"
auth_url = f"{base_url}/auth"

# Users to test (Make sure they are registered first using register_users.py or similar logic)
users = {
    "hod": {"username": "hod_user", "password": "password", "role": "HOD"},
    "mentor": {"username": "mentor_user", "password": "password", "role": "MENTOR"},
    "parent": {"username": "parent_user", "password": "password", "role": "PARENT"},
    "student": {"username": "student_user", "password": "password", "role": "STUDENT"},
    "admin": {"username": "admin", "password": "password", "role": "ADMIN"}
}

def login(username, password):
    try:
        response = requests.post(f"{auth_url}/login", json={"username": username, "password": password})
        if response.status_code == 200:
            print(f"Login success for {username}")
            return response.json()["token"]
        else:
            print(f"Login failed for {username}: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Error logging in {username}: {e}")
        return None

def test_endpoint(role, token, endpoint):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(f"{base_url}/{endpoint}", headers=headers)
        if response.status_code == 200:
            print(f"[PASS] {role} accessed {endpoint}")
            # print(json.dumps(response.json(), indent=2))
        else:
            print(f"[FAIL] {role} accessed {endpoint} - Status: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error accessing {endpoint} as {role}: {e}")

def register_if_needed():
    for key, user in users.items():
        try:
            reg_data = {
                "username": user["username"],
                "email": f"{user['username']}@test.com",
                "password": user["password"],
                "role": user["role"]
            }
            # Only required fields for signup based on SignupRequest logic
            res = requests.post(f"{auth_url}/register", json=reg_data)
            if res.status_code != 200:
                 print(f"Registration failed for {user['username']}: {res.text}")
        except Exception as e:
            print(f"Registration exception for {user['username']}: {e}")

print("Registering users...")
register_if_needed()

print("\nTesting Access...")
for role_name, creds in users.items():
    print(f"\n--- Testing {role_name.upper()} ---")
    token = login(creds["username"], creds["password"])
    if not token:
        continue

    if role_name == "hod":
        test_endpoint("HOD", token, "hod/dashboard")
    elif role_name == "mentor":
        test_endpoint("MENTOR", token, "mentor/dashboard")
    elif role_name == "parent":
        test_endpoint("PARENT", token, "parent/dashboard")
    elif role_name == "student":
        test_endpoint("STUDENT", token, "student-dashboard")
    elif role_name == "admin":
        pass # Admin check if needed
