import express from "express"
import fetch from "node-fetch"

const app = express()
app.use(express.json({ limit: "10mb" }))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  next()
})

app.options("/scan", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  res.setHeader("Access-Control-Allow-Methods", "POST")
  res.sendStatus(200)
})

app.post("/scan", async (req, res) => {
  const base64 = req.body.image?.split(",")[1]
  if (!base64) return res.json({ result: {} })

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=AIzaSyCJvjOAclLivayO6Ravu8LP2TyMuXE8K3M",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [
            { text: "Identify document type, full name, address, expiration date. Return JSON only." },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64
              }
            }
          ]
        }]
      })
    }
  )

  const raw = await response.json()
  console.log(JSON.stringify(raw, null, 2))

  const text = raw.candidates?.[0]?.content?.parts?.[0]?.text || "{}"

  try {
    res.json({ result: JSON.parse(text.replace(/```json|```/g, "").trim()) })
  } catch {
    res.json({ result: {} })
  }
})

app.listen(3000, () => console.log("Scanner backend running on port 3000"))
