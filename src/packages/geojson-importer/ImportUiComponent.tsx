/* eslint-disable header/header */
import { Box, Button } from "@open-pioneer/chakra-integration";
import { CommonComponentProps } from "@open-pioneer/react-utils";
import { FC, useState } from "react";
import { MapModel, SimpleLayer, useMapModel } from "@open-pioneer/map";
import Map from "ol/Map";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import { Icon, Style } from "ol/style";

export interface ImporterProps extends CommonComponentProps {
    /**
     * The id of the map.
     */
    mapId: string;
}

export const GeoJsonImporter: FC<ImporterProps> = (props) => {
    const { mapId } = props;
    const { map: mapModel } = useMapModel(mapId);
    const [layerId, setLayerId] = useState<number>(1);

    return (
        <Box>
            <Button
                onClick={() => {
                    importGeoJson(mapModel, layerId);
                    setLayerId((prevValue) => prevValue + 1);
                }}
                width={200}
                height={50}
            >
                Import Geojson
            </Button>
        </Box>
    );
};

function importGeoJson(mapModel: MapModel | undefined, layerId: number) {
    if (mapModel?.olMap) {
        const roadWorksSrc = new VectorSource({
            url: "https://geo8.stadt-muenster.de/mapserv/baustellen_serv?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&TYPENAME=ms:baustellen1&OUTPUTFORMAT=GEOJSON&EXCEPTIONS=XML&MAXFEATURES=1000&SRSNAME=EPSG:4326",
            format: new GeoJSON()
        });
        const roadWorksLyr = new VectorLayer({
            source: roadWorksSrc,
            style: new Style({
                image: new Icon({
                    src: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Mauritius_Road_Signs_-_Warning_Sign_-_Road_works.svg",
                    scale: 0.05
                })
            })
        });

        mapModel.layers.addLayer(
            new SimpleLayer({
                title: "Road Works " + layerId,
                olLayer: roadWorksLyr,
                isBaseLayer: false,
                visible: true
            })
        );
    }
}
