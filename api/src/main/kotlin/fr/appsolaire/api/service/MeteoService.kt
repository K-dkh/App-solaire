package fr.appsolaire.api.service

import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate
import org.springframework.web.server.ResponseStatusException
import java.time.Duration
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap

data class IrradiationJour(val date: String, val kwhParM2: Double)

@Service
class MeteoService {

    private data class EntreeCache(val horodatage: Instant, val valeurs: List<IrradiationJour>)

    private val restTemplate = RestTemplate()
    private val cache = ConcurrentHashMap<String, EntreeCache>()
    private val dureeCache = Duration.ofHours(3)

    /** Irradiation des 7 prochains jours (kWh/m²/jour), mise en cache 3 h par position. */
    fun irradiationPrevisions(latitude: Double, longitude: Double): List<IrradiationJour> {
        val cle = "$latitude,$longitude"
        val existant = cache[cle]
        if (existant != null && Duration.between(existant.horodatage, Instant.now()) < dureeCache) {
            return existant.valeurs
        }
        val valeurs = appelerOpenMeteo(latitude, longitude)
        cache[cle] = EntreeCache(Instant.now(), valeurs)
        return valeurs
    }

    private fun appelerOpenMeteo(latitude: Double, longitude: Double): List<IrradiationJour> {
        val url = "https://api.open-meteo.com/v1/forecast" +
                "?latitude=$latitude&longitude=$longitude" +
                "&daily=shortwave_radiation_sum&timezone=auto&forecast_days=7"
        try {
            val reponse = restTemplate.getForObject(url, Map::class.java)
                ?: throw IllegalStateException("Réponse Open-Meteo vide")
            val daily = reponse["daily"] as Map<*, *>
            val dates = daily["time"] as List<*>
            val mj = daily["shortwave_radiation_sum"] as List<*>

            // Open-Meteo donne des MJ/m² ; 1 kWh = 3,6 MJ
            return dates.indices.map { i ->
                IrradiationJour(dates[i].toString(), (mj[i] as Number).toDouble() / 3.6)
            }
        } catch (e: RestClientException) {
            throw ResponseStatusException(HttpStatus.BAD_GATEWAY, "Service météo indisponible")
        }
    }
}