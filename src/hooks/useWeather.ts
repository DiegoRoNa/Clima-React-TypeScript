import axios from "axios"
import { SearchType } from "../types"
import { z } from "zod"
import { useMemo, useState } from "react"
// import { string, number, object, InferOutput, parse } from "valibot"

// libreria ZOD
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
})

export type Weather = z.infer<typeof Weather>

// VALIBOT
// const WeatherSchema = object({
//     name: string(),
//     main: object({
//         temp: number(),
//         temp_max: number(),
//         temp_min: number()
//     })
// })

// type Weather = InferOutput<typeof WeatherSchema>

export default function useWeather() {

    const initialState = {
        name: '',
        main: {
            temp: 0,
            temp_max: 0,
            temp_min: 0
        }
    }
    const [weather, setWeather] = useState(initialState)

    const [loading, setLoading] = useState(false)
    const [notFount, setNotFount] = useState(false)

    // TYPE GARD O ASSERTION
    // el type "unknown", refiere a un tipo de dato que aun no sabemos cual puede ser
    // function isWeatherResponse(weather : unknown) : weather is Weather {
    //     return (
    //         Boolean(weather) && // exista
    //         typeof weather === 'object' && // debe ser un objeto
    //         typeof (weather as Weather).name === 'string' && // el name debe ser un string
    //         typeof (weather as Weather).main.temp === 'number' && // la temp debe ser number
    //         typeof (weather as Weather).main.temp_max === 'number' && // la temp_max debe ser number
    //         typeof (weather as Weather).main.temp_min === 'number' // la temp_min debe ser number
    //     )
    // }

    const fetchWeather = async (search : SearchType) => {

        setWeather(initialState) // reiniciar state de weather
        setLoading(true) // mostrar spinner 

        try {

            // consultar lat y lon
            const appid = import.meta.env.VITE_API_KEY // las variables de entorno con proyectos en VITE, deben empezar con VITE_
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appid}`
            const {data} = await axios(geoUrl)

            // comprobar si hay info
            if (!data[0]) {
                setNotFount(true)
                return
            }

            const lat = data[0].lat
            const lon = data[0].lon

            // consultar info del clima
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}`
            
            // Con un Type
            // const {data: weatherResult} = await axios<Weather>(weatherUrl)

            // TYPE GARD
            // comprobar con codigo que la respuesta es de tipo weather, ya que TS no lo hace
            // const {data: weatherResult} = await axios(weatherUrl)
            // const result = isWeatherResponse(weatherResult)
            
            // ZOD
            const {data: weatherResult} = await axios(weatherUrl)
            const result = Weather.safeParse(weatherResult) // retorna true si cumple el type que dfinimos, si no false

            if (result.success) {
                setWeather(result.data)
            }

            // VALIBOT 
            // const {data: weatherResult} = await axios(weatherUrl)
            // const result = parse(WeatherSchema, weatherResult)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // verificar que hay datos de la api
    const hasWeatherData = useMemo(() => weather.name , [weather])

    return {
        weather,
        loading,
        notFount,
        fetchWeather,
        hasWeatherData
    }
}