import { useState, ChangeEvent, FormEvent, ReactElement } from 'react'
import { TrackPoint, calculateMaxGradients } from './utils/gradientCalc'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { solveMaxGradient, solveRequiredPower } from './utils/cyclingClimbCalc'
import { useEffect } from 'react'

// Define types for wheel circumference options
type WheelCircumference = '700c' | '650c';

function App(): ReactElement {
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [crankTeeth, setCrankTeeth] = useState<string>('');
  const [cassetteTeeth, setCassetteTeeth] = useState<string>('');
  const [totalWeight, setTotalWeight] = useState<string>('');
  const [wheelCircumference, setWheelCircumference] = useState<WheelCircumference>('700c');
  const [idealCadence, setIdealCadence] = useState<string>('');
  const [gradientResults, setGradientResults] = useState<Record<number, number> | null>(null);
  const [inputPower, setInputPower] = useState<string>('');
  const [inputGradient, setInputGradient] = useState<string>('');
  const [maxGradientResult, setMaxGradientResult] = useState<number | null>(null);
  const [requiredPowerResult, setRequiredPowerResult] = useState<number | null>(null);
  const [powerForGradients, setPowerForGradients] = useState<Record<number, number> | null>(null);

// Wheel circumference mapping
  const wheelCircMap: Record<WheelCircumference, number> = {
    '700c': 2.1,
    '650c': 2.0,
  };

// Handler for max gradient calculation
  const handleMaxGradient = () => {
    if (!inputPower || !crankTeeth || !cassetteTeeth || !totalWeight || !idealCadence) return;
    const climbInput = {
      massKg: parseFloat(totalWeight),
      cadenceRpm: parseFloat(idealCadence),
      frontTeeth: parseInt(crankTeeth, 10),
      rearTeeth: parseInt(cassetteTeeth, 10),
      wheelCircumferenceM: wheelCircMap[wheelCircumference],
      powerWatts: parseFloat(inputPower),
    };
    const result = solveMaxGradient(climbInput);
    setMaxGradientResult(Number(result.maxGradientPercent.toFixed(1)));
  };

// Handler for required power calculation
  const handleRequiredPower = () => {
    if (!inputGradient || !crankTeeth || !cassetteTeeth || !totalWeight || !idealCadence) return;
    const climbInput = {
      massKg: parseFloat(totalWeight),
      cadenceRpm: parseFloat(idealCadence),
      frontTeeth: parseInt(crankTeeth, 10),
      rearTeeth: parseInt(cassetteTeeth, 10),
      wheelCircumferenceM: wheelCircMap[wheelCircumference],
      gradientPercent: parseFloat(inputGradient),
    };
    const result = solveRequiredPower(climbInput);
    setRequiredPowerResult(Number(result.requiredPowerWatts.toFixed(0)));
  };
  const calculateGradients = async (file: File): Promise<void> => {
    try {
      // Parse the GPX file to extract track points
      const trackPoints = await parseGpxFile(file);

      if (trackPoints.length === 0) {
        alert('No track points found in the GPX file');
        return;
      }

      // Calculate the maximum gradients for different distances
      const distances = [10, 100, 500, 1000]; // in meters
      const maxGradients = calculateMaxGradients(trackPoints, distances);

      // Set the gradient results
      setGradientResults(maxGradients);
    } catch (error) {
      console.error('Error processing GPX file:', error);
      alert('Error processing GPX file. Please check the console for details.');
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file && file.name.endsWith('.gpx')) {
        setGpxFile(file);
        // Calculate gradients immediately after file upload
        await calculateGradients(file);
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

  const handleIdealCadenceChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIdealCadence(event.target.value);
  };

  const parseGpxFile = (file: File): Promise<TrackPoint[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, "text/xml");

          const trackPoints: TrackPoint[] = [];
          const trkpts = xmlDoc.getElementsByTagName("trkpt");

          for (let i = 0; i < trkpts.length; i++) {
            const trkpt = trkpts[i];
            const lat = parseFloat(trkpt.getAttribute("lat") || "0");
            const lon = parseFloat(trkpt.getAttribute("lon") || "0");
            const eleElement = trkpt.getElementsByTagName("ele")[0];
            const ele = eleElement ? parseFloat(eleElement.textContent || "0") : 0;

            trackPoints.push({ lat, lon, ele });
          }

          resolve(trackPoints);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Error reading the GPX file"));
      };

      reader.readAsText(file);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
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

    // Calculate gradients using the shared function
    await calculateGradients(gpxFile);
  };

  useEffect(() => {
    if (
        gradientResults &&
        crankTeeth &&
        cassetteTeeth &&
        totalWeight &&
        idealCadence
    ) {
      const climbInputBase = {
        massKg: parseFloat(totalWeight),
        cadenceRpm: parseFloat(idealCadence),
        frontTeeth: parseInt(crankTeeth, 10),
        rearTeeth: parseInt(cassetteTeeth, 10),
        wheelCircumferenceM: wheelCircMap[wheelCircumference],
      };
      const newPowerForGradients: Record<number, number> = {};
      Object.entries(gradientResults).forEach(([distance, gradient]) => {
        const result = solveRequiredPower({
          ...climbInputBase,
          gradientPercent: gradient,
        });
        newPowerForGradients[Number(distance)] = Math.round(result.requiredPowerWatts);
      });
      setPowerForGradients(newPowerForGradients);
    } else {
      setPowerForGradients(null);
    }
  }, [gradientResults, crankTeeth, cassetteTeeth, totalWeight, idealCadence, wheelCircumference]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('climbrBikeSetup');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.crankTeeth) setCrankTeeth(parsed.crankTeeth);
        if (parsed.cassetteTeeth) setCassetteTeeth(parsed.cassetteTeeth);
        if (parsed.totalWeight) setTotalWeight(parsed.totalWeight);
        if (parsed.idealCadence) setIdealCadence(parsed.idealCadence);
        if (parsed.wheelCircumference) setWheelCircumference(parsed.wheelCircumference);
      } catch {}
    }
  }, []);

