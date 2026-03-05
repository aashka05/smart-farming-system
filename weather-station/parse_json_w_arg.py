import requests
import ast
import math
import sys
from datetime import datetime, timedelta

iter_val = 0

def get_packet(a_txt):
    return ast.literal_eval(a_txt)
def get_logdata(packet, t):
    if(t == "00:00"):
        return ast.literal_eval(packet[1]["logdata"])
    else:
        return ast.literal_eval(packet[0]["logdata"])

def ret_station_id():
    return [100,100,100]

"""timestamp"""
def calc_timestamp(packet, logdata, t):
    timestamp_list = []
    if(t == "00:00"):
        t_messy = packet[1]["receivedDateTimeFromSender"]
    else:
        t_messy = packet[0]["receivedDateTimeFromSender"]
    print("t_messy", t_messy)
    timestamp = t_messy[0:10] + " " + t_messy[11:19]
    print("timestamp", timestamp)
    dt = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
    for i in range(3):
        m = (2-i) * 10
        time_ts = dt - timedelta(minutes=m)
        print(time_ts)
        time = time_ts.strftime("%Y-%m-%d %H:%M:%S")
        timestamp_list.append(time)
    return timestamp_list

"""wind speed calc (F1)"""
def calc_wind_speed(packet, logdata):
    wind_speed_list = [] #F1
    sampling_interval = 300000
    Ref_Speed = 2.4
    Ref_Speed_ort = 1000
    for i in range(3):
        data_hex = logdata[iter_val]["F1"][i]
        data_dec = int(data_hex, 16)
        if(data_dec != 0):
            one_rotation_time = sampling_interval / data_dec
            wind_Speed = (Ref_Speed * Ref_Speed_ort) / one_rotation_time
        else:
            wind_Speed = 0
        wind_speed_list.append(wind_Speed)
    return wind_speed_list

"""wind direction calc (F2)"""
def calc_wind_dir(packet, logdata):
    wind_dir_list = [] #F2
    wind_dir_mapping = [[112.5, 864], [67.5, 947], [90, 1072], [157.5, 1326], [135, 1631], [202.5, 1876], [180, 2214], [22.5, 2556], [45, 2876], [247.5, 3141], [225, 3285], [337.5, 3487], [0, 3639], [292.5, 3754], [315, 3881], [270, 4000]]
    for i in range(3):
        data_hex = logdata[iter_val]["F2"][i]
        data_dec = int(data_hex, 16)
        l = 0
        while(data_dec > 700 & data_dec < 4000 & wind_dir_mapping[l][1] < data_dec):
            l = l + 1
        wind_dir = wind_dir_mapping[l][0]
        wind_dir_list.append(wind_dir)
    return wind_dir_list

"""rain calc (F3)"""
def calc_rain(packet, logdata):
    rain_list = [] #F3
    Multiplier = 0.2794
    for i in range(3):
        data_hex = logdata[iter_val]["F3"][i]
        data_dec = int(data_hex, 16)
        Rain = data_dec * Multiplier
        rain_list.append(Rain)
    return rain_list

"""soil_moisture calc (F4, F5, F8, F9)"""
def calc_soil_moisture(packet, logdata, F):
    #Vcc = (Vbat-0.65)
    soil_moisture_list = [] #F4, F8, F5, F9
    Resolution = 4096
    R2_value = 10000
    for i in range(3):
        data_hex = logdata[iter_val][F][i]
        data_dec = int(data_hex, 16)
        if (data_dec > 0):
            Resistance = (R2_value * (Resolution - data_dec)) / data_dec
        else:
            Resistance = 20*10^6
        soil_moisture_list.append(Resistance)
    return soil_moisture_list

"""soil temp (F6)"""
def calc_soil_temp(packet, logdata):
    soil_temp_list = [] #F6
    for i in range(3):
        data_hex = logdata[iter_val]["F6"][i]
        data_dec = int(data_hex, 16)
        Temperature = data_dec / 16
        soil_temp_list.append(Temperature)
    return soil_temp_list

"""air humidity (F14)"""
def calc_air_humidity(packet, logdata):
    air_humidity_list = [] #F14
    for i in range(3):
        data_hex = logdata[iter_val]["F14"][i]
        data_dec = int(data_hex, 16)
        air_humidity_list.append(data_dec)
    return air_humidity_list

"""air temp (F15)"""
def calc_air_temp(packet, logdata):
    air_temp_list = [] #F15
    for i in range(3):
        data_hex = logdata[iter_val]["F15"][i]
        data_dec = int(data_hex, 16)
        air_temp_list.append(data_dec)
    return air_temp_list

"""Battery volume (F7)"""
def calc_battery_per(packet, logdata):
    battery_per_list = [] #F7
    Resolution = 4096
    Ref_Val = 2.048
    Drop1 = 0.65
    Vbatmin = 3.7
    Vbatmax = 4.1
    for i in range(3):
        data_hex = logdata[iter_val]["F7"][i]
        data_dec = int(data_hex, 16)
        Vol = (math.floor((Resolution * Ref_Val * 1000) / data_dec) / 1000) + Drop1
        if ((Vol > Vbatmin ) & (Vol < Vbatmax)):
            bat_per = (int)(((Vol- Vbatmin) / (Vbatmax - Vbatmin)) * 100)
        elif (Vol < Vbatmin):
            bat_per = 0
        elif (Vol > Vbatmax):
            bat_per = 100
        battery_per_list.append(bat_per)
    return battery_per_list

def get_rows(packet, logdata, t):
    rows = list(zip(ret_station_id(), calc_air_temp(packet, logdata), calc_air_humidity(packet, logdata), calc_soil_temp(packet, logdata), calc_soil_moisture(packet, logdata, "F4"), calc_wind_speed(packet, logdata), calc_wind_dir(packet, logdata), calc_rain(packet, logdata), calc_battery_per(packet, logdata), calc_timestamp(packet, logdata, t)))
    return rows

if __name__ == "__main__":
    user_date = sys.argv[1]
    user_time = sys.argv[2]
    url = "http://59.95.100.34:45803/getlogdata?device_id=5&format=json&start_time=" + user_date + "+" + user_time + "&submit=Submit"
    print(url)
    response = requests.get(url)
    packet = get_packet(response.text)
    logdata = get_logdata(packet)
    print(get_rows(packet, logdata))
#    print(timestamp_list)
#    print("Wind speed (kmph): ", wind_speed_list)
#    print("Wind dir (degree): ", wind_dir_list)
#    print("Rain (mm): ", rain_list)
#    print("Soil moisture (ohm): ", soil_moisture_list)
#    calc_soil_moisture("F5")
#    print("Soil moisture (ohm): ", soil_moisture_list)
#    calc_soil_moisture("F8")
#    print("Soil moisture (ohm): ", soil_moisture_list)
#    calc_soil_moisture("F9")
#    print("Soil moisture (ohm): ", soil_moisture_list)
#    print("Soil temp (°C): ", soil_temp_list)
#    print("Air Humidity (%RH): ", air_humidity_list)
#    print("Air temp (°C): ", air_temp_list)
#    print("Battery (%): ", battery_per_list)

