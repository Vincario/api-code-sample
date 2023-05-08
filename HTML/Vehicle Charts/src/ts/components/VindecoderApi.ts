// Import required interfaces
import iVindecoderResponse from "../interfaces/iVindecoderResponse";

/**
 * VindecoderApi class, responsible for fetching vehicle data using the VIN code
 */
export default class VindecoderApi {
    // API URL for the Vindecoder service
    private readonly apiUrl = "https://api.vindecoder.eu/3.1/0461edc86204/6a6ceb2401/vehicle-market-value/";

    /**
     * Constructor takes the VIN code (Vehicle Identification Number) as an input
     * @param vincode: string - The VIN code of the vehicle
     */
    constructor(private vincode: string) {
    }

    /**
     * fetchData method retrieves vehicle data from the Vindecoder API using the provided VIN code
     * @returns Promise<iVindecoderResponse> - A Promise that resolves to an iVindecoderResponse object
     */
    public async fetchData(): Promise<iVindecoderResponse> {
        // Build the URL with the VIN code
        const url = `${this.apiUrl}${this.vincode}.json`;

        // Fetch the data from the Vindecoder API
        const response = await fetch(url);
        const data = await response.json();

        return data;
    }
}