// Save to localStorage on change
  useEffect(() => {
    const setup = {
      crankTeeth,
      cassetteTeeth,
      totalWeight,
      idealCadence,
      wheelCircumference,
    };
    localStorage.setItem('climbrBikeSetup', JSON.stringify(setup));
  }, [crankTeeth, cassetteTeeth, totalWeight, idealCadence, wheelCircumference]);

  return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10 flex justify-center items-start py-8">
        <div className="w-full max-w-[420px] px-3 py-6 bg-background rounded-lg shadow-md md:shadow-lg md:border md:border-border/30 mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-1">CLIMBR</h1>
          <p className="text-muted-foreground text-xs">
            Calculate steepness for bicycle riding from GPX tracks
          </p>
        </div>

        <Card className="shadow-sm border-0 overflow-hidden mb-4">
          <CardHeader className="bg-primary/5 pb-1">
            <CardTitle className="text-base font-medium text-primary">Upload GPX Track</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-1">
              <Input
                type="file"
                id="gpx-upload"
                accept=".gpx"
                onChange={handleFileChange}
                className="cursor-pointer file:bg-primary/5 file:text-primary file:border-0 file:font-medium file:mr-3 hover:file:bg-primary/10 transition-colors"
              />
              {gpxFile && <p className="text-xs text-primary mt-1 font-medium">Selected: {gpxFile.name}</p>}
            </div>
          </CardContent>
        </Card>

        {gradientResults && (
            <Card className="shadow-sm border-0 overflow-hidden mb-4 animate-in fade-in-50 duration-300">
              <CardHeader className="bg-primary/5 pb-1">
                <CardTitle className="text-base font-medium text-primary">Steepest Gradients</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(gradientResults).map(([distance, gradient]) => (
                      <div key={distance} className="flex flex-col items-center justify-center p-2 bg-muted/20 border border-muted/30">
                        <span className="text-xs text-muted-foreground">{distance}m</span>
                        <span className="text-xl font-semibold text-primary">{gradient}%</span>
                        {powerForGradients && powerForGradients[Number(distance)] !== undefined && (
                            <span className="text-xs text-muted-foreground mt-1">
              Power: <b>{powerForGradients[Number(distance)]}W</b>
            </span>
                        )}
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="shadow-sm border-0 overflow-hidden mb-4">
            <CardHeader className="bg-primary/5 pb-1">
              <CardTitle className="text-base font-medium text-primary">Bike & Rider Setup</CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="crank-teeth" className="text-xs font-medium">Crank Teeth</Label>
                  <Input
                    type="number"
                    id="crank-teeth"
                    value={crankTeeth}
                    onChange={handleCrankTeethChange}
                    placeholder="34"
                    min="1"
                    className="h-8"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cassette-teeth" className="text-xs font-medium">Cassette Teeth</Label>
                  <Input
                    type="number"
                    id="cassette-teeth"
                    value={cassetteTeeth}
                    onChange={handleCassetteTeethChange}
                    placeholder="32"
                    min="1"
                    className="h-8"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="total-weight" className="text-xs font-medium">Total Weight (kg)</Label>
                <Input
                  type="number"
                  id="total-weight"
                  value={totalWeight}
                  onChange={handleTotalWeightChange}
                  placeholder="85"
                  min="1"
                  step="0.1"
                  className="h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="wheel-circumference" className="text-xs font-medium">Wheel Size</Label>
                  <Select value={wheelCircumference} onValueChange={(value) => setWheelCircumference(value as WheelCircumference)}>
                    <SelectTrigger id="wheel-circumference" className="h-8">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="700c">700c</SelectItem>
                      <SelectItem value="650c">650c</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ideal-cadence" className="text-xs font-medium">
                    Preferred Cadence (rpm)
                  </Label>
                  <div className="flex items-center space-x-2">
                    <input
                        type="range"
                        id="ideal-cadence"
                        min={60}
                        max={110}
                        value={idealCadence || 90}
                        onChange={handleIdealCadenceChange}
                        className="w-full accent-primary"
                    />
                    <span className="text-xs w-8 text-right">{idealCadence || 90}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}

export default App
