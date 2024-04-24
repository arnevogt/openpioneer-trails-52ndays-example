/* eslint-disable header/header */
import { Box, Flex } from "@open-pioneer/chakra-integration";
import { MapContainer, MapAnchor } from "@open-pioneer/map";
import { MAP_ID } from "./services";
import { Toc } from "@open-pioneer/toc";
import { useIntl } from "open-pioneer:react-hooks";
import { GeoJsonImporter } from "geojson-importer";

export function MyApp() {
    useIntl();

    return (
        <Flex height="100%" direction="column" overflow="hidden">
            <MapContainer mapId={MAP_ID} role="main">
                <MapAnchor position="top-left" horizontalGap={5} verticalGap={5}>
                    <Box
                        backgroundColor="white"
                        borderWidth="1px"
                        borderRadius="lg"
                        padding={2}
                        boxShadow="lg"
                        width={350}
                        maxWidth={350}
                        overflow="auto"
                    >
                        <Toc mapId={MAP_ID} />
                    </Box>
                </MapAnchor>
                <MapAnchor position="bottom-left" horizontalGap={5} verticalGap={5}>
                    <Box
                        backgroundColor="white"
                        borderWidth="1px"
                        borderRadius="lg"
                        padding={2}
                        boxShadow="lg"
                        width={350}
                        maxWidth={350}
                        overflow="auto"
                    >
                        <GeoJsonImporter mapId={MAP_ID} />
                    </Box>
                </MapAnchor>
            </MapContainer>
        </Flex>
    );
}
