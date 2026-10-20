-- SEED DATA: GEOSPATIAL ENGINEERING & CLOUD GIS
-- Auto-generated SQL seed

DO $$
DECLARE
  c_id UUID;
  m_id UUID;
  l_id UUID;
BEGIN
  DELETE FROM public.courses WHERE slug = 'gis-engineering-cloud';

  INSERT INTO public.courses (title, slug, description, is_published, thumbnail_url)
  VALUES ('Geospatial Engineering & Cloud GIS', 'gis-engineering-cloud', 'প্রোডাকশন-গ্রেড জিওস্পেশিয়াল ইঞ্জিনিয়ারিং — PostgreSQL/PostGIS, Spatial SQL, Python (GeoPandas/Rasterio), Google Earth Engine, R Spatial এবং Web GIS।', TRUE, '/images/courses/gis-engineering-cloud.png')
  RETURNING id INTO c_id;

  -- Module: Module 1: PostgreSQL + PostGIS Setup
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 1: PostgreSQL + PostGIS Setup', 'mod1-postgis-setup', 1, 'এন্টারপ্রাইজ স্পেশিয়াল ডাটাবেজ — PostgreSQL এ PostGIS ইন্সটল ও ডেটা ইনজেশন।')
  RETURNING id INTO m_id;

  -- Lesson: 1. PostGIS: Spatial Database পরিচিতি
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. PostGIS: Spatial Database পরিচিতি', 'postgis-intro-setup', 1, $markdown$
# Lesson 1: PostGIS — Spatial Database

## কেন Spatial Database?
Shapefile ও GeoPackage ফাইল-ভিত্তিক। কিন্তু যখন:
- হাজার হাজার ব্যবহারকারী একই ডেটা ব্যবহার করবে
- মিলিয়ন+ ফিচার নিয়ে কাজ করতে হবে
- ওয়েব অ্যাপে ডেটা সার্ভ করতে হবে

তখন **Spatial Database** অপরিহার্য।

## PostGIS কী?
**PostGIS** = PostgreSQL ডাটাবেজের জন্য **Spatial Extension**। এটি PostgreSQL কে বিশ্বের সবচেয়ে শক্তিশালী ওপেন সোর্স GIS ডাটাবেজে রূপান্তর করে।

## Setup:
```sql
-- PostGIS চালু করা
CREATE EXTENSION IF NOT EXISTS postgis;
SELECT PostGIS_Full_Version();
```

## ডেটা ইনজেশন (ogr2ogr):
```bash
ogr2ogr -f "PostgreSQL" PG:"host=localhost dbname=geodb" parcels.gpkg -nln cadastral_parcels
```

## সারসংক্ষেপ
1. PostGIS = PostgreSQL + Spatial Capabilities
2. Enterprise-grade, multi-user, scalable
3. SQL দিয়ে স্পেশিয়াল বিশ্লেষণ
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 2: Spatial SQL Mastery
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 2: Spatial SQL Mastery', 'mod2-spatial-sql', 2, 'Geometry Constructors, Spatial Joins, ST_Intersects, ST_DWithin ও GIST Indexing।')
  RETURNING id INTO m_id;

  -- Lesson: 1. Spatial SQL: Geometry ও Spatial Join
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. Spatial SQL: Geometry ও Spatial Join', 'spatial-sql-geometry-joins', 1, $markdown$
# Lesson 1: Spatial SQL

## PostGIS Geometry Functions:
```sql
-- Point তৈরি
SELECT ST_SetSRID(ST_MakePoint(90.4125, 23.8103), 4326);

-- Polygon তৈরি
SELECT ST_GeomFromText('POLYGON((90.3 24.6, 90.5 24.6, 90.5 24.8, 90.3 24.8, 90.3 24.6))', 4326);

-- CRS Transform
SELECT ST_Transform(ST_SetSRID(ST_MakePoint(90.4125, 23.8103), 4326), 32646);
```

## Spatial Join:
```sql
-- প্রতিটি জেলায় কতটি আবহাওয়া স্টেশন আছে?
SELECT d.district_name, COUNT(s.id) AS station_count
FROM districts d
LEFT JOIN weather_stations s ON ST_Contains(d.geom, s.geom)
GROUP BY d.district_name;
```

## GIST Index:
```sql
CREATE INDEX idx_geom ON parcels USING GIST (geom);
```

