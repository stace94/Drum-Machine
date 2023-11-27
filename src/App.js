import React, { useState, useEffect, useCallback } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import './index.css';

// First set of sounds
const Q1 = ["https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3", "Heater 1"];
const W1 = ["https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3", "Heater 2"];
const E1 = ["https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3", "Heater 3"];
const A1 = ["https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3", "Heater 4"];
const S1 = ["https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3", "Clap"];
const D1 = ["https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3", "Open-HH"];
const Z1 = ["https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3", "Kick-n'-Hat"];
const X1 = ["https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3", "Kick"];
const C1 = ["https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3", "Closed-HH"];

// Second set of sounds
const Q2 = ["https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3", "Chord 1"];
const W2 = ["https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3", "Chord 2"];
const E2 = ["https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3", "Chord 3"];
const A2 = ["https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3", "Light"];
const S2 = ["https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3", "Dry Ohh"];
const D2 = ["https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3", "Bld H1"];
const Z2 = ["https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3", "Punchy Kick"];
const X2 = ["https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3", "Side Stick"];
const C2 = ["https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3", "Break Snare"];

// Initial set of sounds
const initialSoundList1 = {
  q: { src: Q1[0], description: Q1[1] },
  w: { src: W1[0], description: W1[1] },
  e: { src: E1[0], description: E1[1] },
  a: { src: A1[0], description: A1[1] },
  s: { src: S1[0], description: S1[1] },
  d: { src: D1[0], description: D1[1] },
  z: { src: Z1[0], description: Z1[1] },
  x: { src: X1[0], description: X1[1] },
  c: { src: C1[0], description: C1[1] },
};

// Second set of sounds
const initialSoundList2 = {
  q: { src: Q2[0], description: Q2[1] },
  w: { src: W2[0], description: W2[1] },
  e: { src: E2[0], description: E2[1] },
  a: { src: A2[0], description: A2[1] },
  s: { src: S2[0], description: S2[1] },
  d: { src: D2[0], description: D2[1] },
  z: { src: Z2[0], description: Z2[1] },
  x: { src: X2[0], description: X2[1] },
  c: { src: C2[0], description: C2[1] },
};

function App() {
  // State variables
  const [soundList, setSoundList] = useState(initialSoundList1); // Holds the current set of sounds
  const [sound, setSound] = useState(null); // Represents the currently played sound
  const [description, setDescription] = useState(null); // Holds the description of the currently played sound
  const [volume, setVolume] = useState(50); // Represents the volume level (0-100)
  const [power, setPower] = useState(true); // Indicates whether the power is on or off
  const [useSecondSet, setUseSecondSet] = useState(false); // Indicates whether to use the second set of sounds


  // Function to play a single sound based on the key
  const playAudio = useCallback((key) => {
    return new Promise((resolve) => {
      if (power) {
        const audio = new Audio(soundList[key].src);
        setDescription(soundList[key].description);
        audio.volume = volume / 100;
        audio.play();

        audio.onended = () => {
          resolve();
        };
      } else {
        resolve();
      }
    });
  }, [power, soundList, setDescription, volume]);

  // Effect hook for handling keydown events
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (soundList[key]) {
        playAudio([key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playAudio, soundList]);

  // Effect hook for handling power state changes
  useEffect(() => {
    if (!power) {
      setDescription(null);
    }
  }, [power]);

  // Event handler for volume change
  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  // Event handler for toggling power state
  const togglePower = () => {
    setPower(!power);
  };

  // Event handler for toggling between the first and second sets of sounds
  const toggleSoundSet = () => {
    setUseSecondSet(!useSecondSet);
    setSound(null); // Reset the current sound when switching sound sets
  };

  // Effect hook for updating the soundList when switching between sound sets
  useEffect(() => {
    const newSoundList = useSecondSet ? initialSoundList2 : initialSoundList1;
    setSoundList(newSoundList);
  }, [useSecondSet]);


 // JSX structure representing the UI
 return (
  <div id="drum-machine" className="grid-container">
    <div className="keys">
      {/* Render buttons for each key in a 3x3 grid */}
      {Object.keys(soundList).map((key) => (
        <button id="drum-pad" key={key} onClick={() => playAudio(key)}>
          {key.toUpperCase()}
        </button>
      ))}
    </div>

    <div id="drum-machine" className="controls">
      {/* Display the description of the currently played sound */}
      <p id="display">{description}</p>
      {/* Render the audio player */}
      <ReactAudioPlayer
        src={sound !== null ? soundList[sound].src : null}
        autoPlay={true}
        controls={false}
        volume={power ? volume / 100 : 0}
      />
      {/* Volume control slider */}
      <label id="volume">Volume
      <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} />
      </label>
      {/* Power toggle switch */}
      <label className="switch">
        Power
        <input type="checkbox" checked={power} onChange={togglePower} />
        <span className="slider round"></span>
      </label>
      {/* Toggle switch for using the second set of sounds */}
      <label className="switch">
        Use Second Set
        <input type="checkbox" checked={useSecondSet} onChange={toggleSoundSet} />
        <span className="slider round"></span>
      </label>
    </div>
  </div>
);
}

export default App;