import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Map from "@/pages/map";
import {LoadScript, StandaloneSearchBox} from '@react-google-maps/api';
import {useEffect, useRef, useState} from "react";

const libs = ['places'];

export default function Home() {
    const [place, setPlace] = useState();
    const inputRef = useRef<any>(null);

    const onLoad = (ref: any) => {
        inputRef.current = ref;
    }
    const onPlacesChanged = () => {
        const placesFound = inputRef.current?.getPlaces();
        if (placesFound?.length) {
            setPlace(placesFound[0].geometry.location)
        }
    }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
          <div>
              <LoadScript
                  googleMapsApiKey="AIzaSyCoG80ayynkaqKwKeZJ810QF5jyew5SmSE"
                  libraries={libs as any[]}
              >
                  <StandaloneSearchBox
                      onLoad={onLoad}
                      onPlacesChanged={onPlacesChanged}
                  >
                      <input
                          type="text"
                          placeholder="Customized your placeholder"
                          style={{
                              boxSizing: `border-box`,
                              border: `1px solid transparent`,
                              width: `240px`,
                              height: `32px`,
                              padding: `0 12px`,
                              borderRadius: `3px`,
                              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                              fontSize: `14px`,
                              outline: `none`,
                              textOverflow: `ellipses`,
                              position: "absolute",
                              left: "50%",
                              marginLeft: "-120px"
                          }}
                      />
                  </StandaloneSearchBox>
              </LoadScript>
          </div>
          <div style={{width: '100%', height: '80vh'}}>
            <Map focusedCoords={place} />
          </div>
      </main>
    </>
  )
}
