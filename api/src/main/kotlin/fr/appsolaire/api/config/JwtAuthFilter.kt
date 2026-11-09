package fr.appsolaire.api.config

import fr.appsolaire.api.service.JwtService
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthFilter(private val jwtService: JwtService) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val header = request.getHeader("Authorization")
        if (header != null && header.startsWith("Bearer ")) {
            try {
                val claims = jwtService.lireToken(header.removePrefix("Bearer ").trim())
                val role = claims["role"] as? String ?: "CLIENT"
                val authentification = UsernamePasswordAuthenticationToken(
                    claims.subject.toLong(),
                    null,
                    listOf(SimpleGrantedAuthority("ROLE_$role"))
                )
                SecurityContextHolder.getContext().authentication = authentification
            } catch (e: Exception) {
                SecurityContextHolder.clearContext()
            }
        }
        filterChain.doFilter(request, response)
    }
}