const int redLed = 9;     
int rightSensorValue = 0;  
int leftSensorValue = 0;
int lastvalue = 2;   

void setup() {
  
  Serial.begin(9600);
  
  pinMode(redLed, OUTPUT);
}


void loop() {
  rightSensorValue = analogRead(A0); 
  leftSensorValue = analogRead(A1); 
 
  int sensorSum;
  
  
  

  if(rightSensorValue == 0 || leftSensorValue == 0)
  {
  if (lastvalue != 0) {
    sensorSum = 0;
    Serial.println("0"); 
    lastvalue = 0;
  } 
  }
  else
  {
    sensorSum = rightSensorValue + leftSensorValue;
    if(lastvalue != 1){
      Serial.println("1");
      lastvalue = 1;  
    }
  }

  int brightness = map(sensorSum, 0,2000, 0, 255);
  
  analogWrite(redLed, brightness);  
 }

