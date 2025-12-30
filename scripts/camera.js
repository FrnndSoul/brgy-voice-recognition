const cameraBtn = document.getElementById("camera-btn")
const cameraFeed = document.getElementById("camera-feed")

let stream = null

cameraBtn.addEventListener("click", async () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
    cameraFeed.style.display = "none"
    cameraBtn.textContent = "Open Camera"
    cameraFeed.classList.add("active")
    return
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    cameraFeed.srcObject = stream
    cameraFeed.style.display = "block"
    cameraBtn.textContent = "Close Camera"
    cameraFeed.classList.remove("active")
  } catch {
    alert("Camera unavailable")
  }
})
