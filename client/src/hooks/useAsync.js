import { useCallback, useEffect, useState } from "react"

export const useAsync = (func, dependencies = []) => {
    const { execute, ...state } = useAsyncInternal(func, dependencies, true)

    useEffect(() => {
        execute()
        // eslint-disable-next-line
    }, [execute])

    return state
}

export const useAsyncFn = (func, dependencies = []) => {
    return useAsyncInternal(func, dependencies, false)
}

const useAsyncInternal = (funcn, dependencies, initialLoading = false) => {
    const [loading, setLoading] = useState(initialLoading)
    const [error, setError] = useState()
    const [value, setValue] = useState()

    const execute = useCallback((...params) => {
        setLoading(true)
        return funcn(...params)
            .then(data => {
                setValue(data)
                setError(error)
                return value
            })
            .catch(error => {
                setError(error)
                setValue(undefined)
                return Promise.reject(error)
            })
            .finally(() => {
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies)

    return { loading, error, value, execute }
}
