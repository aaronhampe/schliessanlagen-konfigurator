import { defineEventHandler, readBody } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Überprüfen, ob die 'billing' und 'shipping' Daten vorhanden sind
  if (!body.billing || !body.shipping) {
    throw new Error('Billing and shipping details are required.')
  }

  const orderData = {
    payment_method: body.payment_method || 'paypal', // oder andere Standard-Zahlungsmethode
    payment_method_title: body.payment_method_title || 'Paypal',
    set_paid: body.set_paid || false,
    line_items: body.line_items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity
    })),
    billing: {
      first_name: body.billing.first_name,
      last_name: body.billing.last_name,
      address_1: body.billing.address_1,
      city: body.billing.city,
      postcode: body.billing.postcode,
      country: body.billing.country,
      email: body.billing.email,
      phone: body.billing.phone
    },
    shipping: {
      first_name: body.shipping.first_name,
      last_name: body.shipping.last_name,
      address_1: body.shipping.address_1,
      city: body.shipping.city,
      postcode: body.shipping.postcode,
      country: body.shipping.country
    }
  }

  // Optional: Überprüfen, ob die orderData korrekt ist
  console.log('Order Data:', orderData)
  const { data } = await axios.post('https://www.stt-shop.de/wp-json/wc/v3/orders', orderData, {
    auth: {
      username: 'ck_1dd23f0bac94651fa89f6b91f4391133ba933131',
      password: 'cs_39933ec17b86234e8d3c9b893bb2679d49f53881'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return data
})
