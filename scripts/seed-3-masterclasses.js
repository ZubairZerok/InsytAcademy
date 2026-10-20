require('./load-env');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cisulrzguxljaxgogbzi.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const COURSES = [
  {
    title: "The Ultimate GIS Masterclass: Desktop, Cloud & Spatial Programming",
    slug: "gis-masterclass",
    description: "The definitive end-to-end geospatial engineering masterclass. Master QGIS, ArcGIS Pro, Google Earth Engine, PostgreSQL/PostGIS spatial databases, Python (GeoPandas, Rasterio, GDAL, PySAL, Xarray), and R (sf, terra, spdep) across a complete 4-phase production blueprint.",
    thumbnail_url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    modules: [
      {
        title: "Phase 1: Foundations, Geodesy & Cartography",
        slug: "gis-foundations-cartography",
        description: "Coordinate reference systems, projections, spatial data primitives, topology, and cartographic layout design.",
        order_index: 1,
        lessons: [
          {
            title: "Coordinate Reference Systems (CRS) & Projections: EPSG, Datums & Distortion",
            slug: "crs-projections-datums",
            order_index: 1,
            video_url: "https://www.youtube.com/watch?v=kIID5FDi2JQ",
            content: `# Coordinate Reference Systems (CRS) & Projections

Geospatial data is fundamentally tied to Earth's geometry, which is an irregular oblate spheroid (geoid). Understanding how we mathematically flatten the Earth onto a 2D surface is the single most important foundation of GIS.

## 1. Geographic vs. Projected Coordinate Systems

* **Geographic Coordinate Systems (GCS):**
  * Expressed in angular units (degrees, minutes, seconds).
  * Example: **WGS84 (EPSG:4326)** — standard GPS coordinates $(Latitude, Longitude)$.
  * **Critical Caveat:** You CANNOT accurately calculate distance in meters or area in square kilometers directly on a GCS without spherical trigonometry! A degree of longitude at the equator is $\\approx 111.32\\text{ km}$, but at $60^\\circ$ latitude it is only $\\approx 55.8\\text{ km}$.

* **Projected Coordinate Systems (PCS):**
  * Mathematically projects the 3D ellipsoid onto a developable 2D flat plane (cylinder, cone, or planar tangent).
  * Expressed in linear units (meters, feet).
  * Example: **UTM (Universal Transverse Mercator, EPSG:32631 to 32660)** — minimizes distortion within 60 distinct $6^\\circ$ longitudinal zones.
  * Example: **Web Mercator (EPSG:3857)** — used by Google Maps, Mapbox, and OpenStreetMap. Great for navigation angles, disastrous for polar area calculations (Greenland appears the size of Africa).

## 2. The 3 Types of Projection Distortion (Tissot's Indicatrix)

Every map projection must sacrifice at least one geometric property:
1. **Conformal (e.g., Mercator):** Preserves local angles and shapes. Distorts area.
2. **Equivalent / Equal-Area (e.g., Albers Equal Area, Lambert):** Preserves true area calculations. Distorts shapes and angles. Mandatory for agricultural yield estimation and deforestation tracking.
3. **Equidistant:** Preserves true distance from one or two specified points.

## 3. Reprojecting Vector Data in Python (GeoPandas)

\`\`\`python
import geopandas as gpd

# Read vector shapefile or GeoPackage
gdf = gpd.read_file("agricultural_parcels.geojson")
print(f"Original CRS: {gdf.crs}")  # EPSG:4326 (degrees)

# Reproject to local projected UTM zone (meters)
gdf_utm = gdf.to_crs(epsg=32646)  # UTM Zone 46N
print(f"Projected CRS: {gdf_utm.crs}")

# Calculate true physical area in hectares (1 ha = 10,000 m²)
gdf_utm["area_ha"] = gdf_utm.geometry.area / 10000.0
print(gdf_utm[["id", "area_ha"]].head())
\`\`\`

## Key Takeaway
Never execute spatial operations (buffers, distance matrices, area metrics) in an unprojected geographic CRS (like EPSG:4326). Always transform to an appropriate local projected equal-area or equidistant CRS first!`,
            quiz: {
              question: "Why should you never calculate polygon areas directly using EPSG:4326 without reprojection?",
              options: [
                "EPSG:4326 stores coordinates in angular degrees, so area calculations do not equal true metric area and vary wildly by latitude",
                "EPSG:4326 files are corrupted whenever area functions are called",
                "EPSG:4326 only supports point data and cannot hold polygons",
                "EPSG:4326 is an outdated military standard that modern software rejects"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Spatial Data Primitives: Vector Topologies vs. Continuous Rasters",
            slug: "vector-primitives-vs-rasters",
            order_index: 2,
            video_url: "https://www.youtube.com/watch?v=0kGgWb8Vj5c",
            content: `# Spatial Data Primitives: Vectors vs. Rasters

All geospatial intelligence is encoded into two fundamental data models: Vector and Raster.

## 1. Vector Data Model (Discrete Features)

Vectors model distinct objects in the real world using coordinate geometry:
* **Points:** Zero-dimensional coordinates $(X, Y, Z)$. E.g., weather stations, soil sensor nodes, disease outbreak sites.
* **LineStrings (Polyline):** One-dimensional sequence of connected vertices. E.g., rivers, irrigation canals, road networks.
* **Polygons / MultiPolygons:** Two-dimensional enclosed rings with area and perimeter. E.g., agricultural field boundaries, administrative districts.

### Vector Formats:
* **GeoPackage (\`.gpkg\`):** Modern SQLite-based open standard. Single file, fast, supports multiple layers and spatial indexes. Replaces legacy Shapefiles.
* **Shapefile (\`.shp\`):** Legacy Esri format requiring at least 3 files (\`.shp\`, \`.shx\`, \`.dbf\`). 2GB file size limit and 10-character field name limitation.
* **GeoJSON:** Human-readable text format. Perfect for web GIS and APIs, but slow for large multi-megabyte datasets.

## 2. Raster Data Model (Continuous Phenomena)

Rasters represent continuous fields or gridded surfaces:
* Organized as a grid of pixels (cells), where each cell holds a value (elevation, temperature, reflectance).
* Defined by:
  * **Origin coordinate:** $(X_{min}, Y_{max})$.
  * **Pixel resolution (ground sample distance):** E.g., 10m $\\times$ 10m for Sentinel-2.
  * **Number of bands:** E.g., Red, Green, Blue, Near-Infrared (NIR), Short-Wave Infrared (SWIR).
* **Common Formats:** Cloud-Optimized GeoTIFF (COG), NetCDF (\`.nc\`), HDF5.

## 3. Comparing Data Structures

| Dimension | Vector Model | Raster Model |
|---|---|---|
| **Representation** | Discrete boundaries | Continuous surfaces |
| **Data Size** | Compact for sparse features | Large, grows with grid resolution |
| **Analysis Focus** | Network routing, containment, parcel ownership | Surface modeling, vegetation index math, hydrology |
| **Primary Libraries** | GeoPandas, Shapely, \`sf\` | Rasterio, GDAL, \`terra\`, Xarray |`,
            quiz: {
              question: "Which file format is the modern, single-file SQLite-based standard recommended to replace legacy multi-file Shapefiles?",
              options: [
                "GeoPackage (.gpkg)",
                "KML (.kml)",
                "Comma-Separated Values (.csv)",
                "Autodesk DXF (.dxf)"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Cartographic Layout Composer & Visual Hierarchy in QGIS",
            slug: "qgis-cartographic-layout-composer",
            order_index: 3,
            video_url: "https://www.youtube.com/watch?v=SJZZF-6jK_M",
            content: `# Professional Cartography with QGIS Layout Composer

Making a map is not just generating colored polygons; it is effective visual communication for decision-makers, executives, and scientific publications.

## 1. Essential Elements of Publication-Ready Maps

Every professional map requires 6 fundamental components:
1. **Clear Visual Hierarchy:** The primary subject must stand out against muted, contextual basemap layers.
2. **Dynamic Scale Bar:** Always configured to scale units (km/m) that adapt if the map viewport is zoomed.
3. **North Arrow:** Consistent orientation indicator.
4. **Contextual Legend:** Labeled with human-readable titles, excluding raw database field names (e.g., write "Mean Annual Precipitation (mm)" instead of \`precip_ann_mean_v2\`).
5. **Metadata & Attribution:** CRS projection details (e.g., "Projection: UTM Zone 46N / WGS84"), author, date, and data sources (e.g., "Data: USGS / Copernicus").
6. **Overview / Inset Map:** Shows where the focal study area is located within the larger country or continent.

## 2. Setting Up the QGIS Print Layout

1. Navigate to **Project > New Print Layout**.
2. Add Map Item: drag across the canvas. Set fixed scale (e.g., 1:50,000).
3. Lock layers and styles to avoid accidental viewport recalculations.
4. Configure Grids:
   * Coordinate system: Target Projected CRS (e.g., UTM).
   * Interval: 10,000m.
   * Draw Coordinates on margin with customized decimal degree or meter formatting.
5. Export as vector PDF (300 DPI) or publication TIFF for journals.`,
            quiz: {
              question: "What is the primary reason to lock layers and styles on a map item in the QGIS Print Layout?",
              options: [
                "To prevent map elements in the layout from changing when panning or altering layer visibility in the main QGIS workspace",
                "To password protect the exported PDF against unauthorized copying",
                "To convert all vector layers into immutable rasters",
                "To prevent QGIS from using too much RAM"
              ],
              correct_answer: 0
            }
          }
        ]
      },
      {
        title: "Phase 2: Desktop GIS Mastery (QGIS, ArcGIS Pro & Google Earth)",
        slug: "desktop-gis-qgis-arcgis",
        description: "Master geoprocessing tools, remote sensing classification in QGIS SCP, ArcGIS Pro ModelBuilder, GDB design, and Google Earth Pro.",
        order_index: 2,
        lessons: [
          {
            title: "QGIS Geoprocessing: Buffers, Overlays, Zonal Stats & Dissolve",
            slug: "qgis-geoprocessing-workflows",
            order_index: 1,
            video_url: "https://www.youtube.com/watch?v=XW9_0Zq0Rrk",
            content: `# Core Geoprocessing Workflows in QGIS

Geoprocessing is the process of applying operations to spatial datasets to extract new relationships, detect proximity, and calculate aggregate metrics.

## 1. Fundamental Geoprocessing Operations

* **Buffer:** Generates a zone of specified distance around point, line, or polygon features (e.g., 500m protection buffer along riverbanks).
* **Clip:** Cuts out an input layer using the boundary of another polygon (cookie-cutter).
* **Intersect:** Computes the geometric intersection of two layers, retaining attributes from both.
* **Difference (Erase):** Removes areas from an input layer that overlap with a reference overlay.
* **Dissolve:** Merges adjacent polygons that share the same attribute (e.g., dissolving parcel boundaries by land-use category to compute aggregate zoning).

## 2. Zonal Statistics (Vector Meets Raster)

Zonal statistics calculate statistical summaries (mean, sum, min, max, standard deviation) of a raster layer within the boundaries of a polygon layer.

**Real-world workflow:**
* **Raster input:** 30m Digital Elevation Model (DEM) or Sentinel-2 NDVI raster.
* **Vector zones:** Administrative boundaries or farm parcels.
* **Output:** The vector attribute table gains new columns: \`_mean_ndvi\`, \`_mean_elevation\`, \`_max_slope\`.

In QGIS:
1. Open **Processing Toolbox > Raster Analysis > Zonal Statistics**.
2. Select Raster layer and Vector polygon layer.
3. Choose statistics (Mean, Median, Standard Deviation).
4. Run in-memory or save to new GeoPackage layer.`,
            quiz: {
              question: "Which geoprocessing operation calculates summary statistics (such as mean NDVI or average elevation) of a raster within vector polygon zones?",
              options: [
                "Zonal Statistics",
                "Geometric Union",
                "Spatial Dissolve",
                "Raster Resampling"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Satellite Image Classification with QGIS Semi-Automatic Classification Plugin (SCP)",
            slug: "qgis-scp-image-classification",
            order_index: 2,
            video_url: "https://www.youtube.com/watch?v=1uU8v8lT-iY",
            content: `# Supervised Land Cover Classification with QGIS SCP

The Semi-Automatic Classification Plugin (SCP) by Luca Congedo is the premier open-source tool for remote sensing in QGIS.

## 1. The Supervised Classification Pipeline

Supervised classification uses human-verified ground-truth regions of interest (ROIs) to train statistical and machine-learning algorithms to categorize every pixel in a satellite scene.

### Steps:
1. **Pre-processing:**
   * Atmospheric correction: Convert raw Digital Numbers (DN) to Top-Of-Atmosphere (TOA) or Surface Reflectance (BOA/DOS1).
   * Band stacking: Stack Sentinel-2 bands (B2, B3, B4, B8, B11, B12) or Landsat 8/9 bands.
2. **Training Input Creation (ROIs):**
   * Digitize Macroclasses (MC):
     * MC 1: Water Bodies
     * MC 2: Dense Forest
     * MC 3: Agricultural Cropland
     * MC 4: Built-Up / Urban
     * MC 5: Bare Soil
   * Inspect spectral signatures to ensure spectral separability.
3. **Classification Algorithm Execution:**
   * **Maximum Likelihood:** Assumes normal distribution of spectral signatures.
   * **Minimum Distance:** Fastest, assigns pixel to closest class centroid.
   * **Spectral Angle Mapper (SAM):** Compares spectral curve shape rather than magnitude.
   * **Random Forest (via SAGA/Scikit-Learn integration):** High accuracy non-parametric ensemble.
4. **Accuracy Assessment:**
   * Generate Confusion Matrix (Error Matrix).
   * Calculate **Overall Accuracy** and **Kappa Coefficient**.`,
            quiz: {
              question: "In remote sensing classification, what metric is calculated from a confusion matrix to evaluate overall classification agreement accounting for chance?",
              options: [
                "Kappa Coefficient",
                "Boustrophedon Index",
                "Shannon Entropy",
                "Pearson Correlation"
              ],
              correct_answer: 0
            }
          },
          {
            title: "ArcGIS Pro: Geodatabase (.gdb) Design, ModelBuilder & Web Publishing",
            slug: "arcgis-pro-modelbuilder-gdb",
            order_index: 3,
            video_url: "https://www.youtube.com/watch?v=8qWp8u4L0uE",
            content: `# Enterprise Desktop GIS: ArcGIS Pro

ArcGIS Pro is the corporate standard across municipal governance, engineering consultancies, and multinational environmental agencies.

## 1. File Geodatabase (.gdb) Architecture

A File Geodatabase is a collection of files in a folder on disk that can store, query, and manage spatial and nonspatial data:
* **Feature Datasets:** Containers for feature classes that share the exact same Coordinate Reference System. Essential for geometric networks, topologies, and parcel fabrics.
* **Feature Classes:** Homogeneous collections of spatial features (point, line, or polygon).
* **Attribute Domains:** Coded values (e.g., \`1 = Forest\`, \`2 = Water\`) and range domains to enforce enterprise data integrity and prevent data entry typos.
* **Topology Rules:** Enforcing spatial integrity (e.g., "Parcels must not overlap", "Water pipes must not have dangles").

## 2. Visual Automation with ModelBuilder

ModelBuilder allows visual drag-and-drop scripting of complex, reproducible geoprocessing workflows without writing Python code:
* Link inputs $\\rightarrow$ tools $\\rightarrow$ intermediate outputs $\\rightarrow$ final results.
* Use **Iterators** (e.g., Iterate Feature Classes, Iterate Rasters) to batch process hundreds of files.
* Export Model directly to **ArcPy Python script** (\`.py\`) for scheduled Windows Task Scheduler execution.

## 3. Publishing to ArcGIS Online / Enterprise

Convert desktop maps into interactive cloud web maps:
* Share as **Web Layer (Feature Service)**.
* Enable query, editing, and sync capabilities.
* Consume in ArcGIS Dashboards, Field Maps (mobile field data collection), and Experience Builder.`,
            quiz: {
              question: "In an Esri File Geodatabase (.gdb), what is the purpose of an Attribute Domain?",
              options: [
                "To enforce data integrity by constraining valid values to a predefined list of coded values or a numeric range",
                "To compress large raster datasets using wavelet compression",
                "To set the administrative login password for the database",
                "To translate shapefiles into GeoJSON format"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Google Earth Pro: Ground-Truthing, Elevation Profiles & Historic Sliders",
            slug: "google-earth-pro-ground-truthing",
            order_index: 4,
            video_url: "https://www.youtube.com/watch?v=hGz0o0G-eUo",
            content: `# Rapid Ground-Truthing with Google Earth Pro

Despite modern web GIS, Google Earth Pro remains an irreplaceable desktop utility for rapid reconnaissance, site visits, and elevation profiling.

## 1. Key Analytical Features

* **Historical Imagery Slider:** Access decades of historical high-resolution aerial and satellite archives to visually audit land-use change, urban sprawl, and seasonal reservoir levels over time.
* **Elevation Profiling:** Draw a path across terrain, right-click, and select **Show Elevation Profile**. Instantly inspect slope percentage, maximum elevation, and elevation gain for pipeline, transmission, or watershed projects.
* **KML / KMZ Integration:** Lightweight vector interchange format. KMZ is a zipped KML archive containing vector geometry and embedded symbology/imagery.

## 2. Converting Between GIS Formats and KML

Use GDAL/OGR or QGIS to convert enterprise spatial layers to lightweight KML for field staff:
\`\`\`bash
# Convert GeoPackage layer to KML via OGR
ogr2ogr -f "KML" study_area.kml study_area.gpkg -t_srs EPSG:4326
\`\`\``,
            quiz: {
              question: "What is a .kmz file in geospatial data interchange?",
              options: [
                "A zipped archive containing a .kml file and optional associated textures/symbology",
                "An encrypted military geodatabase",
                "A raster GeoTIFF compressed with JPEG2000",
                "A PostgreSQL database dump file"
              ],
              correct_answer: 0
            }
          }
        ]
      },
      {
        title: "Phase 3: Spatial Databases (PostgreSQL + PostGIS)",
        slug: "spatial-databases-postgis",
        description: "Master enterprise spatial SQL, GIST spatial indexing, geometry constructors, topological functions, spatial joins, and raster algebra.",
        order_index: 3,
        lessons: [
          {
            title: "PostGIS Architecture, Setup & Ingestion (shp2pgsql, ogr2ogr)",
            slug: "postgis-setup-ingestion",
            order_index: 1,
            video_url: "https://www.youtube.com/watch?v=kYJ6gV_605Y",
            content: `# PostgreSQL + PostGIS: Enterprise Spatial Database

Spreadsheets, loose shapefiles, and local files fail when scaling to enterprise multi-user environments. PostGIS turns PostgreSQL into the world's most powerful open-source spatial database.

## 1. Enabling PostGIS

Connect to PostgreSQL via \`psql\` or DBeaver:
\`\`\`sql
-- Enable PostGIS core spatial extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable PostGIS raster support
CREATE EXTENSION IF NOT EXISTS postgis_raster;

-- Enable topology and advanced routing support
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Verify version
SELECT PostGIS_Full_Version();
\`\`\`

## 2. Ingesting Spatial Layers

### Method 1: Using \`ogr2ogr\` (GDAL CLI - Recommended)
\`\`\`bash
ogr2ogr -f "PostgreSQL" PG:"host=localhost dbname=geodb user=postgres password=secret" \
  parcels.gpkg -nln public.cadastral_parcels -overwrite -lco GEOMETRY_NAME=geom -lco SPATIAL_INDEX=GIST
\`\`\`

### Method 2: Using \`shp2pgsql\`
\`\`\`bash
shp2pgsql -I -s 32646 boundaries.shp public.admin_boundaries | psql -d geodb -U postgres
\`\`\``,
            quiz: {
              question: "Which command activates spatial capabilities in a standard PostgreSQL database?",
              options: [
                "CREATE EXTENSION postgis;",
                "INSTALL SPATIAL ENGINE;",
                "ALTER DATABASE SET SPATIAL=TRUE;",
                "ENABLE PLUGIN postgis;"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Spatial SQL Mastery: Geometry Constructors & GIST Indexing",
            slug: "spatial-sql-geometry-constructors-gist",
            order_index: 2,
            video_url: "https://www.youtube.com/watch?v=cM5Yl8s6i8g",
            content: `# Spatial SQL: Constructors, SRS & GIST Indexing

PostGIS adds spatial data types: \`GEOMETRY\` (planar Cartesian math) and \`GEOGRAPHY\` (geodetic ellipsoidal math on the sphere).

## 1. Constructing Geometries in SQL

\`\`\`sql
-- Create points from Latitude & Longitude (EPSG:4326)
SELECT ST_SetSRID(ST_MakePoint(90.4125, 23.8103), 4326) AS geom_point;

-- Create polygon from Well-Known Text (WKT)
SELECT ST_GeomFromText('POLYGON((0 0, 0 10, 10 10, 10 0, 0 0))', 32646);

-- Convert coordinate system on the fly
SELECT ST_Transform(
  ST_SetSRID(ST_MakePoint(90.4125, 23.8103), 4326),
  32646
) AS geom_utm;
\`\`\`

## 2. GIST Spatial Indexing (The Secret to Query Speed)

Without a spatial index, a query must check every single row in the table (sequential scan $O(N)$). A **GIST (Generalized Search Tree)** index implements an R-Tree bounding-box hierarchy, reducing queries to $O(\\log N)$.

\`\`\`sql
-- Create GIST spatial index on geometry column
CREATE INDEX idx_parcels_geom ON public.cadastral_parcels USING GIST (geom);

-- Analyze table to update query planner statistics
VACUUM ANALYZE public.cadastral_parcels;
\`\`\`

## 3. Bounding Box Operator (\`&&\`)
The \`&&\` operator tests if feature bounding boxes intersect using the GIST index before executing expensive polygon vertex-by-vertex geometric tests:
\`\`\`sql
SELECT id, name
FROM public.cadastral_parcels
WHERE geom && ST_MakeEnvelope(90.3, 23.7, 90.5, 23.9, 4326);
\`\`\``,
            quiz: {
              question: "What spatial index structure does PostGIS use to enable lightning-fast spatial queries on geometry columns?",
              options: [
                "GIST (Generalized Search Tree / R-Tree)",
                "B-Tree standard index",
                "Hash index",
                "GIN inverted index"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Topological Relationships & Spatial Joins (ST_Intersects, ST_Contains, ST_DWithin)",
            slug: "topological-relationships-spatial-joins",
            order_index: 3,
            video_url: "https://www.youtube.com/watch?v=0kM_k09sI_g",
            content: `# Topological Predicates & Spatial Joins

Spatial SQL allows joining two tables not on a shared foreign key ID, but on their physical geometric relationship in space.

## 1. Key Topological Predicates

* **\`ST_Intersects(geomA, geomB)\`:** Returns true if two geometries share any space.
* **\`ST_Contains(geomA, geomB)\`:** Returns true if geometry B is completely inside geometry A.
* **\`ST_Within(geomA, geomB)\`:** Inverse of contains.
* **\`ST_DWithin(geomA, geomB, distance)\`:** Returns true if geometries are within a specified distance of each other (uses spatial index!).

## 2. Production Spatial Joins

### Example 1: Count weather sensor stations per district
\`\`\`sql
SELECT 
    d.district_name,
    COUNT(s.id) AS station_count,
    ROUND(AVG(s.temperature_c)::numeric, 2) AS avg_temp
FROM public.districts d
LEFT JOIN public.weather_stations s
    ON ST_Contains(d.geom, s.geom)
GROUP BY d.district_name
ORDER BY station_count DESC;
\`\`\`

### Example 2: Find all hospital points within 5 km of an active flood zone
\`\`\`sql
SELECT 
    h.hospital_name,
    f.flood_severity,
    ROUND(ST_Distance(h.geom, f.geom)::numeric, 1) AS distance_meters
FROM public.hospitals h
JOIN public.flood_zones f
    ON ST_DWithin(h.geom, f.geom, 5000)
ORDER BY distance_meters ASC;
\`\`\``,
            quiz: {
              question: "Which PostGIS function is best suited to test if two geometries are within a given radius while leveraging GIST spatial index acceleration?",
              options: [
                "ST_DWithin()",
                "ST_Distance() = 0",
                "ST_Buffer().ST_Equals()",
                "ST_Union()"
              ],
              correct_answer: 0
            }
          }
        ]
      },
      {
        title: "Phase 4: Cloud-Native GIS & Remote Sensing (GEE & GeoServer)",
        slug: "cloud-gis-gee-geoserver",
        description: "Google Earth Engine multi-petabyte satellite processing, Sentinel-2/Landsat time-series, and GeoServer OGC hosting (WMS, WFS).",
        order_index: 4,
        lessons: [
          {
            title: "Google Earth Engine: Cloud Architecture & Multi-Petabyte Analysis",
            slug: "gee-cloud-architecture",
            order_index: 1,
            video_url: "https://www.youtube.com/watch?v=2Tz8j7Jb5mY",
            content: `# Google Earth Engine (GEE): Planetary-Scale Earth Observation

Traditional remote sensing required downloading hundreds of gigabytes of raw satellite imagery, managing local storage, and processing locally. Google Earth Engine completely replaces this with a cloud-native compute platform.

## 1. GEE Core Concepts

* **Client vs. Server Objects:** In GEE scripts, variables (like \`ee.Image\`, \`ee.ImageCollection\`, \`ee.FeatureCollection\`) are instructions to be evaluated on Google's compute clusters, NOT standard local JavaScript/Python objects.
* **Lazy Evaluation:** Computation only happens when an output is requested (e.g., rendered on the map viewport or exported via \`Export.image.toDrive()\`).
* **Scale / Pyramiding:** GEE automatically calculates at the spatial resolution of the map zoom level, enabling instant previewing of petabyte-scale mosaics.

## 2. Filtering a Multi-Petabyte Satellite Collection

\`\`\`javascript
// Define Area of Interest (AOI)
var aoi = ee.Geometry.Point([90.4125, 23.8103]).buffer(10000);

// Load Sentinel-2 Level-2A Surface Reflectance Collection
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi)
  .filterDate('2026-01-01', '2026-06-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15));

// Create a cloud-free median composite across all 6 months
var medianComposite = s2.median().clip(aoi);

// Visualize True Color (B4=Red, B3=Green, B2=Blue)
Map.centerObject(aoi, 11);
Map.addLayer(medianComposite, {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000
}, 'Sentinel-2 True Color Composite');
\`\`\``,
            quiz: {
              question: "What is 'lazy evaluation' in Google Earth Engine?",
              options: [
                "Computations are not performed until results are explicitly requested for rendering or export, allowing efficient processing at scale",
                "A bug that causes servers to timeout after 5 minutes",
                "An algorithm that skips calculating pixels with cloud cover",
                "A feature that runs only on low-priority overnight servers"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Time-Series Vegetation & Water Indices: NDVI, NDWI & Zonal Reductions",
            slug: "gee-time-series-ndvi-ndwi",
            order_index: 2,
            video_url: "https://www.youtube.com/watch?v=f_Vp9H7yVqU",
            content: `# Computing Spectral Indices at Planetary Scale

Vegetation and water indices exploit the characteristic absorption and reflectance curves of living matter across electromagnetic spectrum bands.

## 1. Spectral Index Formulations

* **Normalized Difference Vegetation Index (NDVI):**
  $$\\text{NDVI} = \\frac{\\text{NIR} - \\text{Red}}{\\text{NIR} + \\text{Red}}$$
  In Sentinel-2: $\\text{NIR} = \\text{B8}$, $\\text{Red} = \\text{B4}$.
  Values range from $-1.0$ to $+1.0$. Healthy green vegetation typically exhibits values between $0.4$ and $0.85$.

* **Normalized Difference Water Index (NDWI):**
  $$\\text{NDWI} = \\frac{\\text{Green} - \\text{NIR}}{\\text{Green} + \\text{NIR}}$$
  Highlights surface water features and detects flood inundation.

## 2. GEE JavaScript Implementation

\`\`\`javascript
// Function to calculate and add NDVI band
function addNDVI(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
}

// Map function across collection
var withNDVI = s2.map(addNDVI);

// Chart mean NDVI time-series over agricultural region
var chart = ui.Chart.image.seriesByRegion({
  imageCollection: withNDVI.select('NDVI'),
  regions: agriculturalParcels,
  reducer: ee.Reducer.mean(),
  scale: 10,
  xProperty: 'system:time_start'
}).setOptions({
  title: 'Agricultural Phenology & Growth Cycle (NDVI)',
  vAxis: {title: 'Mean NDVI'},
  hAxis: {title: 'Date'}
});

print(chart);
\`\`\``,
            quiz: {
              question: "Which Sentinel-2 spectral bands are utilized to compute the Normalized Difference Vegetation Index (NDVI)?",
              options: [
                "Band 8 (Near-Infrared) and Band 4 (Red)",
                "Band 2 (Blue) and Band 3 (Green)",
                "Band 11 (SWIR) and Band 12 (SWIR)",
                "Band 1 (Coastal Aerosol) and Band 9 (Water Vapour)"
              ],
              correct_answer: 0
            }
          },
          {
            title: "GeoServer: Enterprise Spatial Layer Publishing via WMS, WFS & WCS",
            slug: "geoserver-ogc-wms-wfs",
            order_index: 3,
            video_url: "https://www.youtube.com/watch?v=cM-G9_s948A",
            content: `# Hosting Spatial Data with GeoServer

GeoServer is the gold-standard open-source server for sharing geospatial data using Open Geospatial Consortium (OGC) standards.

## 1. Core OGC Web Service Protocols

* **WMS (Web Map Service):**
  * Delivers pre-rendered raster image tiles (PNG, JPEG).
  * Ideal for rapid background mapping in web clients (Leaflet, OpenLayers) without sending heavy vector geometry to the browser.
* **WFS (Web Feature Service):**
  * Delivers raw vector geometry and attributes (GeoJSON, GML).
  * Enables client-side editing, spatial filtering, and vector styling.
* **WCS (Web Coverage Service):**
  * Delivers raw raster cell values (GeoTIFF) for client-side raster modeling.

## 2. Connecting PostGIS to GeoServer
1. In GeoServer Admin: Go to **Stores > Add new Store > PostGIS**.
2. Provide database credentials (\`geodb\`, \`localhost\`, port 5432).
3. Go to **Layers > Publish** on the \`cadastral_parcels\` table.
4. Calculate bounding box from data.
5. Apply an **SLD (Styled Layer Descriptor)** style to color code features by attribute.
6. Layer is now available globally via standard URL endpoints.`,
            quiz: {
              question: "Which OGC service should you use when a web mapping client needs to receive raw vector coordinates and attributes (GeoJSON) rather than pre-rendered map images?",
              options: [
                "WFS (Web Feature Service)",
                "WMS (Web Map Service)",
                "WMTS (Web Map Tile Service)",
                "CSW (Catalog Service for the Web)"
              ],
              correct_answer: 0
            }
          }
        ]
      },
      {
        title: "Phase 5: Python Spatial Stack (Vector, Raster & Automation)",
        slug: "python-spatial-stack",
        description: "Master GeoPandas, Shapely, Rasterio, GDAL/OGR CLI, PyQGIS/ArcPy automation, PySAL spatial econometrics, and Xarray climate arrays.",
        order_index: 5,
        lessons: [
          {
            title: "GeoPandas & Shapely: Vector Pipelines, Spatial Joins & Dissolve",
            slug: "geopandas-shapely-vector-pipelines",
            order_index: 1,
            video_url: "https://www.youtube.com/watch?v=f252M_d9I_M",
            content: `# GeoPandas: The Python Standard for Spatial Data Science

GeoPandas extends pandas dataframes to allow spatial operations on geometric types using Shapely.

## 1. Reading, Transforming & Filtering Vectors

\`\`\`python
import geopandas as gpd
from shapely.geometry import Point

# Load GeoPackage
parcels = gpd.read_file("data/parcels.gpkg")

# Ensure projected CRS for metric accuracy
if parcels.crs.is_geographic:
    parcels = parcels.to_crs(epsg=32646)

# Spatial attribute filtering
large_farms = parcels[parcels.geometry.area > 50000] # > 5 hectares
print(f"Total large farms identified: {len(large_farms)}")
\`\`\`

## 2. Spatial Join (\`sjoin\`) in Python

\`\`\`python
# Read point locations (e.g., groundwater test wells)
wells = gpd.read_file("data/wells.geojson").to_crs(parcels.crs)

# Spatial Join: determine which farm parcel contains each well
wells_with_farm_info = gpd.sjoin(wells, parcels, how="inner", predicate="within")

print(wells_with_farm_info[["well_id", "arsenic_level", "owner_name"]].head())
\`\`\`

## 3. Spatial Dissolve
\`\`\`python
# Dissolve sub-parcels into single contiguous property polygons per owner
dissolved_farms = parcels.dissolve(by="owner_id", aggfunc={"crop_yield": "sum"})
\`\`\``,
            quiz: {
              question: "What function in GeoPandas performs a spatial join between two vector layers based on geometric relationships like 'within' or 'intersects'?",
              options: [
                "gpd.sjoin()",
                "gpd.merge()",
                "gpd.spatial_combine()",
                "gpd.intersect_join()"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Rasterio: Pythonic Raster Reading, Masking, Warping & GeoTIFF Band Math",
            slug: "rasterio-raster-pipelines-band-math",
            order_index: 2,
            video_url: "https://www.youtube.com/watch?v=aG4iYhC9o0M",
            content: `# Rasterio: Clean Pythonic Raster Processing

Rasterio reads and writes geospatial raster formats (GeoTIFFs) using GDAL underneath, exposing data directly as clean NumPy arrays.

## 1. Reading GeoTIFF Metadata & Bands

\`\`\`python
import rasterio
import numpy as np

with rasterio.open("sentinel2_scene.tif") as src:
    print(f"Dimensions: {src.width} x {src.height}")
    print(f"Bands count: {src.count}")
    print(f"Coordinate System: {src.crs}")
    print(f"Affine Transform:\\n{src.transform}")

    # Read Band 4 (Red) and Band 8 (NIR) into NumPy arrays
    red = src.read(4).astype(np.float32)
    nir = src.read(8).astype(np.float32)
    meta = src.meta.copy()

# Compute NDVI with safe division against zeros
np.seterr(divide='ignore', invalid='ignore')
ndvi = (nir - red) / (nir + red)
ndvi = np.nan_to_num(ndvi, nan=0.0)

# Update metadata for output single-band raster
meta.update(dtype=rasterio.float32, count=1, driver="GTiff")

with rasterio.open("ndvi_output.tif", "w", **meta) as dst:
    dst.write(ndvi.astype(rasterio.float32), 1)
\`\`\`

## 2. Masking (Clipping) a Raster with Vector Geometry

\`\`\`python
import fiona
from rasterio.mask import mask

with fiona.open("boundary.geojson", "r") as shapefile:
    shapes = [feature["geometry"] for feature in shapefile]

with rasterio.open("dem.tif") as src:
    out_image, out_transform = mask(src, shapes, crop=True)
    out_meta = src.meta.copy()

out_meta.update({
    "height": out_image.shape[1],
    "width": out_image.shape[2],
    "transform": out_transform
})

with rasterio.open("clipped_dem.tif", "w", **out_meta) as dst:
    dst.write(out_image)
\`\`\``,
            quiz: {
              question: "When reading GeoTIFF raster bands with Rasterio into Python, what core scientific computing data structure does it return?",
              options: [
                "NumPy ndarray",
                "Pandas DataFrame",
                "Standard Python nested dictionary",
                "Binary String Buffer"
              ],
              correct_answer: 0
            }
          },
          {
            title: "GDAL / OGR CLI Automation: gdalwarp, gdal_translate & ogr2ogr",
            slug: "gdal-ogr-cli-conversion-automation",
            order_index: 3,
            video_url: "https://www.youtube.com/watch?v=5rT8Xp9Zg8g",
            content: `# The Foundational Geospatial Engine: GDAL / OGR

GDAL (Geospatial Data Abstraction Library) for rasters and OGR for vectors form the foundational C++ engine underneath QGIS, ArcGIS, Python, and PostGIS.

## 1. Essential Command-Line Utilities

### \`gdal_translate\` (Format conversion & subsetting)
\`\`\`bash
# Convert raw satellite image to Cloud-Optimized GeoTIFF (COG) with Deflate compression
gdal_translate input.tif output_cog.tif \
  -co TILED=YES \
  -co COMPRESS=DEFLATE \
  -co COPY_SRC_OVERVIEWS=YES
\`\`\`

### \`gdalwarp\` (Reprojection, mosaicking & clipping)
\`\`\`bash
# Reproject raster from WGS84 (EPSG:4326) to UTM Zone 46N (EPSG:32646) using bilinear resampling
gdalwarp -s_srs EPSG:4326 -t_srs EPSG:32646 \
  -r bilinear -tr 10 10 \
  input_wgs84.tif output_utm_10m.tif

# Clip raster using vector mask polygon
gdalwarp -cutline boundary.shp -crop_to_cutline \
  dem_elevation.tif dem_clipped.tif
\`\`\`

### \`ogr2ogr\` (Vector conversion & SQL filtering)
\`\`\`bash
# Convert Shapefile to GeoJSON with attribute query filter
ogr2ogr -f "GeoJSON" flood_parcels.geojson parcels.shp \
  -where "flood_risk = 'HIGH'" -t_srs EPSG:4326
\`\`\``,
            quiz: {
              question: "Which GDAL command-line tool is specifically designed for reprojecting, warping, and mosaicking raster datasets?",
              options: [
                "gdalwarp",
                "gdal_translate",
                "gdalinfo",
                "ogr2ogr"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Spatial Econometrics & ESDA with PySAL (Moran’s I & LISA)",
            slug: "pysal-spatial-econometrics-moran",
            order_index: 4,
            video_url: "https://www.youtube.com/watch?v=q6eW0v9Yv8k",
            content: `# Spatial Autocorrelation & Econometrics with PySAL

Tobler's First Law of Geography states: *"Everything is related to everything else, but near things are more related than distant things."* PySAL allows rigorous statistical modeling of spatial autocorrelation and spatial regression.

## 1. Global Spatial Autocorrelation: Global Moran's I

Global Moran's I measures whether a variable is clustered, dispersed, or random across space:
* $I > 0$: Positive spatial autocorrelation (clustering: high values near high values, low near low).
* $I \\approx 0$: Complete spatial randomness.
* $I < 0$: Negative spatial autocorrelation (checkerboard pattern).

## 2. Python Implementation with PySAL (\`libpysal\` + \`esda\`)

\`\`\`python
import geopandas as gpd
from libpysal.weights import Queen
from esda.moran import Moran, Moran_Local

# Load regional economic / crop yield data
gdf = gpd.read_file("district_data.geojson")

# 1. Build Spatial Spatial Weights Matrix (Queen contiguity: sharing edge or vertex)
w = Queen.from_dataframe(gdf)
w.transform = 'R'  # Row-standardized weights

# 2. Compute Global Moran's I for Poverty Rate
moran = Moran(gdf["poverty_rate"], w)
print(f"Global Moran's I: {moran.I:.4f}, p-value: {moran.p_sim:.4f}")

# 3. Local Indicators of Spatial Association (LISA)
lisa = Moran_Local(gdf["poverty_rate"], w)
# Quadrant interpretation:
# 1 = High-High (Hotspots), 2 = Low-High, 3 = Low-Low (Coldspots), 4 = High-Low
gdf["lisa_quadrant"] = lisa.q
gdf["lisa_pvalue"] = lisa.p_sim
\`\`\``,
            quiz: {
              question: "In spatial statistics, what does a statistically significant High-High quadrant in a LISA (Local Moran's I) analysis indicate?",
              options: [
                "A spatial hotspot: areas with high attribute values surrounded by neighboring areas that also have high values",
                "Complete random dispersion with no clustering",
                "An outlier with a high value surrounded by low values",
                "A calculation error due to zero variance"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Multidimensional Climate Grids with Xarray & Rioxarray (NetCDF/GRIB)",
            slug: "xarray-rioxarray-climate-grids",
            order_index: 5,
            video_url: "https://www.youtube.com/watch?v=0kGgWb8Vj5c",
            content: `# Handling Climate Time-Series with Xarray & Rioxarray

Meteorological and climate models (ERA5, CMIP6, GFS) do not output static single-date GeoTIFFs. They output multidimensional cubes across coordinates: $(Time, Latitude, Longitude, PressureLevel)$ stored in **NetCDF** or **GRIB** formats.

## 1. Working with Multidimensional Data Arrays

\`\`\`python
import xarray as xr
import rioxarray

# Open 30-year daily rainfall NetCDF dataset
ds = xr.open_dataset("era5_rainfall_1995_2025.nc")
print(ds)

# Select variable: Total Precipitation (tp)
tp = ds["tp"]

# Temporal slicing: calculate monthly mean rainfall
monthly_mean = tp.groupby("time.month").mean(dim="time")

# Set spatial coordinate reference system using rioxarray
monthly_mean = monthly_mean.rio.write_crs("EPSG:4326")

# Export June rainfall layer directly to GeoTIFF
june_rainfall = monthly_mean.sel(month=6)
june_rainfall.rio.to_raster("june_average_precipitation.tif")
\`\`\``,
            quiz: {
              question: "Which Python package extends Xarray with geospatial raster I/O, coordinate reprojection, and GeoTIFF export capabilities?",
              options: [
                "rioxarray",
                "seaborn",
                "scikit-learn",
                "gevent"
              ],
              correct_answer: 0
            }
          }
        ]
      },
      {
        title: "Phase 6: R Spatial Stack (For Econometricians & Researchers)",
        slug: "r-spatial-stack",
        description: "Master R spatial packages: sf (Simple Features), terra raster computing, tmap cartography, and spdep/spatialreg econometric models.",
        order_index: 6,
        lessons: [
          {
            title: "Simple Features in R: Vector Manipulation with `sf` & `tidyverse`",
            slug: "r-sf-simple-features-tidyverse",
            order_index: 1,
            video_url: "https://www.youtube.com/watch?v=0wQv7n3x0gE",
            content: `# Modern R Vector GIS: The \`sf\` Package

The \`sf\` (Simple Features) package revolutionized R spatial workflows by storing geometric data directly as a column (\`geom\`) inside standard R \`data.frame\` / \`tibble\` structures.

## 1. Integrating \`sf\` with \`dplyr\` Pipelines

\`\`\`r
library(sf)
library(dplyr)

# Read spatial GeoPackage
parcels <- st_read("data/agricultural_parcels.gpkg")

# Inspect CRS
st_crs(parcels)

# Pipe with standard dplyr verbs: filter, mutate, group_by
high_value_crops <- parcels %>%
  st_transform(crs = 32646) %>%  # Reproject to UTM Zone 46N (meters)
  mutate(area_hectares = as.numeric(st_area(geom)) / 10000) %>%
  filter(crop_type == "Paddy" & area_hectares > 2.5) %>%
  group_by(district) %>%
  summarise(
    total_parcels = n(),
    total_area_ha = sum(area_hectares),
    geom = st_union(geom)  # Spatial dissolve
  )

print(high_value_crops)
\`\`\``,
            quiz: {
              question: "How does the 'sf' package represent spatial features in R compared to legacy R spatial packages?",
              options: [
                "As standard data.frames/tibbles with a list-column containing geometry, enabling seamless use of dplyr and tidyverse verbs",
                "As immutable C++ pointers that cannot be inspected in RStudio",
                "As separate CSV files for each coordinate vertex",
                "As binary blobs requiring specialized external database drivers"
              ],
              correct_answer: 0
            }
          },
          {
            title: "High-Speed Raster Processing with `terra` in R",
            slug: "r-terra-high-speed-raster",
            order_index: 2,
            video_url: "https://www.youtube.com/watch?v=4yO8-sW008E",
            content: `# High-Performance Raster Computing with \`terra\`

The \`terra\` package completely supersedes the legacy \`raster\` package, written in high-performance C++ to execute operations up to $100\\times$ faster.

## 1. Raster Math & Zonal Extraction in R

\`\`\`r
library(terra)

# Load digital elevation model and satellite multispectral rasters
dem <- rast("elevation_dem.tif")
s2_scene <- rast("sentinel2_bands.tif")

# Compute Slope and Aspect directly in C++
terrain_slope <- terrain(dem, v = "slope", unit = "degrees")

# Compute Normalized Difference Vegetation Index (NDVI)
# Band 8 is NIR, Band 4 is Red
b4 <- s2_scene[[4]]
b8 <- s2_scene[[8]]
ndvi <- (b8 - b4) / (b8 + b4)

# Zonal Extraction: Extract mean NDVI per farm polygon
farm_polygons <- vect("farms.gpkg")
farm_ndvi <- extract(ndvi, farm_polygons, fun = mean, na.rm = TRUE)
\`\`\``,
            quiz: {
              question: "Which modern R package replaces the legacy 'raster' package for ultra-fast C++ raster analysis?",
              options: [
                "terra",
                "rasterLite",
                "ggplot3",
                "spRaster"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Spatial Econometric Modeling with `spdep` & `spatialreg` (SAR, SEM, SAC)",
            slug: "r-spatial-econometrics-spdep-spatialreg",
            order_index: 3,
            video_url: "https://www.youtube.com/watch?v=9g0Zq8a0b0M",
            content: `# Spatial Econometrics in R: SAR & SEM Models

Standard Ordinary Least Squares (OLS) regression assumes observations are independent: $Y = X\\beta + \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, \\sigma^2 I)$. In geospatial data, spatial dependence causes biased and inconsistent estimates.

## 1. The Two Main Spatial Econometric Models

1. **Spatial Lag Model (SAR):**
   The dependent variable in region $i$ is directly affected by the dependent variable in neighboring regions $j$:
   $$Y = \\rho W Y + X\\beta + \\epsilon$$
   where $W$ is the spatial weights matrix, and $\\rho$ is the spatial autoregressive parameter.

2. **Spatial Error Model (SEM):**
   Spatial autocorrelation lives in the unobserved error terms:
   $$Y = X\\beta + u, \\quad u = \\lambda W u + \\epsilon$$

## 2. Fitting Spatial Regressions in R

\`\`\`r
library(spdep)
library(spatialreg)

# 1. Create Spatial Weights Matrix
nb <- poly2nb(district_sf, queen = TRUE)
lw <- nb2listw(nb, style = "W")

# 2. Test OLS Residuals for Spatial Dependence (Lagrange Multiplier Tests)
ols_model <- lm(yield ~ fertilizer + rainfall + temperature, data = district_sf)
lm_tests <- lm.LMtests(ols_model, lw, test = c("LMlag", "LMerr", "RLMlag", "RLMerr"))
summary(lm_tests)

# 3. Fit Spatial Lag Model (SAR) using Maximum Likelihood
sar_model <- lagsarlm(yield ~ fertilizer + rainfall + temperature, 
                      data = district_sf, listw = lw)
summary(sar_model)
\`\`\``,
            quiz: {
              question: "In spatial econometrics, what does a Spatial Lag Model (SAR) model that ordinary least squares (OLS) ignores?",
              options: [
                "Direct spatial interaction where the outcome in one region is influenced by the outcomes in neighboring regions (rho * W * Y)",
                "Non-linear polynomial terms of the independent variables",
                "Temporal variance in stock prices",
                "Categorical variables with more than 10 levels"
              ],
              correct_answer: 0
            }
          }
        ]
      }
    ]
  },
  {
    title: "The Definitive R Masterclass: Data Science, Statistics & Advanced Analytics",
    slug: "r-masterclass",
    description: "The complete journey from foundational programming to world-class statistical modeling, tidyverse data wrangling, publication-grade ggplot2 visualization, econometrics, bioconductor genomics, and reactive Shiny web applications.",
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    modules: [
      {
        title: "Module 1: Modern R Programming & Tidyverse Core",
        slug: "r-programming-tidyverse-core",
        description: "Vectors, data structures, control flow, functions, functional programming with purrr, and data manipulation with dplyr & tidyr.",
        order_index: 1,
        lessons: [
          {
            title: "R Data Structures, Vectorization & Functional Mindset",
            slug: "r-data-structures-vectorization",
            order_index: 1,
            video_url: "https://www.youtube.com/watch?v=FY8Lg3Z6z-c",
            content: `# R Foundations & Vectorized Execution

Unlike traditional object-oriented languages (Java, C++), R was designed from the ground up by statisticians as a vectorized, functional language.

## 1. Core Data Structures

* **Atomic Vectors:** The fundamental building block. Six basic types: logical, integer, double (numeric), character, complex, and raw.
* **Matrices & Arrays:** Multi-dimensional atomic vectors with dimension attributes.
* **Lists:** Heterogeneous vectors capable of holding arbitrary objects (dataframes, models, functions).
* **Data Frames / Tibbles:** Lists of equal-length vectors. The tabular backbone of data science.

## 2. The Power of Vectorization

Avoid writing slow \`for\` loops in R. Mathematical and logical operators operate natively on entire vectors simultaneously in optimized C/Fortran:

\`\`\`r
# Slow procedural loop approach (Anti-pattern in R)
x <- 1:1e6
y <- numeric(length(x))
for(i in seq_along(x)) {
  y[i] <- sqrt(x[i]) * 2.5
}

# Vectorized idiomatic approach (Orders of magnitude faster)
y_fast <- sqrt(x) * 2.5
\`\`\``,
            quiz: {
              question: "Why is vectorized code preferred over explicit 'for' loops in R?",
              options: [
                "Vectorized operations run in compiled internal C and Fortran code without the interpreter overhead of iterative loops",
                "R disabled 'for' loops in version 4.0",
                "Vectorized functions always use GPU acceleration",
                "Loops cannot handle numeric values in R"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Data Manipulation Masterclass: dplyr, tidyr & purrr Pipelines",
            slug: "dplyr-tidyr-purrr-pipelines",
            order_index: 2,
            video_url: "https://www.youtube.com/watch?v=jOd65mR1zfw",
            content: `# Professional Data Wrangling: The Tidyverse Stack

The tidyverse is an opinionated collection of R packages designed for data science that share an underlying design philosophy and grammar.

## 1. Core Verbs of \`dplyr\`

* \`filter()\`: Pick rows based on values.
* \`select()\`: Pick variables by names or tidyselect helpers (\`starts_with()\`, \`where(is.numeric)\`).
* \`mutate()\`: Create new variables with window functions.
* \`group_by() %>% summarise()\`: Aggregate summaries across categorical factors.
* \`left_join()\`, \`anti_join()\`: Relational database-style joins.

## 2. Reshaping Data with \`tidyr\`

* \`pivot_longer()\`: Convert wide tables (e.g., columns \`year_2020\`, \`year_2021\`, \`year_2022\`) into tidy key-value format.
* \`pivot_wider()\`: Reshape tidy observations into wide matrices for modeling.

\`\`\`r
library(tidyverse)

clinical_data <- read_csv("trials.csv") %>%
  filter(!is.na(dose_mg)) %>%
  group_by(treatment_group) %>%
  summarise(
    n = n(),
    mean_response = mean(biomarker_level),
    se = sd(biomarker_level) / sqrt(n)
  ) %>%
  arrange(desc(mean_response))
\`\`\``,
            quiz: {
              question: "Which tidyr function converts data from a wide format with multiple measurement columns into a tidy long format?",
              options: [
                "pivot_longer()",
                "pivot_wider()",
                "gather_array()",
                "transpose_table()"
              ],
              correct_answer: 0
            }
          }
        ]
      },
      {
        title: "Module 2: Publication-Quality Visualization with ggplot2",
        slug: "ggplot2-publication-visualization",
        description: "Master the Grammar of Graphics, custom scales, themes, multi-panel layouts with patchwork, and interactive plots.",
        order_index: 2,
        lessons: [
          {
            title: "Grammar of Graphics & Publication Aesthetics in ggplot2",
            slug: "grammar-of-graphics-ggplot2",
            order_index: 1,
            video_url: "https://www.youtube.com/watch?v=h29gexJ3BsU",
            content: `# The Grammar of Graphics with ggplot2

Based on Leland Wilkinson's Grammar of Graphics, \`ggplot2\` breaks statistical charts into independent, composable semantic layers:
1. **Data:** The underlying tidy dataframe.
2. **Aesthetics (\`aes\`):** Mapping columns to visual channels (x, y, color, fill, shape, size).
3. **Geometries (\`geom\`):** The visual marks (points, lines, bars, violins).
4. **Facets:** Multipanel splitting by conditioning variables.
5. **Statistics (\`stat\`):** Statistical transformations (smoothing, binning, density).
6. **Coordinates (\`coord\`):** Cartesian, polar, or map projections.
7. **Themes:** Controlling all non-data typographic and visual elements.

\`\`\`r
library(ggplot2)
library(patchwork)

p <- ggplot(mtcars, aes(x = wt, y = mpg, color = factor(cyl))) +
  geom_point(size = 3, alpha = 0.8) +
  geom_smooth(method = "lm", se = TRUE, alpha = 0.15) +
  scale_color_viridis_d(name = "Cylinders") +
  theme_minimal(base_size = 14) +
  labs(
    title = "Vehicle Weight vs. Fuel Efficiency",
    subtitle = "Stratified by Engine Cylinder Count",
    x = "Vehicle Weight (1000 lbs)",
    y = "Miles Per Gallon (MPG)",
    caption = "Source: Motor Trend 1974"
  )
\`\`\``,
            quiz: {
              question: "In ggplot2, what is the role of the aesthetic mapping (aes()) function?",
              options: [
                "To link data variables/columns to visual properties like x/y axes, color, shape, and size",
                "To set the background font color of the chart title",
                "To save the plot to a high-resolution PDF file",
                "To delete missing values from the dataset"
              ],
              correct_answer: 0
            }
          }
        ]
      },
      {
        title: "Module 3: Statistical Modeling, GLM & Machine Learning in R",
        slug: "statistical-modeling-glm-tidymodels",
        description: "Hypothesis testing, ANOVA, General Linear Models (GLM), mixed-effects models (lme4), and tidymodels predictive ML.",
        order_index: 3,
        lessons: [
          {
            title: "Generalized Linear Models (GLM) & Mixed Effects (lme4)",
            slug: "glm-mixed-effects-lme4",
            order_index: 1,
            video_url: "https://www.youtube.com/watch?v=x_uW_gY8w0E",
            content: `# Generalized Linear Models (GLM) & Hierarchical Data

Standard linear regression assumes normal errors. When response variables are binary (0/1), counts, or rates, Generalized Linear Models (GLM) provide rigorous mathematical modeling via exponential family link functions.

## 1. Logistic & Poisson Regression

\`\`\`r
# Logistic Regression for binary medical/agricultural outcomes
logistic_mod <- glm(disease_present ~ age + treatment + dosage, 
                    data = clinical_df, 
                    family = binomial(link = "logit"))

# Interpret odds ratios
exp(coef(logistic_mod))

# Poisson regression for count data (e.g., number of pest attacks)
poisson_mod <- glm(pest_count ~ temperature + humidity, 
                   data = field_df, 
                   family = poisson(link = "log"))
\`\`\`

## 2. Linear Mixed-Effects Models (\`lme4\`)
When observations are nested within subjects, schools, or spatial plots:
\`\`\`r
library(lme4)
# Random intercept for farm site, fixed effects for fertilizer
mixed_mod <- lmer(yield ~ nitrogen + irrigation + (1 | farm_id), data = agronomy_df)
summary(mixed_mod)
\`\`\``,
            quiz: {
              question: "Which distribution family and link function are standard in glm() for modeling binary 0/1 outcomes?",
              options: [
                "family = binomial(link = 'logit')",
                "family = gaussian(link = 'identity')",
                "family = poisson(link = 'log')",
                "family = gamma(link = 'inverse')"
              ],
              correct_answer: 0
            }
          }
        ]
      }
    ]
  },
  {
    title: "The Complete Machine Learning & Production AI Masterclass",
    slug: "ml-masterclass",
    description: "From mathematical foundations and Scikit-Learn to deep learning with PyTorch, computer vision, modern Transformers/LLMs, fine-tuning, RAG pipelines, and enterprise MLOps production deployment.",
    thumbnail_url: "/images/courses/ml-masterclass.png",
    is_published: true,
    modules: [
      {
        title: "Module 1: Mathematical Foundations & Classical Machine Learning",
        slug: "ml-math-classical-models",
        description: "Linear algebra, gradient descent, feature engineering, Scikit-Learn, Random Forests, XGBoost, and model evaluation.",
        order_index: 1,
        lessons: [
          {
            title: "Gradient Descent, Regularization & Scikit-Learn Pipelines",
            slug: "gradient-descent-scikit-learn-pipelines",
            order_index: 1,
            video_url: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
            content: `# Machine Learning Foundations: Optimization & Regularization

At its core, all supervised machine learning optimizes an empirical risk loss function $L(\\theta)$ using gradient descent:
$$\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta L(\\theta_t)$$

## 1. Bias-Variance Tradeoff & Regularization

* **High Bias (Underfitting):** Model is too simple to capture patterns.
* **High Variance (Overfitting):** Model memorizes training noise.
* **L2 Regularization (Ridge):** Adds $\\lambda \\sum \\theta_j^2$ penalty. Shrinks weights smoothly toward zero.
* **L1 Regularization (Lasso):** Adds $\\lambda \\sum |\\theta_j|$ penalty. Drives coefficients strictly to zero for automatic feature selection.

## 2. Production Scikit-Learn Pipelines

Never fit transformers (like scalers or encoders) on the test set! Use Scikit-Learn \`Pipeline\` to guarantee zero data leakage:

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import cross_val_score

numeric_features = ["age", "income", "credit_score"]
categorical_features = ["occupation", "region"]

preprocessor = ColumnTransformer([
    ("num", StandardScaler(), numeric_features),
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
])

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", HistGradientBoostingClassifier(random_state=42))
])

scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring="roc_auc")
print(f"Mean 5-Fold ROC-AUC: {scores.mean():.4f}")
\`\`\``,
            quiz: {
              question: "Why should data preprocessing (such as StandardScaler) be bundled inside a Scikit-Learn Pipeline during cross-validation?",
              options: [
                "To prevent data leakage by fitting transformation parameters exclusively on training folds and applying them to validation folds",
                "Because Python raises a syntax error otherwise",
                "To automatically convert tabular data into PyTorch tensors",
                "To enforce GPU acceleration on CPU machines"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Ensemble Mastery: Random Forests, XGBoost & LightGBM",
            slug: "ensemble-mastery-xgboost-lightgbm",
            order_index: 2,
            video_url: "https://www.youtube.com/watch?v=OtD8wVx7PCk",
            content: `# Tree-Based Ensembles: Bagging vs. Boosting

Tree-based ensembles remain the undisputed state-of-the-art for tabular data, outperforming deep neural networks across industry benchmarks.

## 1. Bagging vs. Gradient Boosting

* **Random Forests (Bagging):**
  * Builds deep, uncorrelated trees in parallel on bootstrap samples of the data.
  * Employs random feature subspace selection at each split.
  * Reduces variance without increasing bias. Virtually immune to overfitting.

* **XGBoost / LightGBM (Gradient Boosting):**
  * Builds shallow trees sequentially.
  * Each successive tree is trained directly on the pseudo-residuals (negative gradient of the loss function) of previous iterations:
    $$F_m(x) = F_{m-1}(x) + \\gamma_m h_m(x)$$
  * LightGBM uses leaf-wise (best-first) tree growth with histogram-based binning, running $10\\times$ faster than traditional GBMs.

\`\`\`python
import lightgbm as lgb
from sklearn.metrics import classification_report

clf = lgb.LGBMClassifier(
    n_estimators=500,
    learning_rate=0.03,
    num_leaves=31,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

clf.fit(X_train, y_train, eval_set=[(X_val, y_val)], callbacks=[lgb.early_stopping(50)])
preds = clf.predict(X_test)
print(classification_report(y_test, preds))
\`\`\``,
            quiz: {
              question: "How does Gradient Boosting (XGBoost/LightGBM) differ fundamentally from Random Forests in its training mechanism?",
              options: [
                "Gradient Boosting trains trees sequentially to minimize the residuals of previous trees, whereas Random Forests train trees independently in parallel",
                "Gradient Boosting only works on text data, while Random Forests only work on images",
                "Gradient Boosting does not use decision trees",
                "Random Forests require continuous target variables and cannot perform classification"
              ],
              correct_answer: 0
            }
          }
        ]
      },
      {
        title: "Module 2: Deep Learning with PyTorch & Computer Vision",
        slug: "deep-learning-pytorch-computer-vision",
        description: "Neural architectures, PyTorch autograd, custom training loops, convolutional networks (CNNs), transfer learning, and YOLOv8.",
        order_index: 2,
        lessons: [
          {
            title: "PyTorch Architecture: Tensors, Autograd & Custom Training Loops",
            slug: "pytorch-tensors-autograd-training-loops",
            order_index: 1,
            video_url: "https://www.youtube.com/watch?v=V_xro1bcAuA",
            content: `# Deep Learning Foundations: PyTorch from Scratch

PyTorch provides GPU-accelerated tensor computation with dynamic computation graphs (define-by-run autograd).

## 1. PyTorch Autograd & Neural Module

\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim

# 1. Define Model Architecture
class DeepClassifier(nn.Module):
    def __init__(self, in_features, hidden_dim, num_classes):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim, num_classes)
        )

    def forward(self, x):
        return self.net(x)

# 2. Training Loop with Device Agnostic Execution
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = DeepClassifier(in_features=64, hidden_dim=128, num_classes=3).to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)

for epoch in range(10):
    model.train()
    for batch_x, batch_y in dataloader:
        batch_x, batch_y = batch_x.to(device), batch_y.to(device)
        
        optimizer.zero_grad()
        outputs = model(batch_x)
        loss = criterion(outputs, batch_y)
        loss.backward()
        optimizer.step()
\`\`\``,
            quiz: {
              question: "Why must 'optimizer.zero_grad()' be called before 'loss.backward()' in a PyTorch training step?",
              options: [
                "PyTorch accumulates gradients by default; calling zero_grad() prevents gradients from adding across multiple batches",
                "It resets model weights to zero for initialization",
                "It deletes GPU memory buffers to avoid out-of-memory errors",
                "It normalizes inputs to have zero mean and unit variance"
              ],
              correct_answer: 0
            }
          }
        ]
      },
      {
        title: "Module 3: Transformers, LLMs & Production MLOps",
        slug: "transformers-llms-mlops-production",
        description: "Self-attention mechanism, modern Transformer architecture, HuggingFace fine-tuning (LoRA), RAG pipelines, and FastAPI deployment.",
        order_index: 3,
        lessons: [
          {
            title: "Transformers & Attention Mechanism (Self-Attention & Multi-Head)",
            slug: "transformers-attention-mechanism",
            order_index: 1,
            video_url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
            content: `# The Transformer Architecture & Self-Attention

Introduced in *Attention Is All You Need* (Vaswani et al., 2017), the Transformer replaced recurrent architectures by computing interactions between all tokens in parallel using Scaled Dot-Product Attention:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

## 1. Query, Key, Value Intuition
* **Query ($Q$):** What a token is searching for.
* **Key ($K$):** What a token represents / advertises.
* **Value ($V$):** The actual semantic content passed forward.
* **$\\sqrt{d_k}$ Scaling:** Prevents dot products from growing excessively large for high dimensions, which would cause softmax gradients to vanish.

## 2. Multi-Head Attention
Instead of performing a single attention function, Multi-Head Attention projects $Q, K, V$ into $h$ different representation subspaces simultaneously, allowing the model to attend to syntactic, semantic, and positional relationships concurrently.`,
            quiz: {
              question: "What is the purpose of dividing by sqrt(d_k) in the scaled dot-product attention formula?",
              options: [
                "To prevent dot products from becoming large in high dimensions, which would push softmax into regions with tiny gradients",
                "To force the output values to be negative",
                "To convert token coordinates into geographic UTM coordinates",
                "To eliminate stop words from the input text"
              ],
              correct_answer: 0
            }
          },
          {
            title: "Production MLOps: FastAPI Model Serving & Docker Containerization",
            slug: "mlops-fastapi-docker-serving",
            order_index: 2,
            video_url: "https://www.youtube.com/watch?v=h5wLuVDr0oc",
            content: `# MLOps: Deploying Machine Learning to Production

A model is useless in a Jupyter Notebook. MLOps is the engineering discipline of packaging, serving, versioning, and monitoring models in production.

## 1. High-Performance Model Serving with FastAPI & Pydantic

\`\`\`python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import numpy as np

app = FastAPI(title="Production Inference API", version="1.0.0")

# Load compiled model artifact at startup
model = joblib.load("models/best_production_model.joblib")

class PredictionRequest(BaseModel):
    features: list[float] = Field(..., example=[2.5, 120.0, 3.4, 0.8])

class PredictionResponse(BaseModel):
    prediction: int
    probability: float

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        input_array = np.array(request.features).reshape(1, -1)
        prob = float(model.predict_proba(input_array)[0][1])
        pred = int(prob >= 0.5)
        return {"prediction": pred, "probability": prob}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
\`\`\`

## 2. Docker Containerization
\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
\`\`\``,
            quiz: {
              question: "Why should model artifacts be loaded into memory at server startup rather than inside the POST /predict endpoint handler?",
              options: [
                "To avoid reloading heavy weights from disk on every incoming HTTP request, ensuring sub-10ms response latency",
                "Because Python files cannot be read inside request functions",
                "To automatically encrypt the model weights",
                "To prevent Docker containers from exceeding 100MB"
              ],
              correct_answer: 0
            }
          }
        ]
      }
    ]
  }
];

async function seedDatabase() {
  console.log("Starting Masterclass Seeding for R, GIS, and ML...");

  // 1. Clean up old or conflicting courses to ensure ONLY R, GIS, ML exist
  const { data: existingCourses } = await supabase.from('courses').select('id, slug, title');
  console.log("Current courses in DB:", existingCourses?.map(c => c.slug));

  // Determine which courses to delete (anything not in the 3 masterclasses)
  const allowedSlugs = COURSES.map(c => c.slug);
  const toDelete = existingCourses?.filter(c => !allowedSlugs.includes(c.slug)) || [];
  
  for (const old of toDelete) {
    console.log(`Removing old/deprecated course: ${old.title} (${old.slug})`);
    const { error: delErr } = await supabase.from('courses').delete().eq('id', old.id);
    if (delErr) {
      console.warn(`Could not delete old course ${old.slug}:`, delErr.message);
    }
  }

  // 2. Insert or update the 3 Masterclasses
  for (const courseData of COURSES) {
    console.log(`\n=== Seeding Course: ${courseData.title} ===`);
    
    // Check if course already exists
    const { data: existing } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', courseData.slug)
      .single();

    let courseId = existing?.id;

    if (courseId) {
      console.log(`Updating existing course ${courseData.slug}...`);
      await supabase.from('courses').update({
        title: courseData.title,
        description: courseData.description,
        thumbnail_url: courseData.thumbnail_url,
        is_published: true
      }).eq('id', courseId);
    } else {
      console.log(`Inserting new course ${courseData.slug}...`);
      const { data: inserted, error: insertErr } = await supabase.from('courses').insert({
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        thumbnail_url: courseData.thumbnail_url,
        is_published: true
      }).select('id').single();

      if (insertErr) {
        console.error(`Error inserting course ${courseData.slug}:`, insertErr);
        continue;
      }
      courseId = inserted.id;
    }

    // 3. Insert Modules and Lessons
    for (const mod of courseData.modules) {
      console.log(`  -> Module: ${mod.title}`);
      
      let { data: existingMod } = await supabase
        .from('modules')
        .select('id')
        .eq('course_id', courseId)
        .eq('slug', mod.slug)
        .single();

      let moduleId = existingMod?.id;

      if (moduleId) {
        await supabase.from('modules').update({
          title: mod.title,
          description: mod.description,
          order_index: mod.order_index
        }).eq('id', moduleId);
      } else {
        const { data: newMod, error: modErr } = await supabase.from('modules').insert({
          course_id: courseId,
          title: mod.title,
          slug: mod.slug,
          description: mod.description,
          order_index: mod.order_index
        }).select('id').single();

        if (modErr) {
          console.error(`Error inserting module ${mod.slug}:`, modErr);
          continue;
        }
        moduleId = newMod.id;
      }

      // 4. Insert Lessons
      for (const lesson of mod.lessons) {
        let { data: existingLesson } = await supabase
          .from('lessons')
          .select('id')
          .eq('module_id', moduleId)
          .eq('slug', lesson.slug)
          .single();

        let lessonId = existingLesson?.id;

        if (lessonId) {
          await supabase.from('lessons').update({
            title: lesson.title,
            content: lesson.content,
            video_url: lesson.video_url,
            order_index: lesson.order_index
          }).eq('id', lessonId);
        } else {
          const { data: newLesson, error: lessonErr } = await supabase.from('lessons').insert({
            module_id: moduleId,
            title: lesson.title,
            slug: lesson.slug,
            content: lesson.content,
            video_url: lesson.video_url,
            order_index: lesson.order_index
          }).select('id').single();

          if (lessonErr) {
            console.error(`Error inserting lesson ${lesson.slug}:`, lessonErr);
            continue;
          }
          lessonId = newLesson.id;
        }

        // 5. Insert Quiz if present
        if (lesson.quiz && lessonId) {
          // Delete existing question for this lesson to prevent duplicates
          await supabase.from('quiz_questions').delete().eq('lesson_id', lessonId);
          
          await supabase.from('quiz_questions').insert({
            lesson_id: lessonId,
            question: lesson.quiz.question,
            options: lesson.quiz.options,
            correct_answer: lesson.quiz.correct_answer,
            points: 10
          });
        }
      }
    }
  }

  console.log("\nMasterclass Seeding Completed Successfully!");
}

seedDatabase().catch(err => {
  console.error("Fatal Seeding Error:", err);
  process.exit(1);
});
