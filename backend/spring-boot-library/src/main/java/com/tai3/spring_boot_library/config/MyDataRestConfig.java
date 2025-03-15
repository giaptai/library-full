package com.tai3.spring_boot_library.config;

import com.tai3.spring_boot_library.model.Book;
import com.tai3.spring_boot_library.model.Message;
import com.tai3.spring_boot_library.model.Review;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    private final String theAllowedOrigins = "http://localhost:5173";
    private final String theAllowedSecureOrigins = "https://localhost:5173";

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
                                                     CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions = {
                HttpMethod.POST,
                HttpMethod.PATCH,
                HttpMethod.DELETE,
                HttpMethod.PUT
        };
        //Set the list of domain types for which we will expose the ID value as a normal property.
        config.exposeIdsFor(Book.class, Review.class, Message.class);

        disableHttpMethods(Book.class, config, theUnsupportedActions);
        disableHttpMethods(Review.class, config, theUnsupportedActions);
        disableHttpMethods(Message.class, config, theUnsupportedActions);

        /*Configure CORS Mapping*/
        cors.addMapping(config.getBasePath() + "/**")
                .allowedOrigins(theAllowedOrigins,theAllowedSecureOrigins);
    }

    private void disableHttpMethods(Class<?> theClass,
                                    RepositoryRestConfiguration config,
                                    HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure(
                        (metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)
                )
                .withCollectionExposure(
                        (metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)
                );
    }
}
