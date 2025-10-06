"use client"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet"
import "./App.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import * as L from "leaflet"
import "leaflet/dist/leaflet.css"

const defaultIcon = L.icon({
  iconUrl:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOzSURBVFiFtZhLaBxVGIW/e2dSSTQxCZo0aqzRRDAaFRVEQRBBBEGhUBFEEBcuXLhw5UpwIYILFy5cuHDhQhAXIohQEBEUH4iKj0SNj5jEJE2TZJLMTGbmXhczSWrSZDLTmT/c1b3n3PO/c+65/z0wYjQajWnADmAncBfQDEwCJgAXgQvAGeAE8BXwcblcPjVqkEajMQV4HHgU2A7MBq4BfUAXcBnwgElAE9AKzAXuBu4BtgCfAB+Uy+WuoYI0Go1pwMvAi8Ak4BfgQ+Bb4GS5XO4ZwmcjsAl4AHgKmA98BLxWLpf/GhCk0WhMAV4BXgKuAe8D75TL5fOjCQ4gIjOBZ4HngRbgXeClcrl8pV+QRqMxHXgDeAb4E3i5XC5/M5aAg4jIXOBN4EngXeD5crl8qV+QRqMxA/gYuB94pVwuvzfegP0RkXnAJ8BG4IlyufxNvyDtwCfASeChcrl8YbxB+iMiC4AvgT+AreVy+Wy/IIuBH4Hd5XL5q3GH+x8RWQocAnaXy+Wv+wW5G/gO2FEul38Yd7j/EZHlwPfAznK5fKRfkM3AYWBruVw+Oe5w/yMiK4EjwJZyuXy8X5D1wGFgXblcPjXucP8jIquBw8C6crn8S78grcBRYHW5XD4z7nD/IyJrgKPAqnK5fLZfkOnAcWBFuVzuHHe4/xGRdcBxYHm5XD7XL8hE4BdgSblc/nPc4f5HRDYAvwJLy+Xy+X5BPPALsLhcLv8+7nD/IyKbgF+AxeVy+UK/IB5wDFhYLpf/GHe4/xGRzcAxYEG5XL7YL4gHHAXml8vlv8cd7n9EZCtwFFhQLpf/7hfEAw4Dc8vl8j/jDvc/IrIdOATMLZfLl/oF8YADwJxyuXx13OH+R0R2AAeB2eVy+XK/IB7wOTCrXC5fHXe4/xGRncDnwMxyudzVL4gHfAbMLJfL18Yd7n9EZBfwKTCjXC539wviAZ8AM8rlcs+4w/2PiOwGPgaml8vlnn5BPOAjYFq5XO4dd7j/EZE9wIfA1HK53NcviAd8AEwpl8vXxx3uf0RkL/A+MLlcLvf1C+IB7wGTy+Vy/7jD/Y+I7APeASaVy+Ub/YJ4wNvApHK5fHPc4f5HRPYDbwGN5XL51oAgHvAmMKFcLt8ed7j/EZEDwOtAQ7lcvjMgiAe8BtTL5fKdcYf7HxE5CLwK1Mvl8t0BQTzgFaBWLpfvjTvc/4jIIeBlYEK5XP4XOQ3Ycmvt5UYAAAAASUVORK5CYII=",
  shadowUrl:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Icon.Default.mergeOptions({
  iconUrl: defaultIcon.options.iconUrl,
  iconRetinaUrl: defaultIcon.options.iconRetinaUrl,
  shadowUrl: defaultIcon.options.shadowUrl,
})

const asteroidSvg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
  <g>
    <ellipse cx='33' cy='24' rx='18' ry='12' fill='%23b89a6f' />
    <path d='M12 32c4-8 16-14 25-8s18 18 10 26-28 8-34 0-5-14-1-18z' fill='%23806b4b' opacity='0.9'/>
    <circle cx='24' cy='20' r='2.5' fill='%23fff' opacity='0.9' />
    <circle cx='40' cy='28' r='2' fill='%23ffd27f' opacity='0.9' />
  </g>
</svg>
`

const asteroidIcon = L.icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(asteroidSvg)}`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

function buildApiUrl(startDate, endDate) {
  return `/api/nasa/meteors?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`
}

const densityTemplates = {
  "Zona Rural": 50,
  "Subúrbio": 500,
  "Área Urbana": 2000,
  "Metrópole Densa": 10000,
}

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [meteors, setMeteors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const today = new Date().toISOString().slice(0, 10)
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [hazardousOnly, setHazardousOnly] = useState(false)

  const [selectedMeteor, setSelectedMeteor] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)

  const [userVelocity, setUserVelocity] = useState(20000)
  const [userAngle, setUserAngle] = useState(45)
  const [userDensity, setUserDensity] = useState(3000)

  const [simulationResults, setSimulationResults] = useState(null)
  const [populationData, setPopulationData] = useState(null)

  const meteorSectionRef = useRef(null)
  const mapSectionRef = useRef(null)
  const resultsSectionRef = useRef(null)

  const [selectedDensityTemplate, setSelectedDensityTemplate] = useState("Subúrbio")
  const [customDensity, setCustomDensity] = useState(500)
  const isCustomDensity = selectedDensityTemplate === "Customizado"
  const effectiveDensity = isCustomDensity ? customDensity : densityTemplates[selectedDensityTemplate]

  useEffect(() => {
    if (!selectedMeteor) return
    const approach = selectedMeteor.close_approach_data?.[0]
    if (approach) {
      const vks = Number.parseFloat(approach.relative_velocity?.kilometers_per_second)
      if (!Number.isNaN(vks)) {
        const vkh = Number.parseFloat(approach.relative_velocity?.kilometers_per_hour)
        if (!Number.isNaN(vkh)) setUserVelocity((vkh * 1000) / 3600)
      }
    } else {
      setUserVelocity(20000)
    }

    setUserAngle(45)
    setUserDensity(selectedMeteor.is_potentially_hazardous_asteroid ? 3500 : 3000)
  }, [selectedMeteor])

  // Clear population results when changing location or meteor; we only recompute on simulate
  useEffect(() => {
    if (!selectedLocation || !selectedMeteor) {
      setPopulationData(null)
      return
    }
    // Do not auto-recompute; keep last results visible until next simulation, or clear on change
    setPopulationData(null)
  }, [selectedLocation, selectedMeteor])

  function MapClickHandler({ onMapClick }) {
    useMapEvents({
      click(e) {
        onMapClick && onMapClick(e)
      },
    })
    return null
  }

  function handleMapClick(e) {
    const latlng = e?.latlng || (e && e.lat && e.lng ? { lat: e.lat, lng: e.lng } : null)
    if (!latlng) return
    const { lat, lng } = latlng
    setSelectedLocation({ lat: Number(lat.toFixed(6)), lon: Number(lng.toFixed(6)) })
    setCurrentStep(4)
  }

  function fetchForRange(start, end) {
    setError(null)
    if (!start || !end) {
      setError("Selecione ambas as datas")
      return
    }
    if (new Date(start) > new Date(end)) {
      setError("A data inicial deve ser anterior ou igual à data final")
      return
    }

    const daysDiff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
    if (daysDiff > 7) {
      setError("O período máximo é de 7 dias")
      return
    }

    const url = buildApiUrl(start, end)
    setLoading(true)
    ;(async () => {
      try {
        const res = await fetch(url)
        const bodyText = await res.text()

        if (!res.ok) {
          const snippet = bodyText ? ` - ${bodyText.slice(0, 500)}` : ""
          throw new Error(`HTTP ${res.status} ${res.statusText}${snippet}`)
        }

        let data
        try {
          data = bodyText ? JSON.parse(bodyText) : {}
        } catch {
          const snippet = bodyText ? bodyText.slice(0, 500) : "[vazio]"
          const lower = snippet.toLowerCase()
          if (lower.includes("<!doctype") || lower.includes("<html")) {
            try {
              const apiKey = import.meta.env.VITE_NASA_API_KEY || "XO0W1Kz2NafloPaPFMp2UebjtaOUrZVVWw2bW5Ah"
              const nasaUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&api_key=${apiKey}`
              const nres = await fetch(nasaUrl)
              const ntext = await nres.text()
              if (!nres.ok) throw new Error(`NASA API HTTP ${nres.status} - ${ntext.slice(0, 300)}`)
              const ndata = ntext ? JSON.parse(ntext) : {}
              const neo = ndata.near_earth_objects || {}
              const keys = Object.keys(neo)
              const list = keys.flatMap((k) => neo[k])
              setMeteors(list)
              setCurrentStep(2)
              setTimeout(() => {
                meteorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
              }, 100)
              return
            } catch (nerr) {
              const nsnippet = String(nerr.message).slice(0, 500)
              throw new Error(`Resposta inválida do servidor e fallback NASA falhou: ${nsnippet}`)
            }
          }
          throw new Error(`Resposta inválida: não é JSON. Conteúdo: ${snippet}`)
        }

        const neo = data.near_earth_objects || {}
        const keys = Object.keys(neo)
        const list = keys.flatMap((k) => neo[k])
        setMeteors(list)

        setCurrentStep(2)
        setTimeout(() => {
          meteorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 100)
      } catch (err) {
        console.error("Erro ao buscar meteoros:", err)
        setError(err.message)
        setMeteors([])
      } finally {
        setLoading(false)
      }
    })()
  }

  function handleSelectMeteor(meteor) {
    setSelectedMeteor(meteor)
    setCurrentStep(3)
    setTimeout(() => {
      mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  function startSimulation() {
    if (!selectedMeteor || !selectedLocation) return

    const zones = computeImpactZones(selectedMeteor, {
      velocity: userVelocity,
      angle: userAngle,
      density: userDensity,
    })

    setSimulationResults(zones)
    setCurrentStep(5)

    // Compute population estimates only when starting the simulation
    if (zones) {
      const areaFor = (radiusMeters) => (Math.PI * Math.pow(radiusMeters, 2)) / 1e6 // km^2
      const estimates = {
        crater: Math.round(effectiveDensity * areaFor(zones.craterRadius)),
        severe: Math.round(effectiveDensity * areaFor(zones.severeRadius)),
        moderate: Math.round(effectiveDensity * areaFor(zones.moderateRadius)),
        light: Math.round(effectiveDensity * areaFor(zones.lightRadius)),
      }
      setPopulationData({
        estimates,
        source: isCustomDensity
          ? `Estimativa personalizada: ${customDensity} pessoas/km²`
          : `Template: ${selectedDensityTemplate} (${densityTemplates[selectedDensityTemplate]} pessoas/km²)`,
        confidence: isCustomDensity ? "low" : "medium",
      })
    }
  }

  function resetSimulation() {
    setSelectedMeteor(null)
    setSelectedLocation(null)
    setSimulationResults(null)
    setPopulationData(null)
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function computeImpactZones(meteor, opts = {}) {
    if (!meteor) return null
    const diameterObj = meteor.estimated_diameter?.meters
    if (!diameterObj) return null

    // 1) Geometria e propriedades do projétil
    const avgDiameter = (diameterObj.estimated_diameter_min + diameterObj.estimated_diameter_max) / 2 // m
    const r = avgDiameter / 2
    const density = opts.density || userDensity || 3000 // kg/m³ (comum: rochoso ~3000, ferroso ~7800)
    const volume = (4 / 3) * Math.PI * Math.pow(r, 3)
    const mass = volume * density // kg

    // 2) Velocidade de impacto com foco gravitacional opcional
    const vIn = opts.velocity || userVelocity || 20000 // m/s
    const considerGravity = opts.considerGravity !== false
    const vEsc = 11200 // m/s (Terra)
    const v = considerGravity ? Math.sqrt(vIn * vIn + vEsc * vEsc) : vIn

    // 3) Ângulo de entrada
    const angleDeg = opts.angle || userAngle || 45
    const angleRad = (angleDeg * Math.PI) / 180
    const sinTheta = Math.max(Math.sin(angleRad), 0.1)

    // 4) Energia cinética
    const energyJ = 0.5 * mass * v * v
    const energyMt = energyJ / 4.184e15 // megatons TNT
    const energyKt = energyJ / 4.184e12 // kilotons TNT

    // 5) Ambiente/Alvo
    const rhoTarget = 2500 // kg/m³, alvo rochoso médio
    const g = 9.81 // m/s²

    // 6) Checagem simples de airburst (ruptura na atmosfera)
    //    Estimamos altitude onde pressão dinâmica = resistência do material.
    //    rho(h) ~ rho0 * exp(-h/H), com H ~ 8 km.
    const rho0 = 1.225 // kg/m³ (nível do mar)
    const H = 8000 // m
    // Resistência aproximada (Pa) por tipo: ferro ~5 MPa, rochoso ~1 MPa, frágil ~0.2 MPa
    let strength
    if (density >= 7000) strength = 5e6
    else if (density >= 2500) strength = 1e6
    else strength = 2e5

    // Altitude de fragmentação aproximada: h = H * ln((rho0 * v^2) / (2 * S))
    const fragArgument = (rho0 * v * v) / (2 * strength)
    const hFrag = Math.log(Math.max(fragArgument, 1e-9)) * H // pode ser negativo (sem fragmentação)
    // Airburst desabilitado: sempre considera impacto no solo
    const likelyAirburst = false

    // 7) Tamanho da cratera: ajuste empírico para meteoros pequenos (<10m), incluindo fatores físicos
    let Dfinal
    if (avgDiameter < 10) {
      // Área empírica ajustada, incluindo fatores físicos em menor escala
      const Kc = 20
      const densityRatio = density / rhoTarget
      let Dsimple =
        Kc *
        Math.pow(g, -0.17) *
        Math.pow(densityRatio, 0.26) *
        Math.pow(Math.max(avgDiameter, 0), 0.78) *
        Math.pow(Math.max(v * sinTheta, 0), 0.44)
      if (!Number.isFinite(Dsimple)) Dsimple = 0
      // Reduz o efeito dos fatores físicos para meteoros pequenos
      Dsimple = Dsimple / 5
      // Área empírica baseada em exemplo real
      const areaCratera = 100 * (avgDiameter / 3.22)
      // Mistura área empírica e física (média ponderada)
      const areaFinal = (areaCratera + Math.PI * Math.pow(Dsimple / 2, 2)) / 2
      Dfinal = 2 * Math.sqrt(areaFinal / Math.PI)
    } else {
      // π-scaling para meteoros grandes
      const Kc = 20
      const densityRatio = density / rhoTarget
      let Dsimple =
        Kc *
        Math.pow(g, -0.17) *
        Math.pow(densityRatio, 0.26) *
        Math.pow(Math.max(avgDiameter, 0), 0.78) *
        Math.pow(Math.max(v * sinTheta, 0), 0.44)
      if (!Number.isFinite(Dsimple)) Dsimple = 0
      Dfinal = Dsimple > 3000 ? Dsimple * 1.3 : Dsimple
    }
    let craterRadius = Dfinal / 2

    // 8) Zonas de dano por sobrepressão (aproximação R ∝ W^(1/3))
    //    Usamos limiares típicos: 20 psi (severa), 5 psi (moderada), 1 psi (leve),
    //    com constantes aproximadas em metros por kt^(1/3).
    //    Para impacto no solo, apenas fração da energia vira onda de choque atmosférica.
    const cubeRoot = (x) => (x <= 0 ? 0 : Math.cbrt ? Math.cbrt(x) : Math.pow(x, 1 / 3))

    let severeRadius
    let moderateRadius
    let lightRadius

    if (!likelyAirburst) {
      const couplingBlast = 0.3 // fração da energia convertida em blast atmosférico
      const Wkt = couplingBlast * energyKt
      const k20 = 180 // m/kt^(1/3)
      const k5 = 600 // m/kt^(1/3)
      const k1 = 1500 // m/kt^(1/3)
      const f = cubeRoot(Wkt)
      severeRadius = Math.max(k20 * f, craterRadius * 1.1)
      moderateRadius = Math.max(k5 * f, severeRadius * 1.2)
      lightRadius = Math.max(k1 * f, moderateRadius * 1.2)
    } else {
      // Airburst: maior acoplamento com o ar, porém atenuação com altitude
      const h = Math.min(Math.max(hFrag, 3000), 40000) // limita entre 3-40 km
      const couplingAir = 0.7
      const WktEff = couplingAir * energyKt
      const attenuation = Math.exp(-h / 10000) // atenuação simples de efeito ao solo
      const k20 = 180
      const k5 = 600
      const k1 = 1500
      const f = cubeRoot(WktEff) * attenuation
      severeRadius =  k20 * f
      moderateRadius = k5 * f
      lightRadius =   k1 * f
    }

    // 9) Pequenas salvaguardas numéricas
    const minVal = 0
    craterRadius = Math.max(minVal, craterRadius || 0)
    severeRadius = Math.max(minVal, severeRadius || 0)
    moderateRadius = Math.max(minVal, moderateRadius || 0)
    lightRadius = Math.max(minVal, lightRadius || 0)

    return {
      avgDiameter,
      mass,
      density,
      velocity: v,
      angleDeg,
      energyJ,
      energyMt,
      craterRadius,
      severeRadius,
      moderateRadius,
      lightRadius,
      model: {
        considerGravity,
        rhoTarget,
        g,
        likelyAirburst,
        fragmentationAltitude: likelyAirburst ? Math.max(0, Math.min(hFrag, 40000)) : 0,
      },
    }
  }

  const filteredMeteors = hazardousOnly ? meteors.filter((m) => m.is_potentially_hazardous_asteroid) : meteors

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🌍 Asteroid Impact Simulator</h1>
          <p className="subtitle">Simulate real NASA asteroid impacts on Earth</p>
        </div>
      </header>

      <main className="main-content">
        <div className="step-indicator">
          <div className={`step-item ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-label">Search Asteroids</div>
          </div>
          <div className="step-arrow">→</div>
          <div className={`step-item ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">Select Asteroid</div>
          </div>
          <div className="step-arrow">→</div>
          <div className={`step-item ${currentStep >= 3 ? "active" : ""} ${currentStep > 3 ? "completed" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">Select Location</div>
          </div>
          <div className="step-arrow">→</div>
          <div className={`step-item ${currentStep >= 4 ? "active" : ""} ${currentStep > 4 ? "completed" : ""}`}>
            <div className="step-number">4</div>
            <div className="step-label">Adjust Parameters</div>
          </div>
          <div className="step-arrow">→</div>
          <div className={`step-item ${currentStep >= 5 ? "active" : ""}`}>
            <div className="step-number">5</div>
            <div className="step-label">View Results</div>
          </div>
        </div>

        <section className="section">
          <div className="section-header">
            <div className="section-number">1</div>
            <div className="section-title">
              <h2>Search Asteroids</h2>
              <p>Select a period of up to 7 days to search for near-Earth asteroids</p>
            </div>
          </div>

          <form
            className="date-form"
            onSubmit={(e) => {
              e.preventDefault()
              fetchForRange(startDate, endDate)
            }}
          >
            <div className="date-inputs">
              <div className="date-input-group">
                <label>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div className="date-input-group">
                <label>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>

            <div className="filter-options">
              <input
                type="checkbox"
                id="hazardous-filter"
                checked={hazardousOnly}
                onChange={(e) => setHazardousOnly(e.target.checked)}
              />
              <label htmlFor="hazardous-filter">Show only hazardous asteroids</label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "🔄 Searching..." : "🔍 Search Asteroids"}
            </button>
          </form>

          {error && <div className="error-message">❌ {error}</div>}
        </section>

        {meteors.length > 0 && (
          <section ref={meteorSectionRef} className="section">
            <div className="section-header">
              <div className="section-number">2</div>
              <div className="section-title">
                <h2>Select Asteroid</h2>
                <p>
                  Found {filteredMeteors.length} asteroid{filteredMeteors.length !== 1 ? "s" : ""} in the selected period
                </p>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Carregando meteoros da NASA...</p>
              </div>
            ) : (
              <div className="meteor-grid">
                {filteredMeteors.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#a0a0c0" }}>
                    Nenhum meteoro corresponde ao filtro aplicado.
                  </div>
                ) : (
                  filteredMeteors.map((meteor) => {
                    const diameter = meteor.estimated_diameter
                    const avgDiameter = diameter
                      ? ((diameter.meters.estimated_diameter_min + diameter.meters.estimated_diameter_max) / 2).toFixed(
                          2,
                        )
                      : "—"
                    const approach = meteor.close_approach_data?.[0]

                    return (
                      <div
                        key={meteor.id}
                        className={`meteor-card ${meteor.is_potentially_hazardous_asteroid ? "hazardous" : ""}`}
                      >
                        <div className="meteor-card-header">
                          <h3>{meteor.name}</h3>
                          {meteor.is_potentially_hazardous_asteroid && <span className="hazard-badge">⚠️ PERIGOSO</span>}
                        </div>
                        <div className="meteor-card-body">
                          <div className="meteor-stat">
                            <span className="stat-label">Diâmetro médio</span>
                            <span className="stat-value">{avgDiameter} m</span>
                          </div>
                          <div className="meteor-stat">
                            <span className="stat-label">Magnitude</span>
                            <span className="stat-value">{meteor.absolute_magnitude_h}</span>
                          </div>
                          {approach && (
                            <div className="meteor-stat">
                              <span className="stat-label">Velocidade</span>
                              <span className="stat-value">
                                {Number.parseFloat(approach.relative_velocity.kilometers_per_hour).toLocaleString()}{" "}
                                km/h
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="meteor-card-footer">
                          <button className="btn btn-select" onClick={() => handleSelectMeteor(meteor)}>
                            Selecionar este meteoro →
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </section>
        )}

        {selectedMeteor && (
          <section ref={mapSectionRef} className="section">
            <div className="section-header">
              <div className="section-number">3</div>
              <div className="section-title">
                <h2>Select Location & Adjust Parameters</h2>
                <p>Click on the map to choose the impact point and adjust simulation parameters</p>
              </div>
            </div>

            <div className="selected-meteor-banner">
              <div className="selected-meteor-info">
                <h4>🌠 {selectedMeteor.name}</h4>
                <p>
                  {selectedMeteor.is_potentially_hazardous_asteroid ? "⚠️ Hazardous Asteroid" : "Non-Hazardous Asteroid"}{" "}
                  • Diameter: {(
                    (selectedMeteor.estimated_diameter.meters.estimated_diameter_min +
                      selectedMeteor.estimated_diameter.meters.estimated_diameter_max) /
                    2
                  ).toFixed(2)}{" "}
                  m
                </p>
              </div>
              <button className="btn btn-secondary" onClick={resetSimulation}>
                ← Choose another asteroid
              </button>
            </div>

            <div className="map-layout">
              <div className="map-container">
                <div className="map-wrapper">
                  <MapContainer
                    center={selectedLocation ? [selectedLocation.lat, selectedLocation.lon] : [0, 0]}
                    zoom={selectedLocation ? 8 : 2}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler onMapClick={handleMapClick} />

                    {selectedLocation && (
                      <Marker position={[selectedLocation.lat, selectedLocation.lon]} icon={asteroidIcon} />
                    )}

                    {selectedLocation &&
                      simulationResults && (
                        <>
                          <Circle
                            center={[selectedLocation.lat, selectedLocation.lon]}
                            radius={simulationResults.craterRadius}
                            pathOptions={{ color: "#ff0000", fillColor: "#ff0000", fillOpacity: 0.3 }}
                          />
                          <Circle
                            center={[selectedLocation.lat, selectedLocation.lon]}
                            radius={simulationResults.severeRadius}
                            pathOptions={{ color: "#ff6600", fillColor: "#ff6600", fillOpacity: 0.2 }}
                          />
                          <Circle
                            center={[selectedLocation.lat, selectedLocation.lon]}
                            radius={simulationResults.moderateRadius}
                            pathOptions={{ color: "#ffcc00", fillColor: "#ffcc00", fillOpacity: 0.15 }}
                          />
                          <Circle
                            center={[selectedLocation.lat, selectedLocation.lon]}
                            radius={simulationResults.lightRadius}
                            pathOptions={{ color: "#00ff00", fillColor: "#00ff00", fillOpacity: 0.1 }}
                          />
                        </>
                      )}
                  </MapContainer>
                </div>

                {!selectedLocation ? (
                  <div className="location-info location-info-empty">
                    👆 Click on the map to select the impact point
                  </div>
                ) : !populationData ? (
                  <div className="location-info">
                    📍 Selected location: {selectedLocation.lat}°, {selectedLocation.lon}°
                  </div>
                ) : (
                  <div className="population-display">
                    <div className="population-header">
                      <h4>👥 People Affected by Zone</h4>
                      <div className="population-meta">
                        <span className="population-source">{populationData.source}</span>
                        <span className={`confidence-badge confidence-${populationData.confidence}`}>
                          {populationData.confidence === "high"
                            ? "High Confidence"
                            : populationData.confidence === "medium"
                              ? "Medium Confidence"
                              : "Low Confidence"}
                        </span>
                      </div>
                    </div>
                    <div className="population-grid">
                      <div className="population-card crater-zone">
                        <div className="population-card-header">
                          <span className="zone-indicator" style={{ background: "#ff0000" }}></span>
                          <span className="zone-name">{simulationResults.craterRadius == 0 ? "Airburst" : "Crater"}</span> {/* CRATERA2*/}
                        </div>
                        <div className="population-count">{populationData.estimates.crater.toLocaleString()}</div>
                        <div className="population-description">Total destruction</div>
                      </div>
                      <div className="population-card severe-zone">
                        <div className="population-card-header">
                          <span className="zone-indicator" style={{ background: "#ff6600" }}></span>
                          <span className="zone-name">Severe</span>
                        </div>
                        <div className="population-count">{populationData.estimates.severe.toLocaleString()}</div>
                        <div className="population-description">Severe structural damage</div>
                      </div>
                      <div className="population-card moderate-zone">
                        <div className="population-card-header">
                          <span className="zone-indicator" style={{ background: "#ffcc00" }}></span>
                          <span className="zone-name">Moderate</span>
                        </div>
                        <div className="population-count">{populationData.estimates.moderate.toLocaleString()}</div>
                        <div className="population-description">Significant damage</div>
                      </div>
                      <div className="population-card light-zone">
                        <div className="population-card-header">
                          <span className="zone-indicator" style={{ background: "#00ff00" }}></span>
                          <span className="zone-name">Light</span>
                        </div>
                        <div className="population-count">{populationData.estimates.light.toLocaleString()}</div>
                        <div className="population-description">Minor damage</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <aside className="parameters-panel">
                <h3>⚙️ Parameters</h3>

                <div className="parameter-group">
                  <div className="parameter-label">
                    <span>Velocity</span>
                    <span className="parameter-value">{(userVelocity / 1000).toFixed(1)} km/s</span>
                  </div>
                  <input
                    type="range"
                    min={3000}
                    max={70000}
                    step={500}
                    value={userVelocity}
                    onChange={(e) => setUserVelocity(Number(e.target.value))}
                  />
                </div>

                <div className="parameter-group">
                  <div className="parameter-label">
                    <span>Entry Angle</span>
                    <span className="parameter-value">{userAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={90}
                    step={1}
                    value={userAngle}
                    onChange={(e) => setUserAngle(Number(e.target.value))}
                  />
                </div>

                <div className="parameter-group">
                  <div className="parameter-label">
                    <span>Meteor Density</span>
                    <span className="parameter-value">{userDensity} kg/m³</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={8000}
                    step={50}
                    value={userDensity}
                    onChange={(e) => setUserDensity(Number(e.target.value))}
                  />
                </div>

                <div className="parameter-group">
                  <div className="parameter-label">
                    <span>Population Density</span>
                    <span className="parameter-value">
                      {isCustomDensity
                        ? `${customDensity} people/km²`
                        : `${densityTemplates[selectedDensityTemplate]} people/km²`}
                    </span>
                  </div>
                  <div className="density-templates">
                    {Object.keys(densityTemplates).map((label) => (
                      <button
                        key={label}
                        type="button"
                        className={`density-btn${selectedDensityTemplate === label ? " selected" : ""}`}
                        onClick={() => setSelectedDensityTemplate(label)}
                      >
                        {label === "Zona Rural" ? "Rural Area" : label === "Subúrbio" ? "Suburb" : label === "Área Urbana" ? "Urban Area" : label === "Metrópole Densa" ? "Dense Metropolis" : label}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={`density-btn${isCustomDensity ? " selected" : ""}`}
                      onClick={() => setSelectedDensityTemplate("Customizado")}
                    >
                      Custom
                    </button>
                  </div>
                  {isCustomDensity && (
                    <div className="custom-density-input">
                      <input
                        type="number"
                        min={1}
                        max={100000}
                        step={1}
                        value={customDensity}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          if (!Number.isNaN(val) && val > 0 && val <= 100000) setCustomDensity(val)
                        }}
                        className="density-input"
                        placeholder="Enter value (people/km²)"
                      />
                    </div>
                  )}
                </div>

                {selectedLocation && simulationResults && (
                  <div className="impact-zones">
                    <h4>Impact Zones</h4>
                    <div className="zone-item">
                      <div className="zone-label">
                        <span className="zone-color" style={{ background: "#ff0000" }}></span>
                        Crater
                      </div>
                      <span className="zone-value">
                        {simulationResults.craterRadius > 0
                          ? `${Math.round(simulationResults.craterRadius * 2)} m diameter`
                          : "No crater (airburst)"}
                      </span>
                    </div>
                    <div className="zone-item">
                      <div className="zone-label">
                        <span className="zone-color" style={{ background: "#ff6600" }}></span>
                        Severe
                      </div>
                      <span className="zone-value">{Math.round(simulationResults.severeRadius)} m</span>
                    </div>
                    <div className="zone-item">
                      <div className="zone-label">
                        <span className="zone-color" style={{ background: "#ffcc00" }}></span>
                        Moderate
                      </div>
                      <span className="zone-value">{Math.round(simulationResults.moderateRadius)} m</span>
                    </div>
                    <div className="zone-item">
                      <div className="zone-label">
                        <span className="zone-color" style={{ background: "#00ff00" }}></span>
                        Light
                      </div>
                      <span className="zone-value">{Math.round(simulationResults.lightRadius)} m</span>
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-primary simulate-button"
                  onClick={startSimulation}
                  disabled={!selectedLocation}
                >
                  🚀 Start Simulation
                </button>
              </aside>
            </div>
          </section>
        )}

        {simulationResults && (
          <section ref={resultsSectionRef} className="section">
            <div className="section-header">
              <div className="section-number">5</div>
              <div className="section-title">
                <h2>Simulation Results</h2>
                <p>Complete analysis of the impact of asteroid {selectedMeteor.name}</p>
              </div>
            </div>

            <div className="results-grid">
              <div className="result-card highlight">
                <div className="result-icon">💥</div>
                <div className="result-label">Energy</div>
                <div className="result-value">{simulationResults.energyMt.toExponential(2)} Mt</div>
              </div>

              <div className="result-card">
                <div className="result-icon">⚖️</div>
                <div className="result-label">Mass</div>
                <div className="result-value">{Number(simulationResults.mass).toExponential(2)} kg</div>
              </div>

              <div className="result-card">
                <div className="result-icon">📏</div>
                <div className="result-label">Diameter</div>
                <div className="result-value">{simulationResults.avgDiameter.toFixed(1)} m</div>
              </div>

              <div className="result-card">
                <div className="result-icon">⚡</div>
                <div className="result-label">Velocity</div>
                <div className="result-value">{(simulationResults.velocity / 1000).toFixed(1)} km/s</div>
              </div>

              <div className="result-card">
                <div className="result-icon">🎯</div>
                <div className="result-label">Angle</div>
                <div className="result-value">{simulationResults.angleDeg}°</div>
              </div>

              <div className="result-card">
                <div className="result-icon">🕳️</div>
                <div className="result-label">Crater Radius</div>
                <div className="result-value">
                  {simulationResults.craterRadius > 0
                    ? `${Math.round(simulationResults.craterRadius)} m`
                    : "No crater (airburst)"}
                </div>
              </div>
            </div>

            <div className="impact-description">
              <h4>📊 Impact Analysis</h4>
              <p>
                <strong>Released energy:</strong> The impact would release approximately{" "}
                <strong>{simulationResults.energyMt.toExponential(2)} megatons</strong> of TNT equivalent energy.
                {simulationResults.energyMt > 1 && " This is comparable to a large-scale nuclear explosion."}
              </p>
              <p>
                <strong>Crater:</strong> A crater with a radius of approximately{" "}
                <strong>{Math.round(simulationResults.craterRadius)} meters</strong> would be formed at the impact point.
              </p>
              <p>
                <strong>Severe destruction zone:</strong> Up to{" "}
                <strong>{Math.round(simulationResults.severeRadius)} meters</strong> from the impact point, there would be
                near-total destruction of structures.
              </p>
              <p>
                <strong>Moderate damage zone:</strong> Up to{" "}
                <strong>{Math.round(simulationResults.moderateRadius)} meters</strong>, structures would suffer significant
                damage and there would be a risk of serious injuries.
              </p>
              <p>
                <strong>Light damage zone:</strong> Up to{" "}
                <strong>{Math.round(simulationResults.lightRadius)} meters</strong>, windows would break and there would be
                minor damage to structures.
              </p>
            </div>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button className="btn btn-primary" onClick={resetSimulation}>
                🔄 New Simulation
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Data provided by NASA - Near Earth Object Web Service (NEO)</p>
        <p className="disclaimer">
          ⚠️ This is an educational simulation. Calculations are approximations based on simplified scientific models.
        </p>
      </footer>
    </div>
  )
}

export default App
