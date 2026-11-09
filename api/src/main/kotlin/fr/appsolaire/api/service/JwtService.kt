package fr.appsolaire.api.service

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.Date

@Service
class JwtService(
    @Value("\${app.jwt.secret}") secret: String,
    @Value("\${app.jwt.expiration-minutes}") private val expirationMinutes: Long
) {

    private val key = Keys.hmacShaKeyFor(secret.toByteArray())

    fun genererToken(userId: Long, email: String, role: String = "CLIENT"): String {
        val maintenant = Instant.now()
        return Jwts.builder()
            .subject(userId.toString())
            .claim("email", email)
            .claim("role", role)
            .issuedAt(Date.from(maintenant))
            .expiration(Date.from(maintenant.plusSeconds(expirationMinutes * 60)))
            .signWith(key)
            .compact()
    }

    fun lireToken(token: String): Claims =
        Jwts.parser().verifyWith(key).build().parseSignedClaims(token).payload
}