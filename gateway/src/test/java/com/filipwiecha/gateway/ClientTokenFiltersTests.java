package com.filipwiecha.gateway;

import java.nio.charset.StandardCharsets;
import java.util.List;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayServerResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import static org.junit.jupiter.api.Assertions.*;

class ClientTokenFiltersTests {
    private ServerRequest request(String path) {
        var servlet = new MockHttpServletRequest("POST", path);
        servlet.addHeader("X-Client-Type", "WEB");
        servlet.addHeader(HttpHeaders.COOKIE, "access_token=access; refresh_token=refresh");
        servlet.addHeader(HttpHeaders.AUTHORIZATION, "Bearer old");
        servlet.setCookies(new Cookie("access_token", "access"),
            new Cookie("refresh_token", "refresh"));
        servlet.setContent("{\"username\":\"alice\"}".getBytes(StandardCharsets.UTF_8));
        return BeforeFilterFunctions.stripPrefix(1).apply(ServerRequest.create(servlet, List.of()));
    }

    @Test
    void logoutForwardsTokensAndExpiresCookiesWithoutParsingEmptyResponse() throws Exception {
        var response = ClientTokenFilters.authEndpointTokensManagment().filter(
            request("/api/auth/logout"), forwarded -> {
                assertEquals("/auth/logout", forwarded.uri().getPath());
                assertEquals("Bearer access", forwarded.headers().firstHeader(HttpHeaders.AUTHORIZATION));
                assertNull(forwarded.headers().firstHeader(HttpHeaders.COOKIE));
                assertEquals("{\"refreshToken\":\"refresh\"}", new String(
                    forwarded.servletRequest().getInputStream().readAllBytes(), StandardCharsets.UTF_8));
                return GatewayServerResponse.status(200).build();
            });
        var cookies = response.headers().get(HttpHeaders.SET_COOKIE);
        assertNotNull(cookies);
        assertEquals(2, cookies.size());
        assertTrue(cookies.stream().anyMatch(c -> c.startsWith("access_token=;")
            && c.contains("Path=/;") && c.contains("Max-Age=0")));
        assertTrue(cookies.stream().anyMatch(c -> c.startsWith("refresh_token=;")
            && c.contains("Path=/api/auth;") && c.contains("Max-Age=0")));
    }

    @Test
    void failedLogoutDoesNotDeleteCookies() throws Exception {
        var response = ClientTokenFilters.authEndpointTokensManagment().filter(
            request("/api/auth/logout"), forwarded -> ServerResponse.status(401).build());
        assertEquals(401, response.statusCode().value());
        assertNull(response.headers().get(HttpHeaders.SET_COOKIE));
    }

    @Test
    void refreshDoesNotForwardExpiredAccessToken() throws Exception {
        ClientTokenFilters.authEndpointTokensManagment().filter(
            request("/api/auth/refresh"), forwarded -> {
                assertNull(forwarded.headers().firstHeader(HttpHeaders.AUTHORIZATION));
                assertEquals("{\"refreshToken\":\"refresh\"}", new String(
                    forwarded.servletRequest().getInputStream().readAllBytes(), StandardCharsets.UTF_8));
                return ServerResponse.status(401).build();
            });
    }

    @Test
    void loginAndRegistrationPreserveOriginalBody() throws Exception {
        for (String path : List.of("/api/auth/login", "/api/auth/register")) {
            ClientTokenFilters.authEndpointTokensManagment().filter(request(path), forwarded -> {
                assertNull(forwarded.headers().firstHeader(HttpHeaders.AUTHORIZATION));
                assertNull(forwarded.headers().firstHeader(HttpHeaders.COOKIE));
                assertEquals("{\"username\":\"alice\"}", new String(
                    forwarded.servletRequest().getInputStream().readAllBytes(), StandardCharsets.UTF_8));
                return ServerResponse.status(400).build();
            });
        }
    }
}

