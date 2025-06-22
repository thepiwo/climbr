// cyclingClimbCalc.ts

export interface ClimbInput {
    massKg: number;              // total mass (rider + bike) in kg
    cadenceRpm: number;          // pedal cadence in rpm
    frontTeeth: number;          // teeth on front chainring
    rearTeeth: number;           // teeth on rear cog
    wheelCircumferenceM: number; // in meters (e.g., 2.1 for 700x25c)
    powerWatts?: number;         // optional input, required for mode 1
    gradientPercent?: number;    // optional input, required for mode 2
}

export interface GradientResult {
    speedMps: number;
    maxGradientPercent: number;
}

export interface PowerResult {
    speedMps: number;
    requiredPowerWatts: number;
}

const g = 9.81; // gravitational acceleration in m/s^2

// Helper to compute gear ratio and speed
function computeSpeed({ cadenceRpm, frontTeeth, rearTeeth, wheelCircumferenceM }: ClimbInput): number {
    const gearRatio = frontTeeth / rearTeeth;
    return (cadenceRpm * gearRatio * wheelCircumferenceM) / 60;
}

// Mode 1: Given power, solve for max gradient
export function solveMaxGradient(input: ClimbInput): GradientResult {
    if (input.powerWatts === undefined) {
        throw new Error("Power (watts) is required to solve for max gradient");
    }

    const speed = computeSpeed(input);
    const maxGradient = (input.powerWatts * 100) / (input.massKg * g * speed);

    return {
        speedMps: speed,
        maxGradientPercent: maxGradient
    };
}

// Mode 2: Given gradient, solve for required power
export function solveRequiredPower(input: ClimbInput): PowerResult {
    if (input.gradientPercent === undefined) {
        throw new Error("Gradient (percent) is required to solve for power");
    }

    const speed = computeSpeed(input);
    const requiredPower = (input.massKg * g * speed * (input.gradientPercent / 100));

    return {
        speedMps: speed,
        requiredPowerWatts: requiredPower
    };
}
