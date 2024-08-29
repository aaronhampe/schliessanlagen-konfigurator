import fetch from 'node-fetch';

//const consumerKey = 'ck_bff7c09312f95a50c5629ff45c2194e7ed3a4afa';
//const consumerSecret = 'cs_772d8aaf443cfcaacd0569f5214c557a2c983058';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { productId, quantity, anlagennummer } = body;


  try {
    const nonce = await getNonce();

    console.log(nonce);
    console.log(productId);
    console.log(quantity);

    const url = 'https://www.stt-shop.de/wp-json/cocart/v2/cart/add-item';
    const data = {
      id: String(productId),
      quantity: String(quantity),
      item_data: {
        custom_price: String(500),
        anlagennummer: 'Testanlagennummer'
            }
    };

//console.log(data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    //console.log(JSON.stringify(data));
    //console.log(response);

    if (response.ok) {
      const responseData = await response.json();
      
      // Extrahiere den cart_key aus der Antwort
      const cartKey = responseData.cart_key;
      return cartKey;
      if (cartKey) {
        console.log('Cart Key:', cartKey);

        // Leite den Benutzer zur Warenkorbseite weiter mit dem cart_key
        return sendRedirect(event, `https://www.stt-shop.de/warenkorb/?cart_key=${cartKey}`);
      } else {
        throw new Error('Cart Key nicht in der Antwort gefunden');
      }
    } else {
      // Fehlerbehandlung
      const errorData = await response.json();
      console.error('Fehler beim Hinzufügen zum Warenkorb:', errorData);
      throw new Error('Fehler beim Hinzufügen zum Warenkorb');
    }
    
  } catch (error) {
    console.error('Fehler:', error);
    throw error;
  }
});

async function getNonce() {
  const response = await fetch('https://www.stt-shop.de/wp-json/my-nonce/v1/get-nonce');
  
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data; // Stelle sicher, dass die Nonce korrekt aus dem Antwortobjekt entnommen wird
}
