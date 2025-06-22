import { useState } from 'react'
import './App.css'

function App() {
  const [gpxFile, setGpxFile] = useState(null);
  const [gearRatios, setGearRatios] = useState('');
  const [results, setResults] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.gpx')) {
      setGpxFile(file);
    } else {
      alert('Please upload a valid GPX file');
      event.target.value = null;
    }
  };

  const handleGearRatiosChange = (event) => {
    setGearRatios(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!gpxFile) {
      alert('Please upload a GPX file');
      return;
    }

    // Here we would process the GPX file and calculate steepness
    // For now, we'll just set a placeholder result
    setResults('GPX file processed. Calculation would happen here.');
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
          <label htmlFor="gear-ratios">Gear Ratios (comma separated):</label>
          <input 
            type="text" 
            id="gear-ratios" 
            value={gearRatios}
            onChange={handleGearRatiosChange}
            placeholder="e.g., 34/50, 11/32"
            className="text-input"
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