## সারসংক্ষেপ
1. PostGIS functions: ST_MakePoint, ST_Contains, ST_DWithin
2. Spatial Join = Location-based table join
3. GIST Index = O(log N) spatial queries
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 3: Python Spatial Stack
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 3: Python Spatial Stack', 'mod3-python-spatial', 3, 'GeoPandas, Shapely, Rasterio — Python দিয়ে স্পেশিয়াল বিশ্লেষণ।')
  RETURNING id INTO m_id;

  -- Lesson: 1. GeoPandas ও Shapely: Vector Pipelines
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. GeoPandas ও Shapely: Vector Pipelines', 'geopandas-shapely-intro', 1, $markdown$
# Lesson 1: GeoPandas — Python এ Spatial Data Science

## GeoPandas কী?
pandas এর spatial extension — DataFrame এ geometry column যোগ করে।

```python
import geopandas as gpd

# GeoPackage পড়া
parcels = gpd.read_file("data/parcels.gpkg")
print(parcels.head())

# CRS পরিবর্তন
parcels_utm = parcels.to_crs(epsg=32646)

# ক্ষেত্রফল গণনা (হেক্টরে)
parcels_utm["area_ha"] = parcels_utm.geometry.area / 10000
```

## Spatial Join:
```python
wells = gpd.read_file("data/wells.geojson").to_crs(parcels_utm.crs)
result = gpd.sjoin(wells, parcels_utm, how="inner", predicate="within")
```

## সারসংক্ষেপ
1. GeoPandas = pandas + spatial
2. .to_crs() দিয়ে CRS বদলান
3. gpd.sjoin() দিয়ে Spatial Join
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 4: GDAL/OGR CLI Automation
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 4: GDAL/OGR CLI Automation', 'mod4-gdal-ogr', 4, 'Command-line দিয়ে Raster/Vector প্রসেসিং — gdalwarp, gdal_translate, ogr2ogr।')
  RETURNING id INTO m_id;

  -- Lesson: 1. GDAL/OGR: Command-Line GIS Automation
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. GDAL/OGR: Command-Line GIS Automation', 'gdal-ogr-cli', 1, $markdown$
# Lesson 1: GDAL/OGR CLI

## GDAL কী?
সব GIS সফটওয়্যারের পেছনে থাকা **মূল ইঞ্জিন** — 200+ ফরম্যাট পড়তে ও লিখতে পারে।

## মূল কমান্ড:

### gdalwarp (Reproject + Clip):
```bash
gdalwarp -t_srs EPSG:32646 -r bilinear input.tif output_utm.tif
gdalwarp -cutline boundary.shp -crop_to_cutline dem.tif dem_clipped.tif
```

### gdal_translate (Format Convert):
```bash
gdal_translate input.tif output_cog.tif -co TILED=YES -co COMPRESS=DEFLATE
```

### ogr2ogr (Vector Convert + Filter):
```bash
ogr2ogr -f "GeoJSON" output.geojson input.shp -where "land_use = 'Agriculture'"
```

## সারসংক্ষেপ
1. GDAL (Raster) + OGR (Vector) = CLI GIS Engine
2. Batch processing ও automation এ অপরিহার্য
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 5: Google Earth Engine Architecture
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 5: Google Earth Engine Architecture', 'mod5-gee-architecture', 5, 'GEE ক্লাউড আর্কিটেকচার, Server-Side Computation ও Multi-Petabyte Collections।')
  RETURNING id INTO m_id;

  -- Lesson: 1. GEE: Planetary-Scale Earth Observation
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. GEE: Planetary-Scale Earth Observation', 'gee-cloud-intro', 1, $markdown$
# Lesson 1: Google Earth Engine

## GEE কেন বিপ্লবী?
আগে: 100 GB স্যাটেলাইট ইমেজ ডাউনলোড → লোকাল প্রসেসিং → দিনের পর দিন
এখন: GEE তে ব্রাউজারে কোড লিখুন → Google এর সার্ভারে সেকেন্ডে প্রসেস!

## মূল ধারণা:
- **Lazy Evaluation:** আউটপুট চাওয়ার আগে কিছুই প্রসেস হয় না
- **Server-Side Objects:** ee.Image, ee.ImageCollection — এগুলো Google এর সার্ভারে চলে

