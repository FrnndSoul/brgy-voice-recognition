const scanBtn = document.getElementById("scan-btn")
const statusText = document.getElementById("scan-status")

const typeEl = document.getElementById("doc-type")
const nameEl = document.getElementById("doc-name")
const addressEl = document.getElementById("doc-address")
const expEl = document.getElementById("doc-exp")

scanBtn.addEventListener("click", async () => {
  if (!stream || cameraFeed.videoWidth === 0) return

  statusText.textContent = "Reading document"

  const canvas = document.createElement("canvas")
  canvas.width = cameraFeed.videoWidth
  canvas.height = cameraFeed.videoHeight
  canvas.getContext("2d").drawImage(cameraFeed, 0, 0)

  const image = canvas.toDataURL("image/jpeg")

  try {
    const res = await fetch("http://localhost:3000/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image })
    })

    const data = await res.json()
    const result = data.result || {}

    typeEl.textContent = result.document_type || "-"
    nameEl.textContent = result.full_name || "-"
    addressEl.textContent = result.address || "-"
    expEl.textContent = result.expiration_date || "-"
  } catch (err) {
    console.error(err)
  }

  statusText.textContent = "Waiting for document"
})
