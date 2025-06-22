import { useState, ChangeEvent, FormEvent, ReactElement } from 'react'
import './App.css'

// Define types for wheel circumference options
type WheelCircumference = '700c' | '650c';

function App(): ReactElement {
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [crankTeeth, setCrankTeeth] = useState<string>('');
  const [cassetteTeeth, setCassetteTeeth] = useState<string>('');
  const [totalWeight, setTotalWeight] = useState<string>('');
  const [wheelCircumference, setWheelCircumference] = useState<WheelCircumference>('700c');
  const [idealCadence, setIdealCadence] = useState<string>('');
  const [results, setResults] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file && file.name.endsWith('.gpx')) {
        setGpxFile(file);
      } else {
        alert('Please upload a valid GPX file');
        event.target.value = '';
      }
    }
  };

  const handleCrankTeethChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCrankTeeth(event.target.value);
  };

  const handleCassetteTeethChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCassetteTeeth(event.target.value);
  };

  const handleTotalWeightChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTotalWeight(event.target.value);
  };

  const handleWheelCircumferenceChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setWheelCircumference(event.target.value as WheelCircumference);
  };

  const handleIdealCadenceChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIdealCadence(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!gpxFile) {
      alert('Please upload a GPX file');
      return;
    }

    if (!crankTeeth || !cassetteTeeth) {
      alert('Please enter both crank and cassette teeth values');
      return;
    }

    if (!totalWeight) {
      alert('Please enter total weight');
      return;
    }

    if (!idealCadence) {
      alert('Please enter ideal cadence');
      return;
    }

    // Here we would process the GPX file and calculate steepness
    // For now, we'll just set a placeholder result with the new inputs
    setResults(`GPX file processed. Calculation would happen here with:
      - Crank teeth: ${crankTeeth}
      - Cassette teeth: ${cassetteTeeth}
      - Total weight: ${totalWeight} kg
      - Wheel circumference: ${wheelCircumference}
      - Ideal cadence: ${idealCadence} rpm`);
  };

  return (
    <div className="container">
      <h1>CLIMBR</h1>
      <p className="description">
        Upload a GPX track and enter gear ratios to calculate acceptable steepness for bicycle riding.
      </p>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="gpx-upload">Upload GPX Track:</label>
          <input 
            type="file" 
            id="gpx-upload" 
            accept=".gpx"
            onChange={handleFileChange}
            className="file-input"
          />
          {gpxFile && <p className="file-name">Selected: {gpxFile.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="crank-teeth">Crank Teeth:</label>
          <input 
            type="number" 
            id="crank-teeth" 
            value={crankTeeth}
            onChange={handleCrankTeethChange}
            placeholder="e.g., 34"
            className="text-input"
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cassette-teeth">Cassette Teeth:</label>
          <input 
            type="number" 
            id="cassette-teeth" 
            value={cassetteTeeth}
            onChange={handleCassetteTeethChange}
            placeholder="e.g., 32"
            className="text-input"
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="total-weight">Total Weight (kg):</label>
          <input 
            type="number" 
            id="total-weight" 
            value={totalWeight}
            onChange={handleTotalWeightChange}
            placeholder="e.g., 85"
            className="text-input"
            min="1"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="wheel-circumference">Wheel Circumference:</label>
          <select 
            id="wheel-circumference" 
            value={wheelCircumference}
            onChange={handleWheelCircumferenceChange}
            className="text-input"
          >
            <option value="700c">700c</option>
            <option value="650c">650c</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ideal-cadence">Ideal Cadence (rpm):</label>
          <input 
            type="number" 
            id="ideal-cadence" 
            value={idealCadence}
            onChange={handleIdealCadenceChange}
            placeholder="e.g., 90"
            className="text-input"
            min="1"
          />
        </div>

        <button type="submit" className="submit-button">Calculate Steepness</button>
      </form>

      {results && (
        <div className="results">
          <h2>Results</h2>
          <p>{results}</p>
        </div>
      )}
    </div>
  )
}

export default App
