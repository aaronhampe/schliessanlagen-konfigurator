// server/api/add-to-cart.ts
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  // Hole die POST-Daten aus der Anfrage
  const body = await readBody(event);
  const cookies = document.cookie;

  // WooCommerce-API-Endpunkt
  const woocommerceApiUrl = 'https://www.stt-shop.de/wp-json/custom/v1/add_to_cart';
  const cookies = typeof document !== 'undefined' ? document.cookie : '';
  // Daten, die an WooCommerce-API gesendet werden (Artikel- und Adressdaten)
  const payload = {
    product_id: body.product_id,
    anlage_nummer: body.Anlage,
    price: body.price,
    quantity: body.quantity,
    config_text: body.config_text, 
    widerruf_accepted: body.widerruf_accepted,
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
        ...(cookies ? { 'Cookie': cookies } : {}) // Nur setzen, wenn Cookies vorhanden sind
      },
      credentials: 'include' // Wichtig für Session-Cookies
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
