import { useEffect, useReducer, useRef } from 'react'
import axios, { AxiosRequestConfig } from 'axios';

export class APIError extends Error {
  public data?: any;
  
  constructor(message?: string, data?: any) {
    super(message);
    this.name = 'API_ERROR';
    this.data = data;
  }
}

interface State<T> {
  data?: T
  error?: Error
}

type Action<T> =
  | { type: 'loading' }
  | { type: 'fetched'; payload: T }
  | { type: 'error'; payload: Error }

function useAxios<T = unknown>(url?: string, options?: AxiosRequestConfig, runOnInit = false): [State<T>, () => Promise<void>] {
  const cancelRequest = useRef<boolean>(false)

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
  }

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case 'loading':
        return { ...initialState }
      case 'fetched':
        return { ...initialState, data: action.payload }
      case 'error':
        return { ...initialState, error: action.payload }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(fetchReducer, initialState)

  const fetchData = async () => {
    dispatch({ type: 'loading' })

    try {
      const response = await axios(url, options)
      const { data } = response.data;
      if (cancelRequest.current) return
      dispatch({ type: 'fetched', payload: data })
    } catch (error) {
      if (cancelRequest.current) return

      if (axios.isAxiosError(error)) {
        dispatch({ type: 'error', payload: new APIError(error.message, error.response.data) })
        return;
      }
      
      dispatch({ type: 'error', payload: error as Error })
    }
  }

  useEffect(() => {
    if (!url) return

    if (runOnInit) {
      fetchData()
    }

    return () => {
      cancelRequest.current = true
    }

  }, [url])

  return [state, fetchData];
}

export default useAxios;
