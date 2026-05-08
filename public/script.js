const socket = io();

const citySelect = document.getElementById("citySelect");
const intervalSelect = document.getElementById("intervalSelect");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const precipitation = document.getElementById("precipitation");
const pressure = document.getElementById("pressure");
const windSpeed = document.getElementById("windSpeed");
const updateTime = document.getElementById("updateTime");

const log = document.getElementById("log");

startButton.addEventListener("click", () => {
    const settings = {
        city: citySelect.value,
        interval: intervalSelect.value
    };

    socket.emit("startMonitoring", settings);

    addLog(`Monitoring started for ${settings.city}`);
});

stopButton.addEventListener("click", () => {
    socket.emit("stopMonitoring");
    addLog("Monitoring stopped");
});

socket.on("weatherUpdate", (data) => {
    cityName.textContent = data.city;
    temperature.textContent = `${data.temperature} °C`;
    precipitation.textContent = data.precipitation;
    pressure.textContent = `${data.pressure} mmHg`;
    windSpeed.textContent = `${data.windSpeed} m/s`;
    updateTime.textContent = data.time;

    addLog(
        `${data.time} | ${data.city}: ${data.temperature} °C, ${data.precipitation}, ${data.pressure} mmHg, wind ${data.windSpeed} m/s`
    );
});

function addLog(text) {
    const item = document.createElement("div");
    item.className = "log-item";
    item.textContent = text;

    log.prepend(item);
}