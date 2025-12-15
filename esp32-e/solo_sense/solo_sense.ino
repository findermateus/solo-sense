#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid     = "your_wifi";
const char* password = "your_wifi_password";

const int ANALOG_IN = A0;

void connectToWiFi() {
  Serial.println("Connecting");

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(200);
  }

  Serial.println("Connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void sendHumidity(int rawValue) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClient client;
  HTTPClient http;

  String url = "http://SEU_SERVIDOR:8080/humidity/" + String(rawValue);
  String apiToken = "your_api_token";

  http.begin(client, url);
  http.addHeader("ApiToken", apiToken);
  int httpCode = http.POST("");

  Serial.println(url);

  if (httpCode > 0) {
    Serial.println(http.getString());
  } else {
    Serial.printf("Erro na requisição: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}

void setup() {
  Serial.begin(9600);
  delay(1000);
  connectToWiFi();
}

void loop() {
  int rawValue = analogRead(ANALOG_IN);

  Serial.print("Umidade bruta: ");
  Serial.println(rawValue);
  Serial.println("------------");

  sendHumidity(rawValue);

  delay(2000);
}