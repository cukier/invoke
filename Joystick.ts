namespace Joystick {
    let wavecount: number = 0
    let up_factor: number
    let do_factor: number
    let le_factor: number
    let ri_factor: number
    let histerese: number = 20

    function reset_wavecount(t: number): void {
        wavecount = 0
        basic.pause(t)
    }

    //%block="Calibration |S0 %S0"
    //%blockExternalInputs=true
    export function calibration(S0: DigitalPin): void {
        pins.onPulsed(S0, PulseValue.Low, function () {
            wavecount++
        })

        serial.writeLine("\n\rbotao cima")
        basic.showString("UP")
        control.waitForEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_DOWN)
        reset_wavecount(100)
        up_factor = wavecount
        serial.writeString("up_factor ")
        serial.writeNumber(up_factor)

        serial.writeLine("\n\rbotao baixo")
        basic.showString("DO")
        control.waitForEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_DOWN)
        reset_wavecount(100)
        do_factor = wavecount
        serial.writeString("do_factor ")
        serial.writeNumber(do_factor)

        serial.writeLine("\n\rbotao esq")
        basic.showString("LE")
        control.waitForEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_DOWN)
        reset_wavecount(100)
        le_factor = wavecount
        serial.writeString("le_factor ")
        serial.writeNumber(le_factor)

        serial.writeLine("\n\rbotao dir")
        basic.showString("RI")
        control.waitForEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_DOWN)
        reset_wavecount(100)
        ri_factor = wavecount
        serial.writeString("ri_factor ")
        serial.writeNumber(ri_factor)

        serial.writeLine("\n\rfim")
    }

    //%block="Run |S0 %S0"
    //%blockExternalInputs=true
    export function run(S0: DigitalPin): number {
        pins.onPulsed(S0, PulseValue.Low, function () {
            wavecount++
        })

        reset_wavecount(100)
        serial.writeString("\n\rwavecount ")
        serial.writeNumber(wavecount)

        if ((wavecount >= (up_factor - histerese)) && (wavecount < (up_factor + histerese)))
            return 1
        else if ((wavecount >= (do_factor - histerese)) && (wavecount < (do_factor + histerese)))
            return 2
        else if ((wavecount >= (le_factor - histerese)) && (wavecount < (le_factor + histerese)))
            return 3
        else if ((wavecount >= (ri_factor - histerese)) && (wavecount < (ri_factor + histerese)))
            return 4

        return 0
    }
}