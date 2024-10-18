// server/api/add-to-cart.ts
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  // Hole die POST-Daten aus der Anfrage
  const body = await readBody(event);

  // WooCommerce-API-Endpunkt
  const woocommerceApiUrl = 'https://www.stt-shop.de/wp-json/custom/v1/add_to_cart';

  // Daten, die an WooCommerce-API gesendet werden (Artikel- und Adressdaten)
  const payload = {
    product_id: body.product_id,
    anlage_nummer: body.Anlagennummer,
    price: body.price,
    quantity: body.quantity,
    billing_first_name: body.billing_first_name,
    billing_last_name: body.billing_last_name,
    billing_address_1: body.billing_address_1,
    billing_city: body.billing_city,
    billing_postcode: body.billing_postcode,
    billing_country: body.billing_country,
    billing_email: body.billing_email
  };

  try {
    // Anfrage an WooCommerce-API senden
    const response = await $fetch(woocommerceApiUrl, {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        // Falls WooCommerce eine Authentifizierung benötigt, z.B. mit Basic Auth:
        // Authorization: 'Basic ' + btoa('consumer_key:consumer_secret')
      }
    });
console.log(response);
    // WooCommerce API-Antwort zurückgeben
    return {
      success: true,
      message: 'Produkt erfolgreich hinzugefügt',
      data: response
    };
  } catch (error) {
    // Fehlerbehandlung
    return {
      success: false,
      message: 'Fehler beim Hinzufügen des Produkts',
      error: error
    };
  }
});
