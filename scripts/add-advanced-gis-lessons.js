require('./load-env');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://cisulrzguxljaxgogbzi.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

const NEW_LESSONS = [
  {
    moduleId: 'b97884a1-e171-4207-9a50-e70a472fd018', // Module 2: Desktop GIS
    title: 'Digital Elevation Models: Watershed Delineation & Multi-Criteria Evaluation (MCE)',
    slug: 'dem-watershed-mce',
    order_index: 5,
    video_url: 'https://www.youtube.com/watch?v=0kGgWb8Vj5c',
    content: `# Digital Elevation Models: Hydrology & Multi-Criteria Evaluation (MCE)

Terrain analysis and hydrological modeling form the backbone of flood risk assessment, irrigation planning, and environmental impact assessments.

## 1. Hydrological Workflow Pipeline

1. **Sink / Pit Filling:** Real DEMs contain depression artifacts where water becomes falsely trapped. Algorithmic sink filling ensures continuous flow across the landscape.
2. **Flow Direction (D8 Algorithm):** Determines which of the 8 neighboring cells water will flow into based on the steepest descent.
3. **Flow Accumulation:** Counts how many upstream cells drain into each cell. Cells with high flow accumulation represent natural stream channels.
4. **Stream Order & Watershed Delineation:** Identifying pour points to define drainage basin boundaries (catchments).

## 2. Multi-Criteria Evaluation (MCE) for Site Suitability

Site suitability combines multiple conflicting environmental, economic, and logistical factors to identify optimal locations (e.g., solar farm siting, hospital location):
* **Standardization:** Reclassifying layers to a shared scale (e.g., $1$ to $10$).
* **Constraint Masking (Boolean):** Disqualifying forbidden areas (e.g., slope $> 15^\\circ$, distance to wetlands $< 500\\text{m}$).
* **Weighted Linear Combination (WLC):**
  $$\\text{Suitability} = \\sum_{i=1}^n w_i \\times x_i \\times \\prod c_j$$
  where $w_i$ are criterion weights (derived via Analytic Hierarchy Process / AHP) and $c_j$ are binary constraints.`,
    quiz: {
      question: "What is the primary objective of running a 'sink filling' algorithm on a Digital Elevation Model before hydrological flow analysis?",
      options: [
        "To remove artificial depression artifacts and ensure continuous downhill flow routing across the terrain surface",
        "To smooth contour lines for aesthetic printing",
        "To convert the raster into a vector shapefile",
        "To reproject the DEM into Web Mercator"
      ],
      correct_answer: 0
    }
  },
  {
    moduleId: 'd38657b8-51fa-4c8a-8bf4-ed738c9d6819', // Module 5: Python Spatial Stack
    title: 'Automating Desktop GIS: PyQGIS & ArcPy Console Scripting',
    slug: 'pyqgis-arcpy-scripting',
    order_index: 6,
    video_url: 'https://www.youtube.com/watch?v=8qWp8u4L0uE',
    content: `# Scripting Desktop Consoles: PyQGIS & ArcPy

Writing scripts directly inside desktop GIS consoles allows batch geoprocessing of thousands of files and automated publication map series generation.

## 1. PyQGIS Automation

Run directly in the QGIS Python Console or as a standalone script:
\`\`\`python
from qgis.core import QgsProject, QgsVectorLayer, processing

# Access active project
project = QgsProject.instance()

# Load layer into canvas
layer = QgsVectorLayer("parcels.gpkg", "Agricultural Parcels", "ogr")
project.addMapLayer(layer)

# Run QGIS Processing algorithm programmatically
params = {
    'INPUT': layer,
    'DISTANCE': 500, # 500 meters
    'SEGMENTS': 10,
    'OUTPUT': 'memory:buffered_parcels'
}
result = processing.run("native:buffer", params)
project.addMapLayer(result['OUTPUT'])
\`\`\`

## 2. ArcPy Scripting (Esri Environment)

\`\`\`python
import arcpy

# Set workspace environment
arcpy.env.workspace = "C:/gis_data/regional_geodatabase.gdb"
arcpy.env.overwriteOutput = True

# Batch buffer all feature classes
feature_classes = arcpy.ListFeatureClasses()
for fc in feature_classes:
    out_fc = f"{fc}_buffer100m"
    arcpy.analysis.Buffer(fc, out_fc, "100 Meters")
    print(f"Successfully processed buffer for: {fc}")
\`\`\``,
    quiz: {
      question: "Which Python module provides programmatic access to run any QGIS algorithm directly inside the Python console?",
      options: [
        "processing (qgis.core)",
        "arcpy.qgis",
        "scipy.spatial",
        "pandas.geoprocess"
      ],
      correct_answer: 0
    }
  },
  {
    moduleId: 'd38657b8-51fa-4c8a-8bf4-ed738c9d6819', // Module 5: Python Spatial Stack
    title: 'Interactive Web Cartography with Folium & Leaflet',
    slug: 'folium-leaflet-web-mapping',
    order_index: 7,
    video_url: 'https://www.youtube.com/watch?v=2Tz8j7Jb5mY',
    content: `# Generating Interactive HTML Web Maps with Folium

Folium bridges Python data science (Pandas, GeoPandas) with Leaflet.js, generating standalone, interactive HTML web maps with interactive tooltips, popups, and layer toggles.

## 1. Building a Clustered Interactive Map

\`\`\`python
import folium
from folium.plugins import MarkerCluster
import geopandas as gpd

# Load GeoDataFrame of health centers or crop monitoring points
gdf = gpd.read_file("soil_monitoring_sites.geojson")

# Create Folium Map centered on study area
m = folium.Map(location=[23.8103, 90.4125], zoom_start=9, tiles="CartoDB positron")

# Add Marker Cluster for fast rendering of thousands of points
marker_cluster = MarkerCluster().add_to(m)

for _, row in gdf.iterrows():
    popup_html = f"""
    <div style='font-family: sans-serif;'>
      <h4>Site: {row['site_id']}</h4>
      <p><b>Soil pH:</b> {row['soil_ph']}</p>
      <p><b>Nitrogen:</b> {row['nitrogen_ppm']} ppm</p>
    </div>
    """
    folium.CircleMarker(
        location=[row.geometry.y, row.geometry.x],
        radius=6,
        color="green" if row['soil_ph'] > 6.5 else "red",
        fill=True,
        fill_opacity=0.7,
        popup=folium.Popup(popup_html, max_width=300)
    ).add_to(marker_cluster)

# Save as standalone shareable HTML file
m.save("interactive_soil_map.html")
\`\`\``,
    quiz: {
      question: "What JavaScript library does the Python 'folium' package generate underneath to render interactive web maps in browser HTML?",
      options: [
        "Leaflet.js",
        "Three.js",
        "React Native",
        "D3 Canvas"
      ],
      correct_answer: 0
    }
  },
  {
    moduleId: 'cf76ee01-648f-404f-be5d-1d42deb3854b', // Module 6: R Spatial Stack
    title: 'Thematic Cartography in R with tmap & ggplot2',
    slug: 'r-tmap-ggplot2-cartography',
    order_index: 4,
    video_url: 'https://www.youtube.com/watch?v=h29gexJ3BsU',
    content: `# Publication-Quality Thematic Cartography in R

R offers world-class thematic mapping packages for choropleths, graduated symbols, and faceted spatial visuals.

## 1. Thematic Mapping with \`tmap\`

\`\`\`r
library(tmap)
library(sf)

# Set tmap mode: "plot" for static publication or "view" for interactive Leaflet
tmap_mode("plot")

district_map <- tm_shape(district_sf) +
  tm_polygons(
    col = "poverty_rate",
    palette = "Viridis",
    style = "quantile",
    n = 5,
    title = "Poverty Rate (%)",
    border.col = "white",
    border.alpha = 0.5
  ) +
  tm_compass(type = "8star", position = c("right", "top")) +
  tm_scale_bar(position = c("left", "bottom")) +
  tm_layout(
    main.title = "Socio-Economic Vulnerability Index",
    frame = FALSE,
    legend.outside = TRUE
  )

# Export publication image at 300 DPI
tmap_save(district_map, "poverty_choropleth.png", dpi = 300)
\`\`\`

## 2. Cartography with \`ggplot2\` + \`geom_sf()\`

\`\`\`r
library(ggplot2)

ggplot(data = district_sf) +
  geom_sf(aes(fill = poverty_rate), color = "white", size = 0.2) +
  scale_fill_viridis_c(option = "magma", name = "Poverty %") +
  theme_void() +
  labs(
    title = "Regional Inequality Analysis",
    caption = "Source: National Statistical Bureau"
  )
\`\`\``,
    quiz: {
      question: "Which function in ggplot2 provides native, automatic plotting of 'sf' spatial vector layers with correct coordinate projections?",
      options: [
        "geom_sf()",
        "geom_polygon()",
        "geom_spatial()",
        "geom_map_layer()"
      ],
      correct_answer: 0
    }
  }
];

