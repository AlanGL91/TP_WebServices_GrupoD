package com.grupo_d_c2_2026_unla.rentar.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;

/**
 * Validador de conexión a MySQL al arrancar la aplicación.
 * Muestra en consola de forma clara y destacada si la base de datos MySQL conectó exitosamente
 * o si ocurrió un error (junto con la causa exacta y recomendaciones para solucionarlo).
 */
@Configuration
public class DatabaseConnectionChecker {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConnectionChecker.class);

    @Bean
    @Order(1) // Se ejecuta en primer lugar al iniciar
    public CommandLineRunner verifyDatabaseConnection(DataSource dataSource) {
        return args -> {
            System.out.println("\n================================================================================");
            System.out.println(">>> COMPROBANDO CONEXIÓN A BASE DE DATOS MYSQL (Rentar)...");
            System.out.println("================================================================================");

            try (Connection connection = dataSource.getConnection()) {
                if (connection != null && !connection.isClosed()) {
                    DatabaseMetaData metaData = connection.getMetaData();
                    String dbProductName = metaData.getDatabaseProductName();
                    String dbProductVersion = metaData.getDatabaseProductVersion();
                    String url = metaData.getURL();
                    String userName = metaData.getUserName();

                    System.out.println("✅ [CONEXIÓN EXITOSA A MYSQL]");
                    System.out.println("   - Motor: " + dbProductName + " v" + dbProductVersion);
                    System.out.println("   - Catálogo / Base: " + connection.getCatalog());
                    System.out.println("   - URL: " + url);
                    System.out.println("   - Usuario: " + userName);
                    System.out.println("   - Estado: ONLINE y LISTO para operar.");
                    System.out.println("================================================================================\n");
                }
            } catch (SQLException e) {
                System.err.println("\n❌ [ERROR GRAVE: NO SE PUDO CONECTAR A MYSQL]");
                System.err.println("   - Causa: " + e.getMessage());
                System.err.println("   - Código de error SQL: " + e.getErrorCode());
                System.err.println("   - Estado SQL: " + e.getSQLState());
                System.err.println("--------------------------------------------------------------------------------");
                System.err.println("👉 RECOMENDACIONES:");
                System.err.println("   1. Verifica que MySQL Server esté corriendo en tu Mac (ej: `brew services list` o MySQL Workbench).");
                System.err.println("   2. Asegúrate de haber ejecutado el script 'Proyecto/BD/RentarBD.sql' para crear el schema 'Rentar'.");
                System.err.println("   3. Revisa usuario y clave en 'src/main/resources/application.properties'.");
                System.err.println("================================================================================\n");
            }
        };
    }
}
