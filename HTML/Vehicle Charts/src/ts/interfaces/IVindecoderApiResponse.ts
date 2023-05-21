// Import the IRecord interface
import IRecord from "./IRecord";

export default interface IVindecoderApiResponse {
    vin: string;
    price: number;
    price_currency: string;
    balance: {
        "API Decode": number;
        "API Stolen Check": number;
        "API Vehicle Market Value": number;
    };
    vehicle: {
        vehicle_id: number;
        make: string;
        make_id: number;
        model: string;
        model_id: number;
        model_year:number;
        year: number;
        body: string;
        body_id: number;
        engine: string;
        engine_id: number;
        fuel: string;
        fuel_id: number;
        transmission: string;
        transmission_id: number;
        drive: string;
        drive_id: number;
    };
    market_price: {
        price_count: number;
        price_currency: string;
        price_below: number;
        price_mean: number;
        price_avg: number;
        price_above: number;
    };
    market_odometer: {
        odometer_count: number;
        odometer_unit: string;
        odometer_below: number;
        odometer_mean: number;
        odometer_avg: number;
        odometer_above: number;
    };
    records: IRecord[];
    period: {
        from: string;
        to: string;
    };
}
