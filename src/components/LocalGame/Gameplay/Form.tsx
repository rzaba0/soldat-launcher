import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import { GameplaySettings } from "src/settings/server";

import Checkbox from "../../Common/Checkbox";
import GameStylesSelection from "./StylesSelection";
import GameStylesTooltip from "../../Common/GameStylesTooltip";
import PointsLimitField from "./PointsLimitField";
import SliderNumberInput from "../../Common/SliderNumberInput";
import Tooltip from "../../Common/Tooltip";

import "../../Common/Form.css";
import "./Form.css";

type GameplayFormProps = {
    gameplaySettings: GameplaySettings;
}

const GameplayForm: React.FC<GameplayFormProps> = props => {
    const gameplay = props.gameplaySettings;

    const handleAdvanceAmountChange = (newValue: number): void => {
        gameplay.styles.advanceAmount = newValue;
    }

    const handleCheckboxToggle = (checked: boolean, fieldName?: string): void => {
        switch (fieldName) {
            case "bullet-time":
                gameplay.bulletTime = checked;
                break;

            case "friendly-fire":
                gameplay.friendlyFire = checked;
                break;

            case "sniper-line":
                gameplay.sniperLine = checked;
                break;

            case "survival-destroy-weapons":
                gameplay.styles.survivalDestroyWeaponsAfterRound = checked;
                break;
        }
    }

    const handleTimeLimitChange = (newTimeLimit: number): void => {
        gameplay.timeLimit = newTimeLimit;
    }

    return (
        <div className="gameplay-form form">
            <div className="field">
                <label className="label" htmlFor="time-limit">
                    Time limit (minutes)
                </label>
                <div className="user-input">
                    <SliderNumberInput
                        min={1}
                        max={120}
                        value={gameplay.timeLimit}
                        onValueChange={handleTimeLimitChange}
                        id="time-limit" />
                </div>
            </div>

            <PointsLimitField
                gameMode={gameplay.mode}
                pointsLimits={gameplay.pointsLimits} />

            <div className="field">
                <label className="label label-with-info">
                    Game styles
                    <FontAwesomeIcon
                        className="info-icon"
                        data-tip
                        data-for="game-styles-tooltip"
                        icon={faInfoCircle} />
                </label>
                <div className="user-input game-styles">
                    <GameStylesSelection gameStyles={gameplay.styles} />
                </div>

                <GameStylesTooltip id="game-styles-tooltip" />
            </div>

            {gameplay.styles.survivalEnabled &&
            <div className="field">
                <label className="label">
                    Survival settings
                </label>
                <div className="user-input">
                    <Checkbox
                        colorTheme="dark"
                        name="survival-destroy-weapons"
                        rightLabel="Destroy all weapons when round ends"
                        checked={gameplay.styles.survivalDestroyWeaponsAfterRound}
                        onToggle={handleCheckboxToggle} />
                </div>
            </div>
            }

            {gameplay.styles.advanceEnabled &&
            <div className="field">
                <label className="label" htmlFor="advance-amount">
                    Advance amount
                </label>
                <div className="user-input">
                    <SliderNumberInput
                        id="advance-amount"
                        min={1}
                        max={25}
                        value={gameplay.styles.advanceAmount}
                        onValueChange={handleAdvanceAmountChange} />
                </div>
            </div>
            }

            <div className="field">
                <label className="label" htmlFor="friendly-fire">
                    Friendly fire
                </label>
                <div className="user-input">
                    <Checkbox
                        colorTheme="dark"
                        id="friendly-fire"
                        name="friendly-fire"
                        checked={gameplay.friendlyFire}
                        onToggle={handleCheckboxToggle} />
                </div>
            </div>

            <div className="field">
                <label className="label label-with-info" htmlFor="bullet-time">
                    Bullet time
                    <FontAwesomeIcon
                        className="info-icon"
                        data-tip
                        data-for="bullet-time-tooltip"
                        icon={faInfoCircle} />
                </label>
                <div className="user-input">
                    <Checkbox
                        colorTheme="dark"
                        id="bullet-time"
                        name="bullet-time"
                        checked={gameplay.bulletTime}
                        onToggle={handleCheckboxToggle} />
                </div>

                <Tooltip id="bullet-time-tooltip">
                    A slow motion bullet time effect appears when all players are near death.
                </Tooltip>                        
            </div>

            <div className="field">
                <label className="label" htmlFor="sniper-line">
                    Sniper line
                </label>
                <div className="user-input">
                    <Checkbox
                        colorTheme="dark"
                        id="sniper-line"
                        name="sniper-line"
                        checked={gameplay.sniperLine}
                        onToggle={handleCheckboxToggle} />
                </div>
            </div>
        </div>
    )
}

export default observer(GameplayForm);