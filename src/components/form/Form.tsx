import { useState, ChangeEvent, FormEvent } from "react";
import { countries } from "../../data/countries";
import styles from './Form.module.css'
import { SearchType } from "../../types";
import Alert from "../Alert/Alert";

type FormProps = {
    fetchWeather: (search: SearchType) => Promise<void> // sacar con VSC
}

export default function Form({fetchWeather} : FormProps) {

    const [search, setSearch] = useState<SearchType>({city: '', country: ''})
    const [alert, setAlert] = useState('')

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setSearch({
            ...search,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // validar campos vacios
        if (Object.values(search).includes('')) {
            setAlert('Todos los campos son obligatorios')
            return
        }

        fetchWeather(search)
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>

            {alert && <Alert>{alert}</Alert>}

            <div className={styles.field}>
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" placeholder="Ciudad" onChange={handleChange} value={search.city} />
            </div>

            <div className={styles.field}>
                <label htmlFor="country">País</label>
                <select name="country" id="country" value={search.country} onChange={handleChange}>
                    <option value="">-- Selecciona un país --</option>
                    {countries.map(country => (
                        <option value={country.code} key={country.code}>{country.name}</option>
                    ))}
                </select>
            </div>

            <input className={styles.submit} type="submit" value="Consultar clima" />
        </form>
    )
}