## কোড উদাহরণ (JavaScript):
```javascript
var aoi = ee.Geometry.Point([90.4125, 23.8103]).buffer(10000);

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi)
  .filterDate('2026-01-01', '2026-06-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15));

var composite = s2.median().clip(aoi);
Map.addLayer(composite, {bands: ['B4','B3','B2'], min: 0, max: 3000}, 'True Color');
```

## সারসংক্ষেপ
1. GEE = ক্লাউড-ভিত্তিক Petabyte-scale GIS
2. ডাউনলোড ছাড়াই বিশ্লেষণ
3. JavaScript বা Python API
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 6: GEE Time-Series ও Export
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 6: GEE Time-Series ও Export', 'mod6-gee-timeseries', 6, 'NDVI Phenology, Flood Mapping, Time-Series Chart ও Export Pipeline।')
  RETURNING id INTO m_id;

  -- Lesson: 1. GEE NDVI Time-Series ও Flood Mapping
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. GEE NDVI Time-Series ও Flood Mapping', 'gee-ndvi-flood', 1, $markdown$
# Lesson 1: GEE NDVI Time-Series

## NDVI Time-Series Chart:
```javascript
function addNDVI(image) {
  return image.addBands(image.normalizedDifference(['B8','B4']).rename('NDVI'));
}

var withNDVI = s2.map(addNDVI);

var chart = ui.Chart.image.seriesByRegion({
  imageCollection: withNDVI.select('NDVI'),
  regions: farmParcels,
  reducer: ee.Reducer.mean(),
  scale: 10
});
print(chart);
```

## Flood Mapping (SAR):
```javascript
var before = ee.Image('COPERNICUS/S1_GRD/S1A_IW_GRDH_..._pre');
var after = ee.Image('COPERNICUS/S1_GRD/S1A_IW_GRDH_..._post');
var flood = after.select('VV').lt(-15).and(before.select('VV').gt(-15));
```

## সারসংক্ষেপ
1. NDVI Time-Series = ফসলের বৃদ্ধি চক্র ট্র্যাক
2. SAR (Radar) = মেঘ ভেদ করে বন্যা ম্যাপিং
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 7: R Spatial Stack
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 7: R Spatial Stack', 'mod7-r-spatial', 7, 'R দিয়ে Spatial Data Science — sf, terra, tmap, spdep।')
  RETURNING id INTO m_id;

  -- Lesson: 1. R Spatial: sf, terra ও tmap
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. R Spatial: sf, terra ও tmap', 'r-sf-terra-tmap', 1, $markdown$
# Lesson 1: R Spatial Stack

## R এ Spatial ডেটা
R এ দুটি মূল প্যাকেজ:
- **sf** (Simple Features): Vector ডেটা
- **terra**: Raster ডেটা

## sf দিয়ে Vector কাজ:
```r
library(sf)

# Shapefile পড়া
districts <- st_read("bangladesh_districts.shp")

# CRS পরিবর্তন
districts_utm <- st_transform(districts, crs = 32646)

# ক্ষেত্রফল গণনা
districts_utm$area_km2 <- as.numeric(st_area(districts_utm)) / 1e6

# Spatial Join
wells <- st_read("wells.geojson") |> st_transform(32646)
wells_with_district <- st_join(wells, districts_utm)
```

## tmap দিয়ে ম্যাপ:
```r
library(tmap)
tm_shape(districts_utm) +
  tm_polygons("Rice_Yield", palette = "RdYlGn", title = "ধান উৎপাদন (টন/হে.)") +
  tm_layout(title = "বাংলাদেশ ধান উৎপাদন মানচিত্র")
```

## সারসংক্ষেপ
1. sf = R এ Vector GIS
2. terra = R এ Raster GIS
3. tmap = Publication-grade ম্যাপ
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 8: Spatial Statistics
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 8: Spatial Statistics', 'mod8-spatial-statistics', 8, 'Spatial Autocorrelation — Moran''s I, LISA, Hot-Spot Analysis।')
  RETURNING id INTO m_id;

  -- Lesson: 1. Moran's I ও LISA: Spatial Autocorrelation
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. Moran''s I ও LISA: Spatial Autocorrelation', 'morans-i-lisa', 1, $markdown$
# Lesson 1: Spatial Autocorrelation

## Tobler's First Law of Geography:
> "সবকিছু সবকিছুর সাথে সম্পর্কিত, কিন্তু কাছের জিনিস দূরের জিনিসের চেয়ে বেশি সম্পর্কিত।"

