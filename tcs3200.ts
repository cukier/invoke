enum color {
    //%block="RED"
    red,
    //%block="GREEN"
    green,
    //%block="BLUE"
    blue
}

namespace tcs3200 {
    let wavecount: number = 0
    let freq = 0
    let oe: number
    let out: number
    let r_factor: number
    let g_factor: number
    let b_factor: number

    function reset_wavecount(t: number): void {
        wavecount = 0
        basic.pause(t)
    }

    //%block="Calibration |OUT %S0|OE %S1|time (ms)%time"
    //%blockExternalInputs=true
    export function calibration(OUT: DigitalPin, OE: DigitalPin, time: number): void {
        out = OUT
        freq = time
        oe = OE

        // set output frequency scale to 2% S0 = 0 S1 = 1
        pins.onPulsed(out, PulseValue.Low, function () {
            wavecount++
        })

        serial.writeLine("Calibrating TCS3200")
        serial.writeLine("ligando o sensor")
        pins.digitalWritePin(oe, 1)
        control.waitMicros(50000)
        pins.digitalWritePin(oe, 0)
        serial.writeLine("setar S2 e S3 para 0")
        basic.showLeds(`
            . # . . .
            # . # # .
            . . . . .
            . . . . .
            . . . . .
            `)
        control.waitForEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_DOWN)
        reset_wavecount(freq)
        r_factor = 255 / wavecount
        serial.writeLine("r_factor ")
        serial.writeNumber(r_factor)
        serial.writeLine("\n\rsetar S2 e S3 para 1")
        basic.showLeds(`
            . # # # .
            # . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
        control.waitForEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_DOWN)
        reset_wavecount(freq)
        g_factor = 255 / wavecount
        serial.writeLine("g_factor ")
        serial.writeNumber(g_factor)
        serial.writeLine("\n\rsetar S2 para 0 e S3 para 1")
        basic.showLeds(`
            . # . # .
            # . # . .
            . . . . .
            . . . . .
            . . . . .
            `)
        control.waitForEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_DOWN)
        reset_wavecount(freq)
        b_factor = 255 / wavecount
        serial.writeLine("b_factor ")
        serial.writeNumber(b_factor)
        serial.writeLine("\n\rcalibragem terminada")
        basic.showString("OK")
        basic.clearScreen()
    }

    //%block="color: %choice"
    export function color_choice(choice: color): number {
        let returnValue: number

        switch (choice) {
            case 0:
                reset_wavecount(freq)
                returnValue = wavecount * r_factor
                serial.writeLine("\n\rvermelho ")
                serial.writeNumber(returnValue)
                break
            case 1:
                reset_wavecount(freq)
                returnValue = wavecount * g_factor
                serial.writeLine("\n\rverde ")
                serial.writeNumber(returnValue)
                break
            case 2:
                reset_wavecount(freq)
                returnValue = wavecount * b_factor
                serial.writeLine("\n\razul ")
                serial.writeNumber(returnValue)
                break
        }

        if (returnValue > 255) {
            return 255
        }

        return returnValue
    }
}
