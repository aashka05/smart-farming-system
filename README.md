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

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the AI service
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

## Fetch Realtime Data
### Linux / macOS (Cron)
1. Open crontab:
```bash
crontab -e
```
2. Add the job (example: run every 30 minutes):
```bash
*/30 * * * * /full/path/to/python /full/path/to/store_in_db.py
```
3. If using **vim**:
- Press `Esc`
- Type `:wq`
- Press `Enter`
4. Verify the cron job:
```bash
crontab -l
```
---
### Windows (Using Task Scheduler)
1. Open **Task Scheduler**.
2. Click **Create Basic Task**.
3. Give the task a name (e.g., `Run Python Script`).
4. Choose the trigger (**Daily / At startup / Repeat every X minutes**).
5. Select **Start a Program**.
**Program/script:**
```
C:\Python39\python.exe
```
**Add arguments:**
```
C:\path\to\script.py
```
6. Click **Finish** to create the scheduled task.
