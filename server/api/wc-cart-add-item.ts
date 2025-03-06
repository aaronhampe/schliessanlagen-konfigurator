import { defineEventHandler, readBody, getHeader } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // 🔥 POST-Daten auslesen
    const body = await readBody(event);

    // 🛒 WooCommerce-API-Endpunkt
    const woocommerceApiUrl = 'https://www.stt-shop.de/wp-json/custom/v1/add_to_cart';
  

    // 📦 Request-Payload
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

    // 🔍 Debugging: Request-Daten ausgeben
    console.log('📤 Sende folgende Daten an WooCommerce:', JSON.stringify(payload, null, 2));

    // 📨 Anfrage an WooCommerce senden
    const response = await $fetch(woocommerceApiUrl, {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        
      }
    });

    // ✅ Debug: API-Antwort anzeigen
    console.log('✅ WooCommerce API Response:', response);

    // 🎉 Erfolgreiche Antwort zurückgeben
    return {
      success: true,
      message: 'Produkt erfolgreich hinzugefügt',
      data: response,
      cookies: cookies // Zur Prüfung an den Client zurückgeben
    };
  } catch (error: any) {
    // ❌ Fehlerbehandlung
    console.error('❌ Fehler beim Hinzufügen:', error);

    return {
      success: false,
      message: 'Fehler beim Hinzufügen des Produkts',
      error: error?.data || error?.message || 'Unbekannter Fehler'
    };
  }
});
