import Period from "./Period";

export default interface UnitData {
    label: string,
    units: Record<string, Period[]>,
    description: string
}