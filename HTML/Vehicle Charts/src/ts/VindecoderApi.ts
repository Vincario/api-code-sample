// Import required interfaces
import IVindecoderApiResponse from "./interfaces/IVindecoderApiResponse";

/**
 * VindecoderApi class, responsible for fetching vehicle data using the VIN code
 */
export default class VindecoderApi {
    // API URL for the Vindecoder service
    private readonly apiUrl = "https://api.vindecoder.eu/3.1/";

    /**
     * Constructor takes the VIN code (Vehicle Identification Number) as an input
     * @param apiKey: string - The API key for accessing the Vindecoder API
     * @param vincode: string - The VIN code of the vehicle
     */
    constructor(private apiKey: string, private vincode: string) {
        if (apiKey === "") {
            throw new Error("API key is required.");
        }
    }

    /**
     * fetchData method retrieves vehicle data from the Vindecoder API using the provided VIN code
     * @returns Promise<IVindecoderApiResponse> - A Promise that resolves to an IVindecoderApiResponse object
     */
    public async fetchData(): Promise<IVindecoderApiResponse> {
        // Check if apiKey is empty
        if (this.apiKey === "") {
            throw new Error("API key is required.");
        }

        // Build the URL with the VIN code and apiKey
        const url = `${this.apiUrl}${this.apiKey}/6a6ceb2401/vehicle-market-value/${this.vincode}.json`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch vehicle data. Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Failed to fetch vehicle data: ${error.message}`);
        }
    }
}