## Global Moran's I:
- **I > 0:** Clustering (উচ্চ মানের কাছে উচ্চ, নিম্ন মানের কাছে নিম্ন)
- **I ≈ 0:** Random (কোন প্যাটার্ন নেই)
- **I < 0:** Dispersion (Checkerboard প্যাটার্ন)

## LISA (Local Moran's I):
- **High-High:** Hotspot 🔴 (দারিদ্র্য ক্লাস্টার)
- **Low-Low:** Coldspot 🔵
- **High-Low / Low-High:** Outlier

## Python Implementation:
```python
from libpysal.weights import Queen
from esda.moran import Moran, Moran_Local

w = Queen.from_dataframe(gdf)
w.transform = 'R'

moran = Moran(gdf["poverty_rate"], w)
print(f"Moran's I: {moran.I:.4f}, p: {moran.p_sim:.4f}")
```

## সারসংক্ষেপ
1. Spatial Autocorrelation = কাছের জিনিসের সাদৃশ্য পরিমাপ
2. Global Moran's I = সামগ্রিক clustering
3. LISA = স্থানীয় hotspot/coldspot চিহ্নিতকরণ
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 9: Web GIS ও GeoServer
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 9: Web GIS ও GeoServer', 'mod9-webgis-geoserver', 9, 'GeoServer, WMS, WFS এবং Leaflet দিয়ে Interactive Web Map।')
  RETURNING id INTO m_id;

  -- Lesson: 1. GeoServer ও Web Map তৈরি
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. GeoServer ও Web Map তৈরি', 'geoserver-web-map', 1, $markdown$
# Lesson 1: Web GIS ও GeoServer

## Web GIS কেন?
আপনার GIS বিশ্লেষণ শেষ — এখন এটি **ওয়েবে শেয়ার** করতে চান যাতে অন্যরা ব্রাউজারেই দেখতে পারে।

## GeoServer:
- OGC Standard: **WMS** (Map Images), **WFS** (Vector Data), **WCS** (Raster Data)
- PostGIS ডাটাবেজ সরাসরি সার্ভ করতে পারে

## Leaflet দিয়ে Interactive Map:
```html
<script>
var map = L.map('map').setView([23.81, 90.41], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    layers: 'workspace:layer_name',
    format: 'image/png',
    transparent: true
}).addTo(map);
</script>
```

## সারসংক্ষেপ
1. GeoServer = Spatial Layer ওয়েবে প্রকাশ
2. WMS = ম্যাপ ইমেজ, WFS = ভেক্টর ডেটা
3. Leaflet = Interactive web map
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 10: Production Capstone
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 10: Production Capstone', 'mod10-production-capstone', 10, 'End-to-End Precision Agriculture Pipeline — ডেটা সংগ্রহ থেকে Web Map পর্যন্ত।')
  RETURNING id INTO m_id;

  -- Lesson: 1. ক্যাপস্টোন: End-to-End Precision Agriculture Pipeline
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. ক্যাপস্টোন: End-to-End Precision Agriculture Pipeline', 'capstone-precision-agriculture', 1, $markdown$
# 🎓 Final Capstone: End-to-End Precision Agriculture Pipeline

## প্রকল্প লক্ষ্য
সম্পূর্ণ pipeline তৈরি করুন: ডেটা সংগ্রহ → প্রসেসিং → বিশ্লেষণ → Web Map

## Architecture:
```
Field Data (KoboToolbox GPS)
    ↓
Satellite Imagery (GEE → NDVI Export)
    ↓
PostGIS Database (ogr2ogr Ingestion)
    ↓
Spatial Analysis (Python/R → Zonal Stats)
    ↓
GeoServer (WMS/WFS Publishing)
    ↓
Leaflet Web Map (Interactive Dashboard)
```

## মূল্যায়ন: ১০০ পয়েন্ট
- GEE থেকে NDVI Export: ১৫
- PostGIS Database ডিজাইন: ১৫
- Python/R Analysis Script: ২০
- Spatial Statistics (Moran's I): ১৫
- GeoServer Layer Publishing: ১৫
- Leaflet Web Map: ২০

## 🎉 অভিনন্দন!
আপনি এখন একজন **Geospatial Engineer**! আপনি desktop GIS, cloud GIS, spatial databases, programming, এবং web GIS — সবকিছু জানেন।
$markdown$, NULL)
  RETURNING id INTO l_id;

END $$;
