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

    // 🔥 FIX BODY
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    console.log("BODY:", body);

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

    const add = (n, d) => {
      if (!Object.values(d).some(v => v)) return;
      description += `
Artículo ${n}
Clave: ${d.clave || ""}
Desc: ${d.desc || ""}
Cant: ${d.cant || ""}
Unidad: ${d.unidad || ""}
Peso: ${d.peso || ""}
`;
    };

    add(1,{
      clave: body.mercancia_clave_sat_solicitud_intercompanias,
      desc: body.mercancia_descripcion_solicitud_intercompanias,
      cant: body.mercancia_cantidad_solicitud_intercompanias,
      unidad: body.mercancia_unidad_de_medida_solicitud_intercompanias,
      peso: body.mercancia_peso_total_en_kg_solicitud_intercompanias
    });

    add(2,{
      clave: body.mercancia___clave_sat_2__solicitud_intercompanias_,
      desc: body.mercancia___descripcion_2__solicitud_intercompanias_,
      cant: body.mercancia___cantidad_2__solicitud_intercompanias_,
      unidad: body.mercancia___unidad_de_medida_2__solicitud_intercompanias_,
      peso: body.mercancia___peso_total_en_kg_2__solicitud_intercompanias_
    });

    // =========================
    // 🚀 HUBSPOT
    // =========================
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        properties: {
          dealname: `Solicitud - ${body.razon_social_a_facturar_solicitud_intercompanias}`,
          pipeline: "13819751",
          dealstage: "13819752",
          hubspot_owner_id: "334240138",
          description: description
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
