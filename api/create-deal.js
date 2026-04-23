export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    // ===== VALIDACIÓN BÁSICA =====
    if (!body.razon_social_a_facturar_solicitud_intercompanias) {
      return res.status(400).json({ error: "Razón social requerida" });
    }

    // ===== HELPER PARA NUMBERS =====
    const toNumber = (val) => val ? Number(val) : null;

    // ===== PAYLOAD =====
    const payload = {
      properties: {
        dealname: `Solicitud - ${body.razon_social_a_facturar_solicitud_intercompanias || "Sin nombre"}`,

        // GENERALES
        razon_social_a_facturar_solicitud_intercompanias: body.razon_social_a_facturar_solicitud_intercompanias,
        comentarios_solicitud_intercompanias: body.comentarios_solicitud_intercompanias || "",

        // ORIGEN
        origen_direccion_completa_solicitud_intercompanias: body.origen_direccion_completa_solicitud_intercompanias,
        origen_codigo_postal_solicitud_intercompanias: body.origen_codigo_postal_solicitud_intercompanias,
        origen_nombre_del_remitente_solicitud_intercompanias: body.origen_nombre_del_remitente_solicitud_intercompanias,
        origen_rfc_solicitud_intercompanias: body.origen_rfc_solicitud_intercompanias,

        // DESTINO
        destino_direccion_completa_solicitud_intercompanias: body.destino_direccion_completa_solicitud_intercompanias,
        destino_codigo_postal_solicitud_intercompanias: body.destino_codigo_postal_solicitud_intercompanias,
        destino_nombre_del_destinatario_solicitud_intercompanias: body.destino_nombre_del_destinatario_solicitud_intercompanias,
        destino_rfc_solicitud_intercompanias: body.destino_rfc_solicitud_intercompanias,

        // ARTICULO 1
        mercancia_clave_sat_solicitud_intercompanias: body.mercancia_clave_sat_solicitud_intercompanias,
        mercancia_descripcion_solicitud_intercompanias: body.mercancia_descripcion_solicitud_intercompanias,
        mercancia_cantidad_solicitud_intercompanias: toNumber(body.mercancia_cantidad_solicitud_intercompanias),
        mercancia_unidad_de_medida_solicitud_intercompanias: body.mercancia_unidad_de_medida_solicitud_intercompanias,
        mercancia_peso_total_en_kg_solicitud_intercompanias: toNumber(body.mercancia_peso_total_en_kg_solicitud_intercompanias),

        // ARTICULO 2
        mercancia___clave_sat_2__solicitud_intercompanias_: body.mercancia___clave_sat_2__solicitud_intercompanias_,
        mercancia___descripcion_2__solicitud_intercompanias_: body.mercancia___descripcion_2__solicitud_intercompanias_,
        mercancia___cantidad_2__solicitud_intercompanias_: toNumber(body.mercancia___cantidad_2__solicitud_intercompanias_),
        mercancia___unidad_de_medida_2__solicitud_intercompanias_: body.mercancia___unidad_de_medida_2__solicitud_intercompanias_,
        mercancia___peso_total_en_kg_2__solicitud_intercompanias_: toNumber(body.mercancia___peso_total_en_kg_2__solicitud_intercompanias_),

        // ARTICULO 3
        mercancia_clave_sat_3_solicitud_intercompanias: body.mercancia_clave_sat_3_solicitud_intercompanias,
        mercancia_descripcion_3_solicitud_intercompanias: body.mercancia_descripcion_3_solicitud_intercompanias,
        mercancia_cantidad_3_solicitud_intercompanias: toNumber(body.mercancia_cantidad_3_solicitud_intercompanias),
        mercancia_unidad_de_medida_3_solicitud_intercompanias: body.mercancia_unidad_de_medida_3_solicitud_intercompanias,
        mercancia_peso_total_en_kg_3_solicitud_intercompanias: toNumber(body.mercancia_peso_total_en_kg_3_solicitud_intercompanias),

        // ARTICULO 4
        mercancia_clave_sat_4_solicitud_intercompanias: body.mercancia_clave_sat_4_solicitud_intercompanias,
        mercancia_descripcion_4_solicitud_intercompanias: body.mercancia_descripcion_4_solicitud_intercompanias,
        mercancia_cantidad_4_solicitud_intercompanias: toNumber(body.mercancia_cantidad_4_solicitud_intercompanias),
        mercancia_unidad_de_medida_4_solicitud_intercompanias: body.mercancia_unidad_de_medida_4_solicitud_intercompanias,
        mercancia_peso_total_en_kg_4_solicitud_intercompanias: toNumber(body.mercancia_peso_total_en_kg_4_solicitud_intercompanias),

        // ARTICULO 5
        mercancia_clave_sat_5_solicitud_intercompanias: body.mercancia_clave_sat_5_solicitud_intercompanias,
        mercancia_descripcion_5_solicitud_intercompanias: body.mercancia_descripcion_5_solicitud_intercompanias,
        mercancia_cantidad_5_solicitud_intercompanias: toNumber(body.mercancia_cantidad_5_solicitud_intercompanias),
        mercancia_unidad_de_medida_5_solicitud_intercompanias: body.mercancia_unidad_de_medida_5_solicitud_intercompanias,
        mercancia_peso_total_en_kg_5_solicitud_intercompanias: toNumber(body.mercancia_peso_total_en_kg_5_solicitud_intercompanias)
      }
    };

    // ===== REQUEST A HUBSPOT =====
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // ===== MANEJO REAL DE ERROR =====
    if (!response.ok) {
      console.error("HubSpot error:", data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Error creating deal" });
  }
}
