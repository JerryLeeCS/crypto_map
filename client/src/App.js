import { useState, useEffect } from "react"
import "./App.css"
import ReadString from "./ReadString.js"
import SetString from "./SetString.js"
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js"
import { polyfill, h3ToGeoBoundary, geoToH3 } from "h3-js"
import HexGridDataDisplayCard from "./components/HexGridDataDisplayCard"
import HexGridDataEditCard from "./components/HexGridDataEditCard"

function App(props) {
  const [loading, setLoading] = useState(true)
  const [isViewing, setIsViewing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [drizzleState, setDrizzleState] = useState()
  const [mapboxMap, setMapboxMap] = useState()
  const [selectedH3Id, setSelectedH3Id] = useState()
  const [selectedHexGridData, setSelectedHexGridData] = useState()
  //Used to get infos from cache.
  const [displayH3Ids, setDisplayH3Ids] = useState([])
  const h3ResolutionLevel = 7

  const updateHexGridLayout = () => {
    const { _sw: sw, _ne: ne } = mapboxMap.getBounds()

    const latPadding = (ne.lat - sw.lat) / 10
    const lngPadding = (ne.lng - sw.lng) / 10

    const polygon = [
      [ne.lat + latPadding, ne.lng + lngPadding],
      [ne.lat + latPadding, sw.lng - lngPadding],
      [sw.lat - latPadding, sw.lng - lngPadding],
      [sw.lat - latPadding, ne.lng + lngPadding],
    ]

    const h3Ids = polyfill(polygon, h3ResolutionLevel)

    setDisplayH3Ids(h3Ids)

    const geoJSONData = {
      type: "FeatureCollection",
      features: h3Ids.map((h3Id) => ({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [h3ToGeoBoundary(h3Id, true)],
        },
        properties: {
          density: 0.3,
          color: "#d3d3d3",
        },
      })),
    }

    const sourceId = "sourceId"
    const layerId = "layerId"

    if (mapboxMap.getLayer(layerId)) {
      mapboxMap.removeLayer(layerId)
      mapboxMap.removeSource(sourceId)
    }

    mapboxMap.addSource(sourceId, {
      type: "geojson",
      data: geoJSONData,
    })

    mapboxMap.addLayer({
      id: layerId,
      type: "fill",
      source: sourceId,
      layout: {},
      paint: {
        "fill-color": ["get", "color"],
        "fill-outline-color": "#000000",
        "fill-opacity": ["get", "density"],
      },
    })
  }

  const updateColorHexGridLayout = () => {
    if (mapboxMap) {
      const coordinates = selectedH3Id
        ? [h3ToGeoBoundary(selectedH3Id, true)]
        : []
      const geoJSONData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates,
            },
            properties: {
              density: 1,
              color: "#000000",
              borderColor: "#FFFFFF",
            },
          },
        ],
      }
      const sourceId = "colorSourceId"
      const layerId = "colorLayerId"
      if (mapboxMap.getLayer(layerId)) {
        mapboxMap.removeLayer(layerId)
        mapboxMap.removeSource(sourceId)
      }

      mapboxMap.addSource(sourceId, {
        type: "geojson",
        data: geoJSONData,
      })

      mapboxMap.addLayer({
        id: layerId,
        type: "fill",
        source: sourceId,
        layout: {},
        paint: {
          "fill-color": ["get", "color"],
          "fill-outline-color": ["get", "borderColor"],
          "fill-opacity": ["get", "density"],
        },
      })
    }
  }

  useEffect(() => {
    const { drizzle } = props

    const unsubscribe = drizzle.store.subscribe(() => {
      const drizzleState = drizzle.store.getState()

      if (drizzleState.drizzleStatus.initialized) {
        setDrizzleState(drizzleState)
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiamVycnlkZWtvIiwiYSI6ImNqbWJqYWYzNzFqN3MzcWxrcnR1bHptdHgifQ.lwp1yCEfR-571xDbI_BK8g"
      const map = new mapboxgl.Map({
        container: "mapbox",
        style: "mapbox://styles/jerrydeko/ckjxur72k0lu01cld8v81gibh",
        center: [-118.2437, 34.0522],
        zoom: 11,
        maxZoom: 12,
        minZoom: 11,
      })

      setMapboxMap(map)
    }
  }, [loading])

  useEffect(() => {
    if (mapboxMap) {
      const selectHexGrid = (e) => {
        const { lat, lng } = e.lngLat.wrap()
        const h3SelectedIndex = geoToH3(lat, lng, h3ResolutionLevel)
        setSelectedH3Id(h3SelectedIndex)
        setIsEditing(false)
        setIsViewing(true)
      }

      mapboxMap.on("load", updateHexGridLayout)
      mapboxMap.on("moveend", updateHexGridLayout)
      mapboxMap.on("zoomend", updateHexGridLayout)
      mapboxMap.on("click", selectHexGrid)

      return () => {
        mapboxMap.off("load", updateHexGridLayout)
        mapboxMap.off("moveend", updateHexGridLayout)
        mapboxMap.off("zoomend", updateHexGridLayout)
        mapboxMap.off("click", selectHexGrid)
      }
    }
  }, [mapboxMap])

  useEffect(() => {
    updateColorHexGridLayout()
  }, [selectedH3Id])

  useEffect(() => {
    if (!loading && selectedH3Id && drizzleState) {
      const contract = props.drizzle.contracts.HexGridStore
      const hexGridDataItems = contract.methods["hexGridDataItems"]
      const selectedHexGridDataKey = hexGridDataItems.cacheCall(selectedH3Id)
      const selectedHexGridData =
        drizzleState.contracts.HexGridStore["hexGridDataItems"][
          selectedHexGridDataKey
        ]

      setSelectedHexGridData(selectedHexGridData)
      console.log(selectedHexGridData)
    }
  }, [loading, selectedH3Id, drizzleState])

  if (loading) {
    return "Loading Drizzle..."
  }

  return (
    <div className="App">
      <div className="action-container">
        <div className="action-container_search-container">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Location"
              aria-label="Location"
              aria-describedby="button-addon2"
            />
            <button className="btn btn-dark" type="button" id="button-addon2">
              Search
            </button>
          </div>
        </div>
        {selectedHexGridData && isViewing && (
          <HexGridDataDisplayCard
            onEdit={() => {
              setIsViewing(false)
              setIsEditing(true)
            }}
            onClose={() => {
              setSelectedH3Id(undefined)
              setSelectedHexGridData(undefined)
              setIsViewing(false)
            }}
          />
        )}
        {isEditing && (
          <HexGridDataEditCard
            onCreate={(hexGridData) => {}}
            onCancel={() => {
              setIsEditing(false)
              setIsViewing(true)
            }}
          />
        )}
      </div>
      <div className="mapbox-container">
        <div id="mapbox"></div>
      </div>
    </div>
  )
}

export default App
