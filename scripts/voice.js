const listenBtn = document.getElementById("listen-btn")

let listening = false
let recorder
let chunks = []

listenBtn.addEventListener("click", async () => {
  if (listening) {
    recorder.stop()
    listenBtn.textContent = "Start Listening"
    listening = false
    return
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  recorder = new MediaRecorder(stream)
  chunks = []

  recorder.ondataavailable = e => chunks.push(e.data)

  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "audio/webm" })
    const reader = new FileReader()

    reader.onloadend = async () => {
      try {

        const audio = reader.result.split(",")[1]

        const stt = await fetch("https://backend-production-79ea.up.railway.app/stt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio })
        })

        const { text } = await stt.json()

        const current = {
          document_type: document.getElementById("doc-type").textContent,
          full_name: document.getElementById("doc-name").textContent,
          address: document.getElementById("doc-address").textContent,
          expiration_date: document.getElementById("doc-exp").textContent
        }

        const fix = await fetch("https://backend-production-79ea.up.railway.app/correct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: text, current })
        })

        const { result } = await fix.json()

        if (result.document_type) document.getElementById("doc-type").textContent = result.document_type
        if (result.full_name) document.getElementById("doc-name").textContent = result.full_name
        if (result.address) document.getElementById("doc-address").textContent = result.address
        if (result.expiration_date) document.getElementById("doc-exp").textContent = result.expiration_date
      } catch (err) {
        console.error(err)
      }

    }

    reader.readAsDataURL(blob)
  }

  recorder.start()
  listenBtn.textContent = "Stop Listening"
  listening = true
})
