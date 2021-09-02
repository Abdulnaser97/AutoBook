const audioDevices = require("macos-audio-devices");

function changeVolume(deviceName, volume) {
  try {
    const outputDevices = audioDevices.getOutputDevices.sync();
    const targetDevice = outputDevices.find(
      (deviceObject) => deviceObject.name === deviceName
    );

    audioDevices.setOutputDeviceVolume(targetDevice.id, volume);
  } catch (e) {
    console.log("WARNING: changeVolume(): ", e);
  }
}

function switchOutputAudio(deviceName) {
  try {
    const outputDevices = audioDevices.getOutputDevices.sync();
    const targetDevice = outputDevices.find(
      (deviceObject) => deviceObject.name === deviceName
    );
    const defaultDevice = audioDevices.getDefaultOutputDevice.sync();

    if (defaultDevice.id !== targetDevice.id) {
      audioDevices.setDefaultOutputDevice(targetDevice.id);
    }
  } catch (e) {
    console.log("WARNING: switchOutputAudio(): ", e);
  }
}

module.exports = {
  switchOutputAudio,
  changeVolume,
};
