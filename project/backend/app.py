# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from threading import Thread, Lock
import time
from optimizer import admm_schedule

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory data storage
passenger_counts = [0] * 8  # 8 stops (Start Point, End Point, and 6 intermediate stops)
fleet_status = {
    "routes": {},  # e.g., {'Route A': 2, 'Route B': 1}
    "idle_buses": 0  # buses not assigned
}

# Thread-safe lock for passenger_counts
passenger_counts_lock = Lock()

# Flag to signal reset to the sensor script
reset_signal = False

# --- ROUTE DEFINITIONS ---
ROUTES = {
    "Route A": [0, 1],  # Stops 1 and 2
    "Route B": [2, 3],  # Stops 3 and 4
    "Route C": [4, 5],  # Stops 5 and 6
}

TOTAL_BUSES = 10

# Add distances and fuel efficiency for each stop
DISTANCES = [1.2, 2.5, 3.0, 1.8, 2.2, 3.5, 1.0, 2.8]  # Example distances in km
FUEL_EFFICIENCY = 5.0  # Example fuel efficiency in km/l

@app.route("/update_counts", methods=["POST"])
def update_counts():
    """
    Endpoint to update passenger counts from sensors.
    """
    global reset_signal
    data = request.get_json()
    print(f"[DEBUG] Received data: {data}")  # Log the incoming data
    if not data or "counts" not in data:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    counts = data["counts"]
    if len(counts) != 6:  # Expecting data for 6 intermediate stops
        print(f"⚠️ Invalid counts length: {counts}")
        return jsonify({"error": "Invalid counts length"}), 400
    if not all(isinstance(c, int) and c >= 0 for c in counts):
        print(f"⚠️ Invalid counts values: {counts}")
        return jsonify({"error": "Invalid counts values"}), 400

    # Update passenger counts with thread-safe lock
    with passenger_counts_lock:
        for i in range(6):
            passenger_counts[i + 1] = counts[i]  # Map IR sensor data to Stops 1 to 6

    # Send reset status back to client
    response = {
        "message": "Passenger counts updated",
        "reset": reset_signal
    }
    
    # Clear reset signal if it was set
    if reset_signal:
        reset_signal = False
        print("[DEBUG] Reset signal sent to client")
    
    print(f"[DEBUG] Updated passenger counts: {passenger_counts}")  # Log the updated counts
    return jsonify(response), 200

@app.route("/fleet_status", methods=["GET"])
def get_fleet_status():
    """
    Endpoint to get the current fleet status.
    """
    # Only send the 6 intermediate stops (indices 1-6) to match what the frontend expects
    stops_data = passenger_counts[1:7]
    
    response = {
        "routes": fleet_status["routes"],
        "idle_buses": fleet_status["idle_buses"],
        "passenger_counts": stops_data
    }
    print(f"[DEBUG] Fleet Status Response: {response}")
    return jsonify(response)

def optimization_loop():
    """
    Periodically runs the ADMM optimization to allocate buses dynamically.
    """
    global reset_signal
    while True:
        time.sleep(30)
        with passenger_counts_lock:
            print(f"[DEBUG] Before optimization: {passenger_counts[1:7]}")  # Log intermediate stops
            result = admm_schedule(passenger_counts[1:7], ROUTES, TOTAL_BUSES, DISTANCES[1:7], FUEL_EFFICIENCY)
            fleet_status["routes"] = result["routes"]
            fleet_status["idle_buses"] = result["idle_buses"]
            print("[OPTIMIZER] Updated fleet status.")
            print(f"[DEBUG] Fleet assignment: {fleet_status}")

            # Set reset signal to true so clients will reset their counts
            reset_signal = True
            
            # Reset passenger counts after fleet status is updated
            for i in range(1, 7):
                passenger_counts[i] = 0  # Reset counts to zero for new readings
            print("[DEBUG] Passenger counts reset to zero")

if __name__ == "__main__":
    # Start optimizer thread
    optimizer_thread = Thread(target=optimization_loop, daemon=True)
    optimizer_thread.start()

    # Start Flask server
    app.run(host="0.0.0.0", port=5000, debug=True)