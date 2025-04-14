// Arduino IR Sensor Code with Reset Capability
// Upload this to your Arduino to enable reset functionality

const int IR_SENSORS[] = {22, 23, 24, 25, 26, 27}; // Pins for 6 IR sensors
const int SENSOR_COUNT = 6;

int passengerCounts[SENSOR_COUNT] = {0}; // Array to store counts
String inputString = "";                 // String to store incoming commands
boolean stringComplete = false;          // Whether a command is complete

void setup() {
  Serial.begin(9600);
  
  // Initialize IR sensor pins as inputs
  for (int i = 0; i < SENSOR_COUNT; i++) {
    pinMode(IR_SENSORS[i], INPUT);
  }
  
  // Reserve memory for inputString
  inputString.reserve(50);
  
  Serial.println("IR Passenger Counter Ready");
}

void loop() {
  // Check for commands from Python script
  if (stringComplete) {
    if (inputString.startsWith("RESET")) {
      resetCounts();
      Serial.println("RESET_ACK"); // Acknowledge reset command
    }
    
    // Clear the command
    inputString = "";
    stringComplete = false;
  }
  
  // Read sensors and update counts (your existing sensor reading code here)
  // This is a placeholder - implement your actual sensor detection logic
  checkSensors();
  
  // Send data every second
  static unsigned long lastSendTime = 0;
  if (millis() - lastSendTime >= 1000) {
    sendData();
    lastSendTime = millis();
  }
}

void checkSensors() {
  // Example sensor reading code
  // In practice, you'll need debouncing and proper IR sensor logic
  static int lastState[SENSOR_COUNT] = {HIGH, HIGH, HIGH, HIGH, HIGH, HIGH};
  
  for (int i = 0; i < SENSOR_COUNT; i++) {
    int currentState = digitalRead(IR_SENSORS[i]);
    
    // Count when beam is broken (LOW) and was previously unbroken (HIGH)
    if (currentState == LOW && lastState[i] == HIGH) {
      passengerCounts[i]++;
    }
    
    lastState[i] = currentState;
  }
}

void sendData() {
  // Format: DATA:count1,count2,count3,count4,count5,count6
  Serial.print("DATA:");
  for (int i = 0; i < SENSOR_COUNT; i++) {
    Serial.print(passengerCounts[i]);
    if (i < SENSOR_COUNT - 1) {
      Serial.print(",");
    }
  }
  Serial.println();
}

void resetCounts() {
  // Reset all counts to zero
  for (int i = 0; i < SENSOR_COUNT; i++) {
    passengerCounts[i] = 0;
  }
  Serial.println("Counts reset to zero");
}

// Serial event handler - called when new data arrives
void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    
    // Add character to input string
    if (inChar != '\n') {
      inputString += inChar;
    }
    // End of command
    else {
      stringComplete = true;
    }
  }
}