// Sign up and request API key at https://vindecoder.eu/api/#request-free-trial-api-key
// See API documentation at https://vindecoder.eu/my/api/latest/docs

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class ConnectToVincarioAPI {

	public static void main(String[] args) {

        String apiBaseUrl = "https://api.vindecoder.eu/3.2";
		String apiKey = "API_KEY";
		String secretKey = "SECRET_KEY";
		String vin = "WF0MXXGBWM8R43240";
		String action = "decode";

		try {
        	String controlSum = sha1(vin + "|" + action + "|" + apiKey + "|" + secretKey).substring(0, 10);
			String requestUrl = apiBaseUrl + "/" + apiKey + "/" + controlSum + "/"+ action + "/" + vin + ".json";
			URL url = new URL(requestUrl);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");

			BufferedReader in;
			in = new BufferedReader(new InputStreamReader(con.getInputStream()));

			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();

			//print result
			System.out.println(response.toString());

		} catch (IOException|NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}

    static String sha1(String input) throws NoSuchAlgorithmException {
		MessageDigest mDigest = MessageDigest.getInstance("SHA1");
		byte[] result = mDigest.digest(input.getBytes());
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < result.length; i++) {
			sb.append(Integer.toString((result[i] & 0xff) + 0x100, 16).substring(1));
		}

		return sb.toString();
    }
}
