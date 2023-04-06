import axios from "axios"

const api = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true
})

export const makeRequest = async (url, options) => {
    try {
        const res = await api(url, options)
        return res.data
    } catch (error) {
        return await Promise.reject(error?.response?.data?.message ?? "Error")
    }
}