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
