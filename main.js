import { getSolarTime } from 'https://esm.run/solar-time@2.1.0';

let longitude = null;

const elUtc   = document.getElementById('utc-time');
const elSolar = document.getElementById('solar-time');
const elStatus = document.getElementById('status');

function setText(el, val) {
  if (el.textContent !== val) el.textContent = val;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(date) {
  const h = date.getUTCHours();
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 || 12;
  return `${pad(h12)}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} ${ampm}`;
}

function tick() {
  const now = new Date();

  setText(elUtc, formatTime(now));

  if (longitude !== null) {
    try {
      const result = getSolarTime(now.toISOString(), longitude);
      setText(elSolar, formatTime(new Date(result.LST)));
    } catch {
      setText(elSolar, 'Error');
    }
  }
}

function onLocation(pos) {
  longitude = pos.coords.longitude;
  setText(elStatus, '');
  elStatus.className = 'status';
  tick();
}

function onError(err) {
  setText(elStatus, `Location unavailable: ${err.message}`);
  elStatus.className = 'status error';
}

if (!navigator.geolocation) {
  setText(elStatus, 'Geolocation not supported by this browser.');
  elStatus.className = 'status error';
} else {
  navigator.geolocation.getCurrentPosition(onLocation, onError, {
    enableHighAccuracy: false,
    timeout: 10000,
  });
}

setInterval(tick, 1000);
tick();
