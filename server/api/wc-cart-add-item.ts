import { defineEventHandler, readBody, getHeader } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // 🔥 POST-Daten auslesen
    const body = await readBody(event);

    // 🛒 CoCart-API-Endpunkt (Beispiel-URL)
    const cocartApiUrl = 'https://www.stt-shop.de/wp-json/cocart/v2/add-item';

    // 🍪 Cookies auslesen
    const cookies = getHeader(event, 'cookie') || '';
    console.log('🔍 Empfangene Cookies:', cookies);

    // 📦 Request-Payload für CoCart
    const payload = {
      product_id: body.product_id, // Produkt-ID
      quantity: body.quantity || 1, // Menge (Standard: 1)
      variation_id: body.variation_id || 0, // Variations-ID (falls zutreffend)
      cart_item_data: {
        config_text: body.config_text, // Benutzerdefinierte Daten
        widerruf_accepted: body.widerruf_accepted, // Widerrufsrecht akzeptiert
      },
      billing_info: { // Rechnungsinformationen (falls benötigt)
        first_name: body.billing_first_name,
        last_name: body.billing_last_name,
        address_1: body.billing_address_1,
        city: body.billing_city,
        postcode: body.billing_postcode,
        country: body.billing_country,
        email: body.billing_email,
      },
    };

    // 🔍 Debugging: Request-Daten ausgeben
    console.log('📤 Sende folgende Daten an CoCart:', JSON.stringify(payload, null, 2));

    // 📨 Anfrage an CoCart senden
    const response = await $fetch(cocartApiUrl, {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies, // Cookies für die Session-Übermittlung
      },
      credentials: 'include', // Wichtig für Session-Cookies
    });

    // ✅ Debug: API-Antwort anzeigen
    console.log('✅ CoCart API Response:', response);

    // 🎉 Erfolgreiche Antwort zurückgeben
    return {
      success: true,
      message: 'Produkt erfolgreich zum Warenkorb hinzugefügt',
      data: response,
      cookies: cookies, // Zur Prüfung an den Client zurückgeben
    };
  } catch (error: any) {
    // ❌ Fehlerbehandlung
    console.error('❌ Fehler beim Hinzufügen zum Warenkorb:', error);

    return {
      success: false,
      message: 'Fehler beim Hinzufügen des Produkts zum Warenkorb',
      error: error?.data || error?.message || 'Unbekannter Fehler',
    };
  }
});