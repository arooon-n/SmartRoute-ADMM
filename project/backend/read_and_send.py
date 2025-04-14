# ✅ read_and_send.py — Updated for 6 IR sensors

import serial
import time
import requests

# CONFIG
SERIAL_PORT = 'COM10'  # Update as needed
BAUD_RATE = 9600
BACKEND_URL = 'http://localhost:5000/update_counts'
STOP_COUNT = 6  # 6 intermediate stops

# Initialize passenger counts
passenger_counts = [0] * STOP_COUNT

def send_counts_to_server():
    payload = {'counts': passenger_counts}  # Send as a list under the "counts" key
    print(f"[DEBUG] Sending payload: {payload}")  # Log the payload
    try:
        response = requests.post(BACKEND_URL, json=payload)
        if response.status_code == 200:
            print("✅ Sent counts to server:", payload)
        else:
            print(f"❌ Server responded with status code {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to send data to server: {e}")

def main():
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        time.sleep(2)
        print("✅ Connected to Arduino on", SERIAL_PORT)

        last_send_time = time.time()

        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                print(f"[DEBUG] Raw data from Arduino: {line}")  # Log raw data

                if line.startswith("DATA:"):
                    try:
                        # Parse the counts from the DATA string
                        data_str = line.replace("DATA:", "")
                        values = list(map(int, data_str.split(",")))
                        if len(values) == STOP_COUNT:
                            passenger_counts[:] = values
                            for i, count in enumerate(passenger_counts):
                                print(f"🧍 Stop {i+1} → {count} passengers")
                        else:
                            print(f"⚠️ Invalid number of values from Arduino: {values}")
                    except ValueError as e:
                        print(f"⚠️ Error parsing values: {e}")

            # Send every 3 seconds
            if time.time() - last_send_time >= 3:
                send_counts_to_server()
                last_send_time = time.time()

    except serial.SerialException as e:
        print(f"❌ Serial connection error: {e}")
    except KeyboardInterrupt:
        print("\n🛑 Stopped by user.")
    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()
            print("🔌 Serial port closed.")

if __name__ == '__main__':
    main()