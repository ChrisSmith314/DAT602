// Sharp IR GP2Y0A41SK0F Distance Test
// http://tinkcore.com/sharp-ir-gp2y0a41-skf/

#define sensor A0 // Sharp IR GP2Y0A41SK0F (4-30cm, analog)

void setup() {
  Serial.begin(9600); // start the serial port
  pinMode(2,INPUT);
}

int currentState = 0;

void loop() {
  if(digitalRead(2) == LOW){
    if(currentState == 1){
      Serial.println("OPEN");
      currentState = 0;
    } else {
      float volts = analogRead(sensor)*0.0048828125;  // value from sensor * (5/1024)
      int distance = 13*pow(volts, -1); // worked out from datasheet graph
      if (distance <= 30){
        Serial.println("FLASH");   // print the distance
        }
      }
    }else{
    if(currentState == 0){
      Serial.println("CLOSE");
      currentState = 1;
    }
  }
  delay(1000);
}
