const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.static("public"));

const clientTimers = new Map();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("startMonitoring", (settings) => {
        const city = settings.city;
        const interval = Number(settings.interval);

        console.log(`Monitoring started for ${city}, interval: ${interval} ms`);

        if (clientTimers.has(socket.id)) {
            clearInterval(clientTimers.get(socket.id));
        }

        const timer = setInterval(() => {
            const weatherData = generateWeatherData(city);
            socket.emit("weatherUpdate", weatherData);
        }, interval);

        clientTimers.set(socket.id, timer);

        const firstData = generateWeatherData(city);
        socket.emit("weatherUpdate", firstData);
    });

    socket.on("stopMonitoring", () => {
        if (clientTimers.has(socket.id)) {
            clearInterval(clientTimers.get(socket.id));
            clientTimers.delete(socket.id);
        }

        console.log("Monitoring stopped:", socket.id);
    });

    socket.on("disconnect", () => {
        if (clientTimers.has(socket.id)) {
            clearInterval(clientTimers.get(socket.id));
            clientTimers.delete(socket.id);
        }

        console.log("User disconnected:", socket.id);
    });
});

function generateWeatherData(city) {
    const precipitationTypes = ["No precipitation", "Rain", "Snow", "Cloudy", "Fog"];

    return {
        city: city,
        temperature: randomNumber(-10, 35),
        pressure: randomNumber(730, 770),
        windSpeed: randomNumber(0, 20),
        precipitation: precipitationTypes[randomNumber(0, precipitationTypes.length - 1)],
        time: new Date().toLocaleTimeString()
    };
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});