import sharp from "sharp"

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="104" fill="#f8f4e8"/>
  <path
    d="M107 250c0-94 68-164 164-166 96-2 156 65 160 155 5 98-66 174-162 178-104 4-162-67-162-167z"
    fill="#f8f4e8"
    stroke="#1f1f1f"
    stroke-width="22"
    stroke-linejoin="round"
  />
  <circle cx="203" cy="217" r="15" fill="#1f1f1f"/>
  <circle cx="319" cy="211" r="14" fill="#1f1f1f"/>
  <path
    d="M145 277c30 64 82 91 130 86 48-4 84-34 110-91"
    fill="none"
    stroke="#1f1f1f"
    stroke-width="20"
    stroke-linecap="round"
  />
</svg>`

await sharp(Buffer.from(svg)).png().toFile("quartz/static/icon.png")
