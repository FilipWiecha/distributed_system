package com.filipwiecha.gateway;

import java.io.ByteArrayInputStream;
import java.util.Locale;
import java.util.Map;

import org.springframework.cloud.gateway.server.mvc.common.MvcUtils;
import org.springframework.cloud.gateway.server.mvc.filter.BodyFilterFunctions;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import tools.jackson.databind.ObjectMapper;

import static org.springframework.cloud.gateway.server.mvc.filter.AfterFilterFunctions.modifyResponseBody;

public final class ClientTokenFilters {
    private static final String CLIENT_TYPE_HEADER = "X-Client-Type";

    private static final String REFRESH_COOKIE_PATH = "/api/auth";
    private static final String ACCESS_TOKEN_DOMAIN = ".mojprojekt.test";

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private ClientTokenFilters() {}

    public static HandlerFilterFunction<ServerResponse, ServerResponse> defaultTokensManagment() {
        return (request, next) -> {
            
            if ("WEB".equals(validateRequest(request))) {
                request = applyAuthenticationFromCookie(request);
            }
            
            return next.handle(request);
        };
    }

    public static HandlerFilterFunction<ServerResponse, ServerResponse> authEndpointTokensManagment() {
        var rewriteResponseForWeb = modifyResponseBody(
            Map.class, 
            Map.class, 
            MediaType.APPLICATION_JSON_VALUE,
            (request, response, body) -> {
                
                if (body == null || 
                    !(body.get("accessToken") instanceof String accessToken)|| 
                    !(body.get("refreshToken") instanceof String refreshToken)
                ) {
                    throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Authentication server didn't return tokens");
                }

                response.headers().add(
                    HttpHeaders.SET_COOKIE,
                    createCookie("refresh_token", refreshToken, REFRESH_COOKIE_PATH, "")
                );

                response.headers().add(
                    HttpHeaders.SET_COOKIE,
                    createCookie("access_token", accessToken, "/", ACCESS_TOKEN_DOMAIN)
                );

                response.headers().set(HttpHeaders.CACHE_CONTROL, "no-store");

                return Map.of();
            });

        return (request, next) -> {
            boolean web = "WEB".equals(validateRequest(request));
            boolean post = "POST".equals(request.method().name());

            boolean login = post && "/auth/login".equals(request.uri().getPath());
            boolean refresh = post && "/auth/refresh".equals(request.uri().getPath());
            boolean logout = post && "/auth/logout".equals(request.uri().getPath());
            boolean register = post && "/auth/register".equals(request.uri().getPath());
            boolean authResourse = !(login||refresh||logout||register);

            var refreshCookie = request.cookies().getFirst("refresh_token");

            if (web && (logout || authResourse)) {
                request = applyAuthenticationFromCookie(request);
            }

            if (login || refresh || register) {
                request = ServerRequest
                    .from(request)
                    .headers(headers -> headers.remove(HttpHeaders.AUTHORIZATION))
                    .build();
            }

            if (web) {
                request = ServerRequest
                    .from(request)
                    .headers(headers -> headers.remove(HttpHeaders.COOKIE))
                    .cookies(cookies -> cookies.clear())
                    .build();

                if (refresh || logout) {
                    if (refreshCookie == null || refreshCookie.getValue().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing refresh token");
                    }

                    request = applyRefreshTokenToBody(request, refreshCookie.getValue());
                }
            }

            ServerResponse response = next.handle(request);


            if (!web || !response.statusCode().is2xxSuccessful()) {
                
                if(refresh){
                    response = clearCookies(response);
                }
                
                return response;
            }

            if (logout) {
                response = clearCookies(response);
            }

            if (login || refresh) {
                return rewriteResponseForWeb.apply(request, response);
            }

            return response;
        };
    }

    private static ServerRequest applyAuthenticationFromCookie(ServerRequest request) {
        var cookie = request.cookies().getFirst("access_token");

        if (cookie == null || cookie.getValue().isBlank()) {
            return request;
        }

        return ServerRequest
            .from(request)
            .headers(headers -> headers.setBearerAuth(cookie.getValue()))
            .build();
    }

    private static ServerRequest applyRefreshTokenToBody(ServerRequest request, String token) {
        byte[] json = OBJECT_MAPPER.writeValueAsBytes(Map.of("refreshToken", token));

        request = ServerRequest
            .from(request)
            .headers(headers -> {
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.remove(HttpHeaders.TRANSFER_ENCODING);
                headers.setContentLength(json.length);
            })
            .build();

        MvcUtils.putAttribute(
            request, 
            MvcUtils.CACHED_REQUEST_BODY_ATTR,
            new ByteArrayInputStream(json)
        );

        return BodyFilterFunctions.adaptCachedBody().apply(request);
    }

    private static String validateRequest(ServerRequest request) {
        String value = request.headers().firstHeader(CLIENT_TYPE_HEADER);
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Specify X-Client-Type: APP or WEB");
        }

        String type = value.toUpperCase(Locale.ROOT);
        if (!"APP".equals(type) && !"WEB".equals(type)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Specify X-Client-Type: APP or WEB");
        }

        return type;
    }

    private static String createCookie(String name, String value, String path,  String domain) {
        return ResponseCookie
            .from(name, value)
            .httpOnly(true)
            .domain(domain)
            .path(path)
            .sameSite("Lax")
            .build()
            .toString();
    }

    private static String deleteCookie(String name, String path, String domain) {
        return ResponseCookie
            .from(name, "")
            .httpOnly(true)
            .domain(domain)
            .path(path)
            .sameSite("Lax")
            .maxAge(0)
            .build()
            .toString();
    }

    private static ServerResponse clearCookies(ServerResponse response){
        response.headers().add(
            HttpHeaders.SET_COOKIE,
            deleteCookie("access_token", "/", ACCESS_TOKEN_DOMAIN)
        );

        response.headers().add(
            HttpHeaders.SET_COOKIE,
            deleteCookie("refresh_token", REFRESH_COOKIE_PATH, "")
        );

        response.headers().set(HttpHeaders.CACHE_CONTROL, "no-store");

        return response;
    }
}

