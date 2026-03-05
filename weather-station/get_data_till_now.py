from datetime import datetime, timedelta
import psycopg2
import csv
import requests
from parse_json_w_arg import get_packet, get_logdata, get_rows

#start_time = "2026-03-03 18:00:00"
#end_time = "2026-03-04 01:00:00"
#test_st_time = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")
#test_end_time = datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S")

def check_logdata(logdata):
    flag = 1
    required_fields = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F14", "F15"]
    for field in required_fields:
        if field not in logdata[0]:
            flag = 0
            break
    if(len(logdata[0]["F1"]) != 3):
        flag = 0
    return flag
    

def collect_data(st_time: str, end_time: str):
#    with open('output.csv', mode='a', newline='') as file: # The newline='' argument is important for Python 3.
#        writer = csv.writer(file)
#        writer.writerows([['station_id', 'air_temp', 'air_humidity', 'soil_temp', 'soil_moisture', 'wind_speed', 'wind_dir', 'rain', 'battery', 'timestamp']])

    all_rows = []
    st_time = datetime.strptime(st_time, "%Y-%m-%d %H:%M:%S")
    end_time = datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S")
    while (st_time < end_time):
        try:
            user_date = st_time.strftime("%Y-%m-%d")
            t = st_time.strftime("%H:%M")
            print("------t", t)
            user_time = t.replace(":", "%3A")
            
            url = "http://59.95.100.34:45803/getlogdata?device_id=5&format=json&start_time=" + user_date + "+" + user_time + "&submit=Submit"
            print(url)
            response = requests.get(url)
            packet = get_packet(response.text)
            logdata = get_logdata(packet, t)
            print("len: ", len(logdata[0]["F1"]), " ", logdata[0]["F1"])
    #        print("logdata: ", logdata)
            if check_logdata(logdata):
                rows = get_rows(packet, logdata, t)
#                print(f"[debug] {st_time} → rows: {rows}")
                all_rows.extend(rows)
                """add in csv file code"""
#                with open('output.csv', mode='a', newline='') as file: # The newline='' argument is important for Python 3.
#                    writer = csv.writer(file)
#                    writer.writerows(rows)
        except Exception as e:
            print(f"[error] {st_time}: {e}")   # ← already there, will show exact error
            import traceback
            traceback.print_exc()
        st_time = st_time + timedelta(minutes=30)
    return all_rows

if(__name__ == "__main__"):
    collect_data("2026-03-02 00:00:00", "2026-03-05 21:00:00")
