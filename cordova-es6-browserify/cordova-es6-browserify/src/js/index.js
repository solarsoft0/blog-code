class DeviceManager {
    initialize() {
        document.addEventListener('deviceready', event => { return this.onDeviceReady(event); });
    }

    onDeviceReady(event) {
        console.log('[DeviceManager.onDeviceReady] Event = ', event);
        var el = document.getElementById('root');
        console.log('[DeviceManager.onDeviceReady] el = ', el);
        el.innerHTML = '<p>[DeviceManager.onDeviceReady] Booted.';
    }
}

console.log('[index] Creating new DeviceManager object');
var deviceManager = new DeviceManager();
console.log('[index] Initializing DeviceManager');
deviceManager.initialize();
