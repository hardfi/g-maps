import {DirectionsRenderer, DirectionsService, GoogleMap, LoadScript} from "@react-google-maps/api";
import {memo, useEffect, useRef, useState} from "react";

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

type Coords = {
    lat: number;
    lng: number;
}

const libs = ['places'];

const Map = ({focusedCoords}: {focusedCoords?: Coords}) => {
    const count = useRef(0);
    const [center, setCenter] = useState<Coords>({
        lat: 52.745,
        lng: 18.523
    });
    const [waypoints, setWaypoints] = useState<any[]>([]);
    const [waypointsFull, setWaypointsFull] = useState<any[]>([]);
    const [response, setResponse] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (focusedCoords) {
            setCenter(focusedCoords);
        }
    }, [focusedCoords])

    const directionsCallback = (resp: any) => {
        if (resp.status === "OK" && count.current === 0) {
            count.current++;
            console.count();
            setResponse(resp);
            console.log("resp");
            console.log(resp);
            setTimeout(() => count.current = 0, 3000)
        }
    }

    const onPointClick = (point: any) => {
        setWaypointsFull([...waypoints, point]);
        setWaypoints([...waypoints, point.latLng]);
    }

    useEffect(() => {
        setIsLoading(true);
        console.log("waypointsFull")
        console.log(waypointsFull)
    }, [waypoints.length]);

    return (
        <>

        <div style={{width: '20%'}}>
            {waypointsFull.map(point => (
                <div>
                    {/*{point}*/}
                </div>
            ))}
        </div>
        <div style={{width: '80%', height: '100%'}}>

        <LoadScript
            googleMapsApiKey="AIzaSyCoG80ayynkaqKwKeZJ810QF5jyew5SmSE"
            libraries={libs as any[]}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onClick={(point) => onPointClick(point)}
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
                            optimizeWaypoints: true,
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
                                    directions: response
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
        </LoadScript>
        </div>
        </>
    )
}

export default Map;
