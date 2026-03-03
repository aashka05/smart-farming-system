# smart-farming-system
## Installation Steps

### 1. Download the project
- Go to the GitHub repository
- Click **Code**
- Click **Download ZIP**
- Extract the ZIP file on your computer
### OR
### 1. Clone the repository
```bash
git clone https://github.com/aashka05/smart-farming-system
```

### 2. Open terminal inside the project
Navigate to:

```bash
cd smart-farming-system/client
```

### 3. Install dependencies
```bash
npm install
```
### 4. Start local server
```bash
npm run dev
```
## Use dummy data
```bash
psql -U sfs_admin1 -d postgres -c "CREATE DATABASE sfs_db OWNER sfs_admin1;"
psql -U sfs_admin1 -d sfs_db -f dummy_data.sql
```

## AI Service Setup

The AI chatbot and crop recommendation features are powered by a separate Python backend service. 

To run the AI service locally:

### 1. Open terminal and navigate to the project
```bash
cd smart-farming-system/ai-service
```

### 2. Set up a virtual environment (optional but recommended)
```bash
python -m venv venv
```
Activate the virtual environment:
- **Windows**: `venv\Scripts\activate`
- **macOS/Linux**: `source venv/bin/activate`

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Start the AI service
```bash
uvicorn main:app --reload
```
The AI service should now be running (usually on `http://127.0.0.1:8000`). 
create a .env file and make sure following three environment variables in .env are present ...  
OLLAMA_API_KEY = 
(GET IT FROM https://ollama.com/settings/keys) 
SERP_API = 
(GET IT FROM https://serpapi.com/dashboard) 
MONGO_URI = 
(GET IT FROM https://www.mongodb.com/) 

