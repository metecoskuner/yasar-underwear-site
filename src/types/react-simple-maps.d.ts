declare module 'react-simple-maps' {
  import React from 'react'

  interface Geography {
    rsmKey: string
    properties?: Record<string, unknown>
  }

  interface GeographiesProps {
    geographies: Geography[]
  }

  interface ComposableMapProps {
    projection?: string
    projectionConfig?: {
      scale?: number
      center?: [number, number]
    }
    children?: React.ReactNode
  }

  interface ZoomableGroupProps {
    center?: [number, number]
    zoom?: number
    minZoom?: number
    maxZoom?: number
    children?: React.ReactNode
  }

  interface GeographyProps {
    geography: Geography
    style?: {
      default?: React.CSSProperties
      hover?: React.CSSProperties
      pressed?: React.CSSProperties
    }
  }

  interface MarkerProps {
    coordinates: [number, number]
    children?: React.ReactNode
  }

  export const ComposableMap: React.FC<ComposableMapProps>
  export const Geographies: React.FC<{
    geography: string
    children: (props: GeographiesProps) => React.ReactNode
  }>
  export const Geography: React.FC<GeographyProps>
  export const Marker: React.FC<MarkerProps>
  export const ZoomableGroup: React.FC<ZoomableGroupProps>
}
