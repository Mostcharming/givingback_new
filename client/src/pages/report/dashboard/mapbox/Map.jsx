import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useEffect, useState } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl'
import './App.css'

function Mapper({ mapData }) {
  const [pins, setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [showPopup, setShowPopup] = useState(true)
  const [userLocation, setUserLocation] = useState(null)

  const handleMarker = (id, lat, long) => {
    setCurrentPlaceId(id)
    setShowPopup(true)
  }

  const close = () => {
    setCurrentPlaceId(null)
    setShowPopup(false)
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, long: longitude })
        },
        (error) => {
          console.error('Error getting user location:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  const getPopupAnchor = (lat) => {
    return lat > 8.85 ? 'top' : 'bottom'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  useEffect(() => {
    getUserLocation()
    setPins(mapData)
    setShowPopup(false)
  }, [mapData])

  return (
    <div className='App'>
      <Map
        initialViewState={{
          longitude: 10.172697748911588,
          latitude: 8.851365089319344,
          zoom: 5.7,
          doubleClickZoom: false,
          dragPan: true,
          dragRotate: false,
          scrollZoom: false,
          touchZoom: false,
          touchRotate: false,
          keyboard: false
        }}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle='mapbox://styles/mapbox/light-v11'
        mapboxAccessToken='pk.eyJ1Ijoic2FmYWsiLCJhIjoiY2tubmFvdHVwMTM0bDJ2bnh3b3g5amdsYiJ9.fhCd-5dCeop0Jjn3cBV9VA'
      >
        <NavigationControl
          position='bottom-right'
          style={{ marginRight: '25px', marginBottom: '25px' }}
        />

        {userLocation && (
          <Marker
            longitude={userLocation.long}
            latitude={userLocation.lat}
            anchor='bottom'
          >
            <FaMapMarkerAlt
              style={{
                fontSize: '25px',
                color: '#D8BFD8'
              }}
            />
          </Marker>
        )}

        {pins.map((pin, index) => (
          <React.Fragment key={index}>
            <Marker longitude={pin.long} latitude={pin.lat} anchor='bottom'>
              <FaMapMarkerAlt
                style={{
                  fontSize: '25px',
                  color: '#813481'
                }}
                onMouseOver={() => handleMarker(pin.id, pin.lat, pin.long)}
                onMouseOut={close}
              />
            </Marker>

            {pin.id === currentPlaceId && showPopup && (
              <Popup
                longitude={pin.long}
                latitude={pin.lat}
                anchor={getPopupAnchor(pin.lat)}
                closeButton={false}
                closeOnClick={false}
              >
                <div className='pinbox'>
                  <div className='state'>{pin.state}</div>
                  <div className='ngo-count'>
                    <span>Number of NGOs:</span> <span>{pin.ngos}</span>
                  </div>
                  <div className='donations'>
                    <span>Total Donations:</span>
                    <span>{formatCurrency(pin.donations)}</span>
                  </div>
                  <div className='projects'>
                    <span>Projects:</span> <span>{pin.projects}</span>
                  </div>
                  <div className='thematicareas'>
                    <span>Areas: </span>{' '}
                    <span>{pin.thematicAreas.join(' ')}</span>
                  </div>
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}
      </Map>
    </div>
  )
}

export default Mapper
