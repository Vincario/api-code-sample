// Import required interfaces
import IVindecoderApiResponse from "./interfaces/IVindecoderApiResponse";
import jsSHA from "jssha";

/**
 * VindecoderApi class, responsible for fetching vehicle data using the VIN code
 */
export default class VindecoderApi {
    // API URL for the Vindecoder service
    private readonly apiUrl = "https://api.vindecoder.eu/3.2/";
    private readonly id = "vehicle-market-value";

    /**
     * Constructor takes the VIN code (Vehicle Identification Number) as an input
     * @param apiKey: string - The API key for accessing the Vindecoder API
     * @param apiSecret
     * @param vincode: string - The VIN code of the vehicle
     */
    constructor(private apiKey: string, private apiSecret: string, private vincode: string) {
        if (apiKey === "") {
            throw new Error("API key is required.");
        }
    }


    private createCheckSum(): string {
        // Prepare the string to be hashed
        const strToHash = `${this.vincode}|${this.id}|${this.apiKey}|${this.apiSecret}`;

        // Create a new SHA-1 object
        const shaObj = new jsSHA("SHA-1", "TEXT");

        // Input the string to be hashed
        shaObj.update(strToHash);

        // Get the hashed output
        const hash = shaObj.getHash("HEX");

        // Return the first 10 characters of the hash
        return hash.substring(0, 10);
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

        // Check if apiSecret is empty
        if (this.apiSecret === "") {
            throw new Error("API secret is required.");
        }

        // Build the URL with the VIN code and apiKey
        const checkSum = this.createCheckSum();
        const url = `${this.apiUrl}${this.apiKey}/${checkSum}/vehicle-market-value/${this.vincode}.json`;

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
