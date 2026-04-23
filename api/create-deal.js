export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    // =========================
    // 🧠 BUILD DESCRIPTION FULL
    // =========================
    let description = `
=== DATOS GENERALES ===
Email: ${body.email || ""}
Referencia: ${body.referencia_negocio || ""}
Nombre: ${body.firstname || ""}
Razón social: ${body.razon_social_a_facturar_solicitud_intercompanias || ""}
Comentarios: ${body.comentarios_solicitud_intercompanias || ""}

=== ORIGEN ===
Dirección: ${body.origen_direccion_completa_solicitud_intercompanias || body.origen_direccion_completa || ""}
CP: ${body.origen_codigo_postal_solicitud_intercompanias || body.origen_codigo_postal || ""}
Remitente: ${body.origen_nombre_del_remitente_solicitud_intercompanias || body.origen_nombre_del_remitente || ""}
RFC: ${body.origen_rfc_solicitud_intercompanias || body.origen_rfc || ""}

=== DESTINO ===
Dirección: ${body.destino_direccion_completa_solicitud_intercompanias || ""}
CP: ${body.destino_codigo_postal_solicitud_intercompanias || ""}
Destinatario: ${body.destino_nombre_del_destinatario_solicitud_intercompanias || ""}
RFC: ${body.destino_rfc_solicitud_intercompanias || ""}

=== MERCANCÍA ===
`;

    // Helper limpio
    const addArticulo = (num, data) => {
      const hasData = Object.values(data).some(v => v);
      if (!hasData) return;

      description += `
Artículo ${num}:
- Clave SAT: ${data.clave || ""}
- Descripción: ${data.descripcion || ""}
- Cantidad: ${data.cantidad || ""}
- Unidad: ${data.unidad || ""}
- Peso KG: ${data.peso || ""}
`;
    };

    // ARTÍCULOS
    addArticulo(1, {
      clave: body.mercancia_clave_sat_solicitud_intercompanias,
      descripcion: body.mercancia_descripcion_solicitud_intercompanias,
      cantidad: body.mercancia_cantidad_solicitud_intercompanias,
      unidad: body.mercancia_unidad_de_medida_solicitud_intercompanias,
      peso: body.mercancia_peso_total_en_kg_solicitud_intercompanias
    });

    addArticulo(2, {
      clave: body.mercancia___clave_sat_2__solicitud_intercompanias_,
      descripcion: body.mercancia___descripcion_2__solicitud_intercompanias_,
      cantidad: body.mercancia___cantidad_2__solicitud_intercompanias_,
      unidad: body.mercancia___unidad_de_medida_2__solicitud_intercompanias_,
      peso: body.mercancia___peso_total_en_kg_2__solicitud_intercompanias_
    });

    addArticulo(3, {
      clave: body.mercancia_clave_sat_3_solicitud_intercompanias,
      descripcion: body.mercancia_descripcion_3_solicitud_intercompanias,
      cantidad: body.mercancia_cantidad_3_solicitud_intercompanias,
      unidad: body.mercancia_unidad_de_medida_3_solicitud_intercompanias,
      peso: body.mercancia_peso_total_en_kg_3_solicitud_intercompanias
    });

    addArticulo(4, {
      clave: body.mercancia_clave_sat_4_solicitud_intercompanias,
      descripcion: body.mercancia_descripcion_4_solicitud_intercompanias,
      cantidad: body.mercancia_cantidad_4_solicitud_intercompanias,
      unidad: body.mercancia_unidad_de_medida_4_solicitud_intercompanias,
      peso: body.mercancia_peso_total_en_kg_4_solicitud_intercompanias
    });

    addArticulo(5, {
      clave: body.mercancia_clave_sat_5_solicitud_intercompanias,
      descripcion: body.mercancia_descripcion_5_solicitud_intercompanias,
      cantidad: body.mercancia_cantidad_5_solicitud_intercompanias,
      unidad: body.mercancia_unidad_de_medida_5_solicitud_intercompanias,
      peso: body.mercancia_peso_total_en_kg_5_solicitud_intercompanias
    });

    // =========================
    // 📦 PAYLOAD
    // =========================
    const payload = {
      properties: {
        dealname: `Solicitud - ${body.razon_social_a_facturar_solicitud_intercompanias || "Sin nombre"}`,
        pipeline: "13819751",
        dealstage: "13819752",
        description: description,
        razon_social_a_facturar_solicitud_intercompanias: body.razon_social_a_facturar_solicitud_intercompanias
      }
    };

    // =========================
    // 🚀 HUBSPOT REQUEST
    // =========================
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating deal" });
  }
}
