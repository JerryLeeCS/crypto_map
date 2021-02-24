import { useState, useEffect, useMemo } from "react"
import "./App.css"
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js"
import { polyfill, h3ToGeoBoundary, geoToH3, h3ToGeo } from "h3-js"
import HexGridDataDisplayCard from "./components/HexGridDataDisplayCard"
import HexGridDataEditCard from "./components/HexGridDataEditCard"
import LinearLoader from "./components/LinearLoader/LinearLoader"
import TextBanner from "./components/TextBanner/TextBanner"
import deepcopy from "deepcopy"

function App(props) {
  const [drizzleIsLoading, setDrizzleIsLoading] = useState(true)
  const [hexGridDataIsLoading, setHexGridDataIsLoading] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [drizzleState, setDrizzleState] = useState()
  const [mapboxMap, setMapboxMap] = useState()
  const [selectedH3Id, setSelectedH3Id] = useState()
  const [selectedHexGridData, setSelectedHexGridData] = useState()
  const [hexGridDataId, setHexGridDataId] = useState(null)
  const [hexGridDataCacheCallIds, setHexGridDataCacheCallIds] = useState([])
  const [transactionId, setTransactionId] = useState(null)
  const [transactionStatus, setTransactionStatus] = useState(null)
  const [hexGridDataMap, setHexGridDataMap] = useState({})
  const [displayH3Ids, setDisplayH3Ids] = useState([])
  const h3ResolutionLevel = 7

  const sourceId = "sourceId"
  const layerId = "layerId"
  const dataSourceColorId = "dataSourceColorId"
  const dataLayerColorId = "dataLayerColorId"
  const dataSourceEmojiId = "dataSourceEmojiId"
  const dataLayerEmojiId = "dataLayerEmojiId"

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
          density: 0.2,
          color: "#ffffff",
        },
      })),
    }

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

    const dataColorLayer = mapboxMap.getLayer(dataLayerColorId)

    if (dataColorLayer) {
      mapboxMap.moveLayer(layerId, dataLayerColorId)
    }
  }

  const updateHexGridDataLayout = async (hexGridDataMap, h3Ids) => {
    if (hexGridDataMap && h3Ids) {
      const imageNameMap = mapboxMap
        .listImages()
        .reduce((imageNameMap, imageName) => {
          imageNameMap[imageName] = true

          return imageNameMap
        }, {})

      h3Ids
        .filter(
          (h3Id) =>
            hexGridDataMap &&
            hexGridDataMap[h3Id] &&
            hexGridDataMap[h3Id].emoji &&
            hexGridDataMap[h3Id].color
        )
        .map((h3Id) => {
          const emojiUrlPath = hexGridDataMap[h3Id].emoji.split("/")
          const emojiName = emojiUrlPath[emojiUrlPath.length - 1]

          if (!imageNameMap[emojiName]) {
            mapboxMap.loadImage(
              hexGridDataMap[h3Id].emoji,
              function (error, image) {
                if (error) throw error
                if (!mapboxMap.hasImage(emojiName)) {
                  mapboxMap.addImage(emojiName, image)
                }
              }
            )
          }
        })
      const hexGridColorData = {
        type: "FeatureCollection",
        features: h3Ids
          .filter(
            (h3Id) =>
              hexGridDataMap &&
              hexGridDataMap[h3Id] &&
              hexGridDataMap[h3Id].emoji &&
              hexGridDataMap[h3Id].color
          )
          .map((h3Id) => ({
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [h3ToGeoBoundary(h3Id, true)],
            },
            properties: {
              density: 0.3,
              color: hexGridDataMap[h3Id].color,
            },
          })),
      }

      const hexGridEmojiData = {
        type: "FeatureCollection",
        features: h3Ids
          .filter(
            (h3Id) =>
              hexGridDataMap &&
              hexGridDataMap[h3Id] &&
              hexGridDataMap[h3Id].emoji &&
              hexGridDataMap[h3Id].color
          )
          .map((h3Id) => {
            const [lat, lng] = h3ToGeo(h3Id)
            const emojiUrlPath = hexGridDataMap[h3Id].emoji.split("/")
            const emojiName = emojiUrlPath[emojiUrlPath.length - 1]

            return {
              type: "Feature",
              properties: {
                emoji: emojiName,
                description: "Rockabilly Rockstars",
              },
              geometry: {
                type: "Point",
                coordinates: [lng, lat],
              },
            }
          }),
      }

      if (mapboxMap.getLayer(dataLayerColorId)) {
        mapboxMap.removeLayer(dataLayerColorId)
        mapboxMap.removeSource(dataSourceColorId)
      }

      if (mapboxMap.getLayer(dataLayerEmojiId)) {
        mapboxMap.removeLayer(dataLayerEmojiId)
        mapboxMap.removeSource(dataSourceEmojiId)
      }

      mapboxMap.addSource(dataSourceColorId, {
        type: "geojson",
        data: hexGridColorData,
      })

      mapboxMap.addSource(dataSourceEmojiId, {
        type: "geojson",
        data: hexGridEmojiData,
      })

      mapboxMap.addLayer({
        id: dataLayerColorId,
        type: "fill",
        source: dataSourceColorId,
        layout: {},
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": ["get", "density"],
        },
      })

      mapboxMap.addLayer({
        id: dataLayerEmojiId,
        type: "symbol",
        source: dataSourceEmojiId,
        layout: {
          "icon-image": ["get", "emoji"],
          "icon-size": 0.4,
        },
      })
    }
  }

  const updateSelectedHexGridLayout = () => {
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

  function setHexGridData(hexGridData) {
    const contract = props.drizzle.contracts.HexGridStore
    const { color, emoji, text } = hexGridData

    const transactionId = contract.methods["addHexGridData"].cacheSend(
      selectedH3Id,
      color,
      emoji,
      text,
      {
        from: drizzleState.accounts[0],
      }
    )

    setTransactionId(transactionId)
  }

  function getHexGridDataCacheCallId(hexGridIds) {
    const contract = props.drizzle.contracts.HexGridStore
    const dataId = contract.methods["getHexGridDataItems"].cacheCall(
      hexGridIds,
      {
        from: drizzleState.accounts[0],
      }
    )

    return dataId
  }

  function isHexGridDataDifferent(a, b) {
    if (!a && !b) {
      return false
    }

    if ((a && !b) || (!a && b)) {
      return true
    }

    if (
      a.color !== b.color ||
      a.emoji !== b.emoji ||
      a.expirationDate !== b.expirationDate ||
      a.text !== b.text
    ) {
      return true
    }

    return false
  }

  useEffect(() => {
    const { drizzle } = props

    const unsubscribe = drizzle.store.subscribe(() => {
      const drizzleState = drizzle.store.getState()

      if (drizzleState.drizzleStatus.initialized) {
        setDrizzleState(drizzleState)
        setDrizzleIsLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!drizzleIsLoading) {
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
  }, [drizzleIsLoading])

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
    updateSelectedHexGridLayout()
  }, [selectedH3Id])

  useEffect(() => {
    if (
      displayH3Ids &&
      displayH3Ids.length > 0 &&
      drizzleState &&
      drizzleState.drizzleStatus.initialized
    ) {
      const hexGridDataH3Ids = displayH3Ids.filter(
        (h3Id) => !hexGridDataMap[h3Id]
      )

      if (hexGridDataH3Ids.length > 0) {
        setHexGridDataIsLoading(true)
        const hexGridDataCacheCallId = getHexGridDataCacheCallId(
          hexGridDataH3Ids
        )
        setHexGridDataId(hexGridDataCacheCallId)
        setHexGridDataCacheCallIds((callIds) =>
          callIds.concat([hexGridDataCacheCallId])
        )
      }
    }
  }, [displayH3Ids])

  useEffect(() => {
    if (transactionId) {
      const { transactions, transactionStack } = drizzleState
      const txHash = transactionStack[transactionId]

      if (txHash) {
        const transactionStatus =
          transactions[txHash] && transactions[txHash].status
        setTransactionStatus(transactionStatus)
        if (transactionStatus === "success") {
          setTransactionId(null)
        }
      }
    }
  }, [transactionId, drizzleState])

  useEffect(() => {
    if (hexGridDataId) {
      const { HexGridStore } = drizzleState.contracts
      const hexGridDataItems = HexGridStore.getHexGridDataItems[hexGridDataId]
      if (hexGridDataItems && hexGridDataItems.value) {
        setHexGridDataIsLoading(false)
        setHexGridDataId(null)
      }
    }
  }, [hexGridDataId, drizzleState])

  useEffect(() => {
    if (!drizzleIsLoading && selectedH3Id && drizzleState) {
      if (hexGridDataMap && hexGridDataMap[selectedH3Id]) {
        setSelectedHexGridData(hexGridDataMap[selectedH3Id])
      } else {
        const contract = props.drizzle.contracts.HexGridStore
        const hexGridDataItems = contract.methods["hexGridDataItems"]
        const selectedHexGridDataKey = hexGridDataItems.cacheCall(selectedH3Id)
        const selectedHexGridData =
          drizzleState.contracts.HexGridStore["hexGridDataItems"][
            selectedHexGridDataKey
          ]

        if (selectedHexGridData && selectedHexGridData.value) {
          setSelectedHexGridData(selectedHexGridData.value)
        }
      }
    }
  }, [drizzleIsLoading, selectedH3Id, drizzleState])

  useEffect(() => {
    if (
      drizzleState &&
      drizzleState.drizzleStatus &&
      drizzleState.drizzleStatus.initialized
    ) {
      const { HexGridStore } = drizzleState.contracts
      const getHexGriDataItems = HexGridStore.getHexGridDataItems

      const hexGridCallDataMap = hexGridDataCacheCallIds.reduce(
        (accum, callId) => {
          const { args, value } = getHexGriDataItems[callId]
          const h3Ids = args[0]

          h3Ids.forEach((h3Id, index) => {
            const hexGridData = value[index]
            accum[h3Id] = hexGridData
          })
          return accum
        },
        {}
      )

      const updatedDisplayH3Ids = displayH3Ids.filter((h3Id) =>
        isHexGridDataDifferent(hexGridCallDataMap[h3Id], hexGridDataMap[h3Id])
      )

      if (updatedDisplayH3Ids.length > 0) {
        setHexGridDataMap((prevHexGridDataMap) => {
          updatedDisplayH3Ids.forEach((h3Id) => {
            prevHexGridDataMap[h3Id] = hexGridCallDataMap[h3Id]
          })
          return deepcopy(prevHexGridDataMap)
        })
      }
    }
  }, [drizzleState])

  useEffect(() => {
    if (displayH3Ids && hexGridDataMap && mapboxMap && mapboxMap["_loaded"]) {
      updateHexGridDataLayout(hexGridDataMap, displayH3Ids)
    }
  }, [displayH3Ids, hexGridDataMap, mapboxMap && mapboxMap["_loaded"]])

  if (drizzleIsLoading) {
    return "Loading Drizzle..."
  }

  return (
    <div className="App">
      <div className="absolute-top-container">
        <LinearLoader hidden={!hexGridDataIsLoading} />
        <TextBanner
          className={
            transactionStatus === "success" ? "alert-success" : "alert-info"
          }
          text={transactionStatus && `Transaction Status: ${transactionStatus}`}
        />
      </div>
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
        <HexGridDataDisplayCard
          hexGridData={selectedHexGridData}
          onEdit={() => {
            setIsViewing(false)
            setIsEditing(true)
          }}
          onClose={() => {
            setSelectedH3Id(undefined)
            setSelectedHexGridData(undefined)
            setIsViewing(false)
          }}
          hidden={!(selectedHexGridData && isViewing)}
        />
        <HexGridDataEditCard
          onCreate={(hexGridData) => {
            setHexGridData(hexGridData)
            setIsEditing(false)
            setSelectedH3Id(undefined)
          }}
          onCancel={() => {
            setIsEditing(false)
            setIsViewing(true)
          }}
          hidden={!isEditing}
        />
      </div>
      <div className="mapbox-container">
        <div id="mapbox"></div>
      </div>
    </div>
  )
}

export default App
