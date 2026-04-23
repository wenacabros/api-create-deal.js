export default async function handler(req, res) {

  // ===== CORS =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    console.log("BODY:", body);

    const toNumber = (v) => v ? Number(v) : null;

    // =========================
    // 🧠 DESCRIPTION
    // =========================
    let description = `
=== DATOS GENERALES ===
Email: ${body.email || ""}
Referencia: ${body.referencia_negocio || ""}
Nombre: ${body.firstname || ""}
Razón social: ${body.razon_social_a_facturar_solicitud_intercompanias || ""}
Comentarios: ${body.comentarios_solicitud_intercompanias || ""}

=== ORIGEN ===
Dirección: ${body.origen_direccion_completa_solicitud_intercompanias || ""}
CP: ${body.origen_codigo_postal_solicitud_intercompanias || ""}
Remitente: ${body.origen_nombre_del_remitente_solicitud_intercompanias || ""}
RFC: ${body.origen_rfc_solicitud_intercompanias || ""}

=== DESTINO ===
Dirección: ${body.destino_direccion_completa_solicitud_intercompanias || ""}
CP: ${body.destino_codigo_postal_solicitud_intercompanias || ""}
Destinatario: ${body.destino_nombre_del_destinatario_solicitud_intercompanias || ""}
RFC: ${body.destino_rfc_solicitud_intercompanias || ""}

=== MERCANCÍA ===
`;

    const addArticulo = (n, d) => {
      if (!Object.values(d).some(v => v)) return;
      description += `
Artículo ${n}
- Clave: ${d.clave || ""}
- Descripción: ${d.desc || ""}
- Cantidad: ${d.cant || ""}
- Unidad: ${d.unidad || ""}
- Peso KG: ${d.peso || ""}
`;
    };

    // ARTICULOS
    addArticulo(1,{
      clave: body.mercancia_clave_sat_solicitud_intercompanias,
      desc: body.mercancia_descripcion_solicitud_intercompanias,
      cant: body.mercancia_cantidad_solicitud_intercompanias,
      unidad: body.mercancia_unidad_de_medida_solicitud_intercompanias,
      peso: body.mercancia_peso_total_en_kg_solicitud_intercompanias
    });

    addArticulo(2,{
      clave: body.mercancia___clave_sat_2__solicitud_intercompanias_,
      desc: body.mercancia___descripcion_2__solicitud_intercompanias_,
      cant: body.mercancia___cantidad_2__solicitud_intercompanias_,
      unidad: body.mercancia___unidad_de_medida_2__solicitud_intercompanias_,
      peso: body.mercancia___peso_total_en_kg_2__solicitud_intercompanias_
    });

    addArticulo(3,{
      clave: body.mercancia_clave_sat_3_solicitud_intercompanias,
      desc: body.mercancia_descripcion_3_solicitud_intercompanias,
      cant: body.mercancia_cantidad_3_solicitud_intercompanias,
      unidad: body.mercancia_unidad_de_medida_3_solicitud_intercompanias,
      peso: body.mercancia_peso_total_en_kg_3_solicitud_intercompanias
    });

    addArticulo(4,{
      clave: body.mercancia_clave_sat_4_solicitud_intercompanias,
      desc: body.mercancia_descripcion_4_solicitud_intercompanias,
      cant: body.mercancia_cantidad_4_solicitud_intercompanias,
      unidad: body.mercancia_unidad_de_medida_4_solicitud_intercompanias,
      peso: body.mercancia_peso_total_en_kg_4_solicitud_intercompanias
    });

    addArticulo(5,{
      clave: body.mercancia_clave_sat_5_solicitud_intercompanias,
      desc: body.mercancia_descripcion_5_solicitud_intercompanias,
      cant: body.mercancia_cantidad_5_solicitud_intercompanias,
      unidad: body.mercancia_unidad_de_medida_5_solicitud_intercompanias,
      peso: body.mercancia_peso_total_en_kg_5_solicitud_intercompanias
    });

    // =========================
    // 🔎 CONTACTO (PRIORIDAD: contactId)
    // =========================
    let contactId = body.contactId || null;

    // fallback por email
    if (!contactId && body.email) {
      const contactRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filterGroups: [{
            filters: [{
              propertyName: "email",
              operator: "EQ",
              value: body.email
            }]
          }]
        })
      });

      const contactData = await contactRes.json();

      if (contactData.results?.length) {
        contactId = contactData.results[0].id;
      }
    }

    console.log("CONTACT ID:", contactId);

    // =========================
    // 📦 PROPERTIES
    // =========================
    const properties = {

      dealname: `${body.referencia_negocio || "Sin ref"} / ${body.razon_social_a_facturar_solicitud_intercompanias || "Sin nombre"}`,
      pipeline: "13819751",
      dealstage: "13819752",
      hubspot_owner_id: "334240138",
      description,

      // GENERALES
      razon_social_a_facturar_solicitud_intercompanias: body.razon_social_a_facturar_solicitud_intercompanias,
      comentarios_solicitud_intercompanias: body.comentarios_solicitud_intercompanias,

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

      // ARTICULOS 2–5
      mercancia___clave_sat_2__solicitud_intercompanias_: body.mercancia___clave_sat_2__solicitud_intercompanias_,
      mercancia___descripcion_2__solicitud_intercompanias_: body.mercancia___descripcion_2__solicitud_intercompanias_,
      mercancia___cantidad_2__solicitud_intercompanias_: toNumber(body.mercancia___cantidad_2__solicitud_intercompanias_),
      mercancia___unidad_de_medida_2__solicitud_intercompanias_: body.mercancia___unidad_de_medida_2__solicitud_intercompanias_,
      mercancia___peso_total_en_kg_2__solicitud_intercompanias_: toNumber(body.mercancia___peso_total_en_kg_2__solicitud_intercompanias_),

      mercancia_clave_sat_3_solicitud_intercompanias: body.mercancia_clave_sat_3_solicitud_intercompanias,
      mercancia_descripcion_3_solicitud_intercompanias: body.mercancia_descripcion_3_solicitud_intercompanias,
      mercancia_cantidad_3_solicitud_intercompanias: toNumber(body.mercancia_cantidad_3_solicitud_intercompanias),
      mercancia_unidad_de_medida_3_solicitud_intercompanias: body.mercancia_unidad_de_medida_3_solicitud_intercompanias,
      mercancia_peso_total_en_kg_3_solicitud_intercompanias: toNumber(body.mercancia_peso_total_en_kg_3_solicitud_intercompanias),

      mercancia_clave_sat_4_solicitud_intercompanias: body.mercancia_clave_sat_4_solicitud_intercompanias,
      mercancia_descripcion_4_solicitud_intercompanias: body.mercancia_descripcion_4_solicitud_intercompanias,
      mercancia_cantidad_4_solicitud_intercompanias: toNumber(body.mercancia_cantidad_4_solicitud_intercompanias),
      mercancia_unidad_de_medida_4_solicitud_intercompanias: body.mercancia_unidad_de_medida_4_solicitud_intercompanias,
      mercancia_peso_total_en_kg_4_solicitud_intercompanias: toNumber(body.mercancia_peso_total_en_kg_4_solicitud_intercompanias),

      mercancia_clave_sat_5_solicitud_intercompanias: body.mercancia_clave_sat_5_solicitud_intercompanias,
      mercancia_descripcion_5_solicitud_intercompanias: body.mercancia_descripcion_5_solicitud_intercompanias,
      mercancia_cantidad_5_solicitud_intercompanias: toNumber(body.mercancia_cantidad_5_solicitud_intercompanias),
      mercancia_unidad_de_medida_5_solicitud_intercompanias: body.mercancia_unidad_de_medida_5_solicitud_intercompanias,
      mercancia_peso_total_en_kg_5_solicitud_intercompanias: toNumber(body.mercancia_peso_total_en_kg_5_solicitud_intercompanias)
    };

    // =========================
    // 🚀 CREATE DEAL
    // =========================
    const dealRes = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ properties })
    });

    const dealData = await dealRes.json();

    if (!dealRes.ok) {
      console.error("DEAL ERROR:", dealData);
      return res.status(dealRes.status).json(dealData);
    }

    const dealId = dealData.id;

    // =========================
    // 🔗 ASSOCIATION
    // =========================
    let associated = false;

    if (contactId) {
      const assocRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/deals/${dealId}/associations/contacts/${contactId}/deal_to_contact`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${process.env.HS_TOKEN}`
          }
        }
      );

      if (assocRes.ok) {
        associated = true;
      } else {
        const err = await assocRes.text();
        console.error("ASSOCIATION ERROR:", err);
      }
    }

    return res.status(200).json({
      success: true,
      dealId,
      contactId,
      associated
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
