const int irSensors[6] = {22, 23, 24, 25, 26, 27};
int passengerCounts[6] = {0};
bool lastState[6] = {LOW};

void setup() {
  Serial.begin(9600);
  for (int i = 0; i < 6; i++) {
    pinMode(irSensors[i], INPUT);
    lastState[i] = digitalRead(irSensors[i]);
  }
}

void loop() {
  for (int i = 0; i < 6; i++) {
    bool currentState = digitalRead(irSensors[i]);
    if (lastState[i] == LOW && currentState == HIGH) {
      passengerCounts[i]++;
      delay(100);
    }
    lastState[i] = currentState;
  }

  static unsigned long lastSendTime = 0;
  if (millis() - lastSendTime >= 3000) {
    Serial.print("DATA:");
    for (int i = 0; i < 6; i++) {
      Serial.print(passengerCounts[i]);
      if (i < 5) Serial.print(",");
    }
    Serial.println();
    lastSendTime = millis();
  }
}