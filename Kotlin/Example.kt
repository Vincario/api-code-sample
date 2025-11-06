// Sign up at https://vincario.com/create-account/ and request API keys
// See API documentation at https://vincario.com/api-docs/3.2/

//DEPENDENCY in BuildGradle(module)
//Coroutines
//implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.5.2-native-mt'
//implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.5.2-native-mt'
//Retrofit
//implementation 'com.squareup.retrofit2:retrofit:2.9.0'
//implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
//implementation 'com.squareup.okhttp3:logging-interceptor:5.0.0-alpha.2'
//implementation 'com.jakewharton.retrofit:retrofit2-kotlin-coroutines-adapter:0.9.2'

//API
interface VINDecoderApi {
    //Info request                                      //Decode request
    @GET("3.2/{api}/{control}/decode/info/{vin}.json") // @GET("3.2/{api}/{control}/decode/{vin}.json")
    suspend fun vinCheck(
        @Path("api") api: String,
        @Path("control") control: String,
        @Path("vin") vin: String                         //Decode request
    ): InfoDataModel                                    // DecodeDataModel
}

//API factory
object VINDecoderApiFactory {

    fun create(): VINDecoderApi =
        Retrofit.Builder()
            .baseUrl("https://api.vincario.com/")
            .addCallAdapterFactory(CoroutineCallAdapterFactory())
            .addConverterFactory(GsonConverterFactory.create(GsonBuilder().create()))
            .build()
            .create(VINDecoderApi::class.java)
}

//POJO
//Info request data model
data class InfoDataModel (
    @field:SerializedName("decode") var decode : List<String>
)

//POJO
//Decode request data model
data class DecodeDataModel(

    @field:SerializedName("decode") var decode : List<Decode>
)

data class Decode (

    @field:SerializedName("label") val label : String,
    @field:SerializedName("value") val value : Any
)
