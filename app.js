const filterBox = document.querySelector(".filters")
const presetBox = document.querySelector(".preset-box")
const imageCanvas = document.querySelector(".image-canvas")
const canvasCtx = imageCanvas.getContext("2d")
const imgInput = document.querySelector("#image-input")
const imagePlaceholder = document.querySelector(".placeholder")
const resetBtn = document.querySelector("#reset-btn")
const downloadBtn = document.querySelector('#download-btn')
imageCanvas.style.display = "none"
let file = null
let image = null

let filterRanges = {
  brightness:  { min: 0, max: 200, value: 100, unit: '%' },
  contrast:    { min: 0, max: 200, value: 100, unit: '%' },
  saturation:  { min: 0, max: 200, value: 100, unit: '%' },
  hueRotation: { min: 0, max: 360, value: 0,   unit: 'deg' },
  blur:        { min: 0, max: 20,  value: 0,   unit: 'px' },
  grayscale:   { min: 0, max: 100, value: 0,   unit: '%' },
  sepia:       { min: 0, max: 100, value: 0,   unit: '%' },
  opacity:     { min: 0, max: 100, value: 100, unit: '%' },
  invert:      { min: 0, max: 100, value: 0,   unit: '%' }
};

const presets = {
  vintage: {
    brightness: 110,
    contrast: 105,
    saturation: 90,
    hueRotation: -10,
    blur: 0,
    grayscale: 10,
    sepia: 30,
    opacity: 100,
    invert: 0
  },

  vivid: {
    brightness: 110,
    contrast: 120,
    saturation: 150,
    hueRotation: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    opacity: 100,
    invert: 0
  },

  faded: {
    brightness: 105,
    contrast: 85,
    saturation: 70,
    hueRotation: 0,
    blur: 0,
    grayscale: 0,
    sepia: 10,
    opacity: 90,
    invert: 0
  },

  cyberpunk: {
    brightness: 120,
    contrast: 130,
    saturation: 180,
    hueRotation: 25,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    opacity: 100,
    invert: 0
  },

  moody: {
    brightness: 95,
    contrast: 125,
    saturation: 80,
    hueRotation: -5,
    blur: 0,
    grayscale: 15,
    sepia: 0,
    opacity: 100,
    invert: 0
  },

  dreamy: {
    brightness: 115,
    contrast: 90,
    saturation: 120,
    hueRotation: 10,
    blur: 2,
    grayscale: 0,
    sepia: 5,
    opacity: 95,
    invert: 0
  }
}


function createFilterElement(name,unit = "%",value,min,max){
  const div = document.createElement("div")
  div.classList.add("filter")

  const input = document.createElement("input")
  input.type = "range"
  input.min = min
  input.max = max
  input.value = value
  input.id = name

  const p = document.createElement("p")
  p.innerText = name

  div.append(p)
  div.append(input)

  input.addEventListener("input",()=>{
    filterRanges[name].value = input.value
    applyFilters()
  })

  return div
}

function fillFilters (){
  Object.keys(filterRanges).forEach(key => {
  const filterElement = createFilterElement(key,filterRanges[key].unit,filterRanges[key].value, filterRanges[key].min, filterRanges[key].max)
  filterBox.appendChild(filterElement)
})
}

fillFilters()


imgInput.addEventListener("change", (event)=>{

  file = event.target.files[0]
  imagePlaceholder.style.display = "none"
  imageCanvas.style.display = "block"

  const img = new Image()
  img.src = URL.createObjectURL(file);

  img.onload = () => {

    image = img

    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    canvasCtx.drawImage(img,0,0)
  }
})

function applyFilters(){
  if (!image) return

  canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height)
  canvasCtx.filter = `
    brightness(${filterRanges.brightness.value}%)
    contrast(${filterRanges.contrast.value}%)
    saturate(${filterRanges.saturation.value}%)
    hue-rotate(${filterRanges.hueRotation.value}deg)
    blur(${filterRanges.blur.value}px)
    grayscale(${filterRanges.grayscale.value}%)
    sepia(${filterRanges.sepia.value}%)
    opacity(${filterRanges.opacity.value}%)
    invert(${filterRanges.invert.value}%)
  `
  canvasCtx.drawImage(image,0,0)
}

resetBtn.addEventListener("click",()=>{
  filterRanges = {
  brightness:  { min: 0, max: 200, value: 100, unit: '%' },
  contrast:    { min: 0, max: 200, value: 100, unit: '%' },
  saturation:  { min: 0, max: 200, value: 100, unit: '%' },
  hueRotation: { min: 0, max: 360, value: 0,   unit: 'deg' },
  blur:        { min: 0, max: 20,  value: 0,   unit: 'px' },
  grayscale:   { min: 0, max: 100, value: 0,   unit: '%' },
  sepia:       { min: 0, max: 100, value: 0,   unit: '%' },
  opacity:     { min: 0, max: 100, value: 100, unit: '%' },
  invert:      { min: 0, max: 100, value: 0,   unit: '%' }}

  applyFilters()
  filterBox.innerHTML = ""
  fillFilters()
})

downloadBtn.addEventListener("click",()=>{
  const link = document.createElement("a")
  link.download = "edited-image-png"
  link.href = imageCanvas.toDataURL()
  link.click()
})

Object.keys(presets).forEach(key => {
  const presetButton = document.createElement("button")
  presetButton.classList.add("btn")
  presetButton.innerText = key
  presetBox.appendChild(presetButton)

  presetButton.addEventListener("click",()=>{
    const Preset = presets[key]
    console.log(Preset)
    Object.keys(Preset).forEach(filter => {
      filterRanges[filter].value = Preset[filter]
      document.getElementById(filter).value = Preset[filter]

    })
    applyFilters()
  })
})