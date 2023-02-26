import {
    DirectionsRenderer,
    DirectionsService,
    GoogleMap,
    LoadScript,
    StandaloneSearchBox
} from "@react-google-maps/api";
import {useEffect, useMemo, useRef, useState} from "react";
//@ts-ignore

const containerStyle = {
    width: '100%',
    height: '100%'
};

type Coords = {
    lat: number;
    lng: number;
}

const libs = ['places'];

const lineSymbol = {
    path: "M 0,-1 0,0",
    strokeOpacity: 1,
    scale: 4,
    strokeColor: "#bb49b8",
    strokeWeight: 2.5
};

const marker = {
    path: 'M11.88 12.908C11.9333 11.8413 12.3067 11.02 13 10.444C13.704 9.85733 14.6267 9.564 15.768 9.564C16.5467 9.564 17.2133 9.70267 17.768 9.98C18.3227 10.2467 18.7387 10.6147 19.016 11.084C19.304 11.5427 19.448 12.0653 19.448 12.652C19.448 13.324 19.272 13.8947 18.92 14.364C18.5787 14.8227 18.168 15.132 17.688 15.292V15.356C18.3067 15.548 18.7867 15.8893 19.128 16.38C19.48 16.8707 19.656 17.5 19.656 18.268C19.656 18.908 19.5067 19.4787 19.208 19.98C18.92 20.4813 18.488 20.876 17.912 21.164C17.3467 21.4413 16.664 21.58 15.864 21.58C14.6587 21.58 13.6773 21.276 12.92 20.668C12.1627 20.06 11.7627 19.164 11.72 17.98H13.896C13.9173 18.5027 14.0933 18.924 14.424 19.244C14.7653 19.5533 15.2293 19.708 15.816 19.708C16.36 19.708 16.776 19.5587 17.064 19.26C17.3627 18.9507 17.512 18.556 17.512 18.076C17.512 17.436 17.3093 16.9773 16.904 16.7C16.4987 16.4227 15.8693 16.284 15.016 16.284H14.552V14.444H15.016C16.5307 14.444 17.288 13.9373 17.288 12.924C17.288 12.4653 17.1493 12.108 16.872 11.852C16.6053 11.596 16.216 11.468 15.704 11.468C15.2027 11.468 14.8133 11.6067 14.536 11.884C14.2693 12.1507 14.1147 12.492 14.072 12.908H11.88Z',
    strokeOpacity: 1,
    scale: 2,
    // strokeColor: ,
    fillColor: "#ad3091",
    backgroundColor: "#ad3091",
    strokeWeight: 3
}

const Map = ({focusedCoords}: {focusedCoords?: Coords}) => {
    const count = useRef(0);
    const [center, setCenter] = useState<Coords>({
        lat: 41.8902102,
        lng: 12.4922309
    });
    const [waypoints, setWaypoints] = useState<any[]>([]);
    const [waypointsFull, setWaypointsFull] = useState<any[]>([]);
    const [response, setResponse] = useState<any>();

    const [place, setPlace] = useState();
    const [optimize, setOptimize] = useState<boolean>(false);
    const inputRef = useRef<any>(null);
    const placesService = useRef<any>(null);

    useEffect(() => {
        if (focusedCoords) {
            setCenter(focusedCoords);
        }
    }, [focusedCoords])

    const onLoad = (ref: any) => {
        inputRef.current = ref;
    }

    const onMapLoad = (map: any) => {
        if (window) {
            placesService.current = new window.google.maps.places.PlacesService(map);
        }
    }

    const getPlaceDetails = (placeId: string) => {
        if (placesService.current) {
            placesService.current?.getDetails({placeId}, (placeData: any, status: any) => {
                if (status === 'OK') {
                    setWaypointsFull((prevState) => [...prevState, placeData]);
                }
            });
        }
    }

    const mappedPoints = (): any[] => useMemo(() => {
        if (response && response.routes[0].legs.length) {
            return waypointsFull.map((waypoint, index) => {
                if (index < waypointsFull.length - 1) {
                    return {
                        ...waypoint,
                        duration: response.routes[0].legs[index].duration,
                        distance: response.routes[0].legs[index].distance,
                    }
                } else {
                    return waypoint;
                }
            })
        }
            return waypointsFull;
    }, [response]);

    const onPlacesChanged = () => {
        const placesFound = inputRef.current?.getPlaces();
        if (placesFound?.length) {
            const geo = placesFound[0].geometry.location;
            setPlace(geo);
            getPlaceDetails(placesFound[0].place_id)
            setWaypoints([...waypoints, geo])
        }
    }

    const directionsCallback = (resp: any) => {
        if (resp.status === "OK" && count.current === 0) {
            count.current++;
            setResponse(resp);
            setTimeout(() => count.current = 0, 2000)
        }
    }

    const onPointClick = (point: any) => {
        getPlaceDetails(point.placeId);
        setWaypoints([...waypoints, point.latLng]);
    }

    return (
        <>
        <LoadScript
            googleMapsApiKey="AIzaSyDZM3A8uYRUyTmBkxBIHZ3JRb2BXz3A96M"
            libraries={libs as any[]}
        >
            <div>
                <div style={{display: 'flex'}}>
                    <StandaloneSearchBox
                        onLoad={onLoad}
                        onPlacesChanged={onPlacesChanged}
                    >
                        <input
                            type="text"
                            placeholder="Where do you want to go next?"
                            style={{
                                boxSizing: `border-box`,
                                border: `1px solid transparent`,
                                width: `400px`,
                                height: `48px`,
                                padding: `0 12px`,
                                borderRadius: `3px`,
                                fontSize: `18px`,
                                outline: `none`,
                                textOverflow: `ellipses`,
                                position: "absolute",
                                left: "20%",
                                top: '30px'
                            }}
                        />
                    </StandaloneSearchBox>
                </div>
                <div style={{position: 'absolute', right: '10%', display: 'flex'}}>
                    <input type="checkbox" onChange={(e) => setOptimize(e.target.checked)} />
                    <div style={{marginLeft: '10px'}}>Optymalizuj trasę pomiędzy punktami pośrednimi</div>
                </div>
            </div>
            <div style={{display: 'flex', height: '90%', width: '100%'}}>
                <div style={{width: '20%', padding: '0 6px'}}>
                    {mappedPoints().map((point: any) => (
                        <>
                            <div style={{borderRadius: '6px', padding: '8px', marginBottom: '28px', background: 'white', position: 'relative'}}>
                                <h4>{point.name}</h4>
                                <h6>1:00 - 3:00</h6>
                                {point.duration && (<div style={{position: 'absolute', borderRadius: '100%', backgroundColor: 'gray', width: '32px', height: '32px', left: '50%', transform: 'translate(-50%)', fontSize: '13px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', paddingLeft: '4px'}}>
                                    <div style={{marginLeft: '30px', marginTop: '6px'}}>{point.duration.text} by car</div>
                                </div>)}
                            </div>
                        </>
                    ))}
                </div>
                <div style={{width: '80%'}}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={place || center}
                        zoom={12}
                        onClick={(point) => onPointClick(point)}
                        options={{
                         disableDefaultUI: true,
                         zoomControl: true
                        }}
                        onLoad={(map) => onMapLoad(map)}
                    >
                        { /* Child components, such as markers, info windows, etc. */ }
                        <>
                            {
                                waypoints.length > 1 &&
                            <DirectionsService
                                options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                                    origin: waypoints[0],
                                    destination: waypoints[waypoints.length -1],
                                    waypoints: waypoints.slice(1, -1).map(p => ({location: p})),
                                    optimizeWaypoints: optimize,
                                    travelMode: "DRIVING" as unknown as any
                                }}
                                callback={directionsCallback}
                                onLoad={directionsService => {
                                    console.log('DirectionsService onLoad directionsService: ', directionsService)
                                }}
                                onUnmount={directionsService => {
                                    console.log('DirectionsService onUnmount directionsService: ', directionsService)
                                }}
                            />
                            }
                            {
                                (response) && (
                                    <DirectionsRenderer
                                        // required
                                        options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                                            directions: response,
                                            polylineOptions: {
                                                // strokeColor: 'green',
                                                // strokeWeight: 3,
                                                strokeOpacity: 0,
                                                icons: [
                                                    {
                                                        icon: lineSymbol,
                                                        offset: "0",
                                                        repeat: "10px",
                                                    },
                                                ],
                                            },
                                            markerOptions: {
                                                shape: 'circle' as unknown as any,
                                                // label: 'X',
                                                // icon: ''
                                            }
                                        }}
                                        // optional
                                        onLoad={directionsRenderer => {
                                            console.log('DirectionsRenderer onLoad directionsRenderer: ', directionsRenderer)
                                        }}
                                        // optional
                                        onUnmount={directionsRenderer => {
                                            console.log('DirectionsRenderer onUnmount directionsRenderer: ', directionsRenderer)
                                        }}
                                    />
                                )
                            }
                        </>
                    </GoogleMap>
                </div>
            </div>
        </LoadScript>
        </>
    )
}

export default Map;
