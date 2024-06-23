import React, { useEffect, useState } from 'react'

const useDebounce = (value, ms) => {
  const [decounceValue, setDecounceValue] = useState('')

  useEffect(() => {

    const setTimeoutId = setTimeout(() => {
      setDecounceValue(value)
    }, ms);

    return () => {
      clearTimeout(setTimeoutId)
    }

  }, [value, ms])

  return decounceValue
}

export default useDebounce