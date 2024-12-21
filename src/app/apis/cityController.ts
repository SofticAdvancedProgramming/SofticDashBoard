import { environment } from "../environment/environment";

export const cityController ={
    loadCity: `${environment.apiBaseUrl}City/Get`
}
export const zoneController ={
  loadzone: `${environment.apiBaseUrl}Zone/Get`
}