async function addLessons() {
  console.log("Adding 4 advanced GIS lessons directly to Supabase...");
  for (const item of NEW_LESSONS) {
    const { data: existing } = await supabase
      .from('lessons')
      .select('id')
      .eq('module_id', item.moduleId)
      .eq('slug', item.slug)
      .maybeSingle();

    let lessonId = existing?.id;
    if (lessonId) {
      await supabase.from('lessons').update({
        title: item.title,
        content: item.content,
        video_url: item.video_url,
        order_index: item.order_index
      }).eq('id', lessonId);
      console.log(`Updated lesson: ${item.title}`);
    } else {
      const { data: inserted, error: insErr } = await supabase.from('lessons').insert({
        module_id: item.moduleId,
        title: item.title,
        slug: item.slug,
        content: item.content,
        video_url: item.video_url,
        order_index: item.order_index
      }).select('id').single();

      if (insErr) {
        console.error(`Error inserting lesson ${item.slug}:`, insErr);
        continue;
      }
      lessonId = inserted.id;
      console.log(`Inserted lesson: ${item.title}`);
    }

    // Insert Quiz
    if (item.quiz && lessonId) {
      await supabase.from('quiz_questions').delete().eq('lesson_id', lessonId);
      await supabase.from('quiz_questions').insert({
        lesson_id: lessonId,
        question: item.quiz.question,
        options: item.quiz.options,
        correct_answer: item.quiz.correct_answer,
        points: 10
      });
      console.log(`  + Quiz added for: ${item.title}`);
    }
  }
  console.log("All advanced GIS lessons successfully synced!");
}

addLessons().catch(console.error);
