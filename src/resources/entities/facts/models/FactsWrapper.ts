import UnitData from "./UnitData"

export default interface FactsWrapper {
    entityName: string,
    taxonomyReports: {
        gaap: Record<string, UnitData>,
        ifrs: Record<string, UnitData>,
        dei: Record<string, UnitData>
    }
}