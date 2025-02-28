export default defineEventHandler((event) => {
    // Setze CORS-Header
    setResponseHeaders(event, {
      "Access-Control-Allow-Origin": "*", // Erlaubt alle Domains (ändern für Sicherheit)
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
  
    // OPTIONS-Requests direkt beantworten (Preflight)
    if (getMethod(event) === "OPTIONS") {
      event.node.res.statusCode = 204; // No Content
      return "";
      //bla
    }
  });
  