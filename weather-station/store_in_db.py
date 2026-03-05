import psycopg2
from datetime import datetime, timedelta
from get_data_till_now import collect_data

def insert():
    conn = psycopg2.connect("postgresql://sfs_admin1:admin1@localhost:5432/sfs_db")
    cur  = conn.cursor()

    #static time - uncomment below to have the 3 day data
    #rows = collect_data("2026-03-02 00:00:00", "2026-03-05 21:00:00")

    #time for automation
    rows = collect_data((datetime.now() - timedelta(minutes=60)).strftime("%Y-%m-%d %H:%M:%S"), (datetime.now() - timedelta(minutes=30)).strftime("%Y-%m-%d %H:%M:%S"))

    for row in rows:
        #print(row)
        cur.execute("""
            INSERT INTO test_sensor_data (
                station_id,
                air_temperature_c,
                air_humidity_percent,
                soil_temperature_c,
                soil_moisture_percent,
                wind_speed_mps,
                wind_direction_deg,
                rainfall_mm,
                battery_percent,
                recorded_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, row)

    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    insert()
