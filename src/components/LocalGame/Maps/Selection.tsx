import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

import MapPreview from "./Preview";
import MapsList from "./List";
import MapsListItem from "./ListItem";
import Spinner from "src/components/Common/Spinner";

import ServerMapsListStore from "src/stores/settings/server/mapsList";
import MapsStore from "src/stores/maps";

import { Map } from "src/types";
import { MapsSelectionUiState } from "src/types/ui";

import "./Selection.css";

type MapsSelectionProps = {
    serverMapsListStore: ServerMapsListStore;
    mapsStore: MapsStore;
    uiState: MapsSelectionUiState;
};

const MapsSelection: React.FC<MapsSelectionProps> = props => {
    const { serverMapsList } = props.serverMapsListStore;

    if (props.mapsStore && !props.mapsStore.maps) {
        props.mapsStore.loadMaps();
    }

    if (!props.serverMapsListStore.isLoading && !serverMapsList) {
        props.serverMapsListStore.loadMapsList();
    }

    // Highlight first map from server's maps' list.
    // We rely on the fact that this component will rerender
    // when we receive server's maps list. 
    const firstMap = serverMapsList?.firstMap;
    if (!props.uiState.highlightedMap && firstMap) {
        props.uiState.highlightedMap = firstMap;
    }

    const handleAddButtonClick = (mapName: string): void => {
        const newMap = serverMapsList.add(mapName);
        props.uiState.highlightedMap = newMap;
    }

    const handleClearClick = (): void => {
        serverMapsList.clear();
    }

    const handleMapClick = (map: Map): void => {
        props.uiState.highlightedMap = map;
    }

    const handleSearchFilterChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.uiState.searchFilter = event.target.value;
    }

    const handleRemoveMap = (mapId: string): void => {
        serverMapsList.remove(mapId);
    }

    const getFilteredMaps = (): Map[] => {
        if (!props.mapsStore) {
            return [];
        }

        return props.mapsStore.getMapsByName(props.uiState.searchFilter);
    }

    const isLoadingServerMapsList = props.serverMapsListStore.isLoading || !serverMapsList;

    return (
        <div className="map-selection-container">
            <div className="map-selection">
                <input
                    className="search-filter"
                    placeholder="Search..."
                    spellCheck={false}
                    value={props.uiState.searchFilter}
                    onChange={handleSearchFilterChange}
                    type="search">
                </input>

                <div className="maps-list-container">
                    <MapsList emptyMessage="No maps found">
                        {getFilteredMaps().map((map: Map) =>
                            <MapsListItem
                                key={map.id}
                                highlighted={props.uiState.highlightedMap?.id === map.id}
                                map={map}
                                onClick={handleMapClick}>
                                <button
                                    className="button green-button"
                                    onClick={(event): void => {
                                        event.stopPropagation();
                                        handleAddButtonClick(map.name)
                                    }}>
                                    <FontAwesomeIcon icon={faPlus}/>
                                </button>
                            </MapsListItem>
                        )}
                    </MapsList>
                </div>

                <div className="maps-list-container">
                    <div className="maps-list-header">
                        <div>Selected:</div>
                        <button
                            className="button red-button"
                            onClick={handleClearClick}>
                            Clear
                        </button>
                    </div>

                    <MapsList emptyMessage="Empty">
                        {isLoadingServerMapsList
                        ? <div className="spinner-container">
                            <Spinner />
                          </div>
                        : serverMapsList.maps.map(map =>
                            <MapsListItem
                                key={map.id}
                                highlighted={props.uiState.highlightedMap?.id === map.id}
                                map={map}
                                onClick={handleMapClick}>
                                <button
                                    className="button red-button"
                                    onClick={(event): void => {
                                        event.stopPropagation();
                                        handleRemoveMap(map.id);
                                    }}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </button>
                            </MapsListItem>
                        )}
                    </MapsList>
                </div>
            </div>
            
            <MapPreview mapName={props.uiState.highlightedMap?.name} />
        </div>
    )
}

export default observer(MapsSelection);