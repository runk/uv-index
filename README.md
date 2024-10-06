# uv-index

This module provides an easy way to lookup any location in the world and get the UV index for a specific date. This module is only capable of providing maximum UV index values for a given location and date - it does not provide [hourly data](#hourly-data).

The UV index climatology is a measure of the intensity of ultraviolet (UV) rays from the Sun received on average during a month. The index is a scale of 0 to 16+, with 0 representing minimal UV exposure risk and values higher than 11 posing an extreme risk.

Data is derived from the [NASA Earth Observations](https://neo.gsfc.nasa.gov/view.php?datasetId=AURA_UVI_CLIM_M) and repackaged.

## Performance

The module is designed to be fast and efficient. The data is stored in a binary format and is loaded into memory when the module is initialized. Memory footprint is expected to be around 1.5MB in total.

## Usage

```typescript
import initUvIndex from 'uv-index';

const lookup = await initUvIndex();
const uv = lookup(new Date('2025-01-15'), -33.86785, 151.20732);
```

## References

- https://neo.gsfc.nasa.gov/view.php?datasetId=AURA_UVI_CLIM_M

## Hourly Data

This module provides UV Index values at solar noon - maximum value for the day. If you need hourly data, one of the possible ways to achieve it is to build a simple model and interpolate the values. Knowing sunrise, sunset, and solar noon times, you can estimate the UV Index values for each hour of the day.

---

This module was developed and maintained by [WeatherPoint](https://weatherpoint.com.au/), a leading provider of cutting-edge solutions for weather forecasts. For more information about WeatherPoint and their services, visit their website at https://weatherpoint.com.au/ or check out their other open-source projects.
