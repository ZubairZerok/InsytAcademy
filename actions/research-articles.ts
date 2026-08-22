// Research article static data — shared between hub page and detail page
// No "use server" here — this is just data

export const researchArticles = [
    {
        id: "r1",
        title: "Differential Gene Expression Analysis of Oryza sativa Under Salinity Stress Using DESeq2",
        abstract: "RNA-seq data from 36 accessions were processed through a Bioconductor pipeline (STAR → featureCounts → DESeq2). We identified 847 significantly differentially expressed genes (padj < 0.01, |log2FC| > 2) involved in osmotic regulation pathways. Heatmaps generated via pheatmap and volcano plots via EnhancedVolcano reveal strong upregulation of OsHKT1;5 and OsSOS1 transporters.",
        rPackages: ["DESeq2", "pheatmap", "EnhancedVolcano", "Bioconductor"],
        discipline: "Genomics & Bioinformatics",
        publishedAt: "2026-05-18",
        author: "PlAiNSYT",
        authorRole: "Admin",
    },
    {
        id: "r2",
        title: "Spatial Autocorrelation of Soil Micronutrient Distributions Across Coastal Bangladesh Using gstat and sf",
        abstract: "Ordinary kriging interpolation of zinc, boron, and manganese concentrations from 1,200 GPS-tagged soil samples was implemented using the gstat package. Spatial polygons processed through the sf and terra packages. Moran's I test (spdep) confirmed strong spatial clustering (I = 0.72, p < 0.001). Final chloropleth maps rendered via tmap demonstrate critical micronutrient depletion corridors.",
        rPackages: ["gstat", "sf", "terra", "spdep", "tmap"],
        discipline: "Soil Science & GIS",
        publishedAt: "2026-05-10",
        author: "PlAiNSYT",
        authorRole: "Admin",
    },
    {
        id: "r3",
        title: "Random Forest Classification of Mangrove Species Using Spectral Indices from Sentinel-2 Imagery",
        abstract: "We used the randomForest and caret packages to classify 12 mangrove species from processed Sentinel-2 bands (NDVI, NDWI, SAVI). The model achieved OOB error rate of 4.2% across 5-fold spatial cross-validation. Variable importance plots (varImpPlot) identified NDVI_B8A and SWIR_ratio as dominant predictors. Shiny dashboard deployed for interactive map exploration.",
        rPackages: ["randomForest", "caret", "raster", "shiny", "leaflet"],
        discipline: "Forestry & Remote Sensing",
        publishedAt: "2026-04-28",
        author: "PlAiNSYT",
        authorRole: "Admin",
    },
    {
        id: "r4",
        title: "Bayesian Hierarchical Modeling of Rice Yield Response to NPK Dosages Using brms",
        abstract: "A multilevel Bayesian regression model was fitted using brms (backend: Stan) to estimate yield response curves for 8 high-yield rice varieties under varying NPK application rates across 3 agro-ecological zones. Posterior predictive checks and LOO-CV (loo package) confirmed strong model fit. Marginal effects visualized using tidybayes and ggdist show nonlinear phosphorus saturation thresholds.",
        rPackages: ["brms", "rstanarm", "tidybayes", "ggdist", "loo"],
        discipline: "Crop Science & Statistics",
        publishedAt: "2026-04-15",
        author: "PlAiNSYT",
        authorRole: "Admin",
    },
    {
        id: "r5",
        title: "Phylogenetic Analysis of CRISPR-Cas9 Target Sites Across Brassica Genomes Using ggtree",
        abstract: "Multiple sequence alignment of CRISPR spacer regions from 42 Brassica accessions was performed using msa (ClustalOmega backend). Phylogenetic trees constructed via ape (neighbor-joining) and phangorn (maximum likelihood, GTR+G+I model). Interactive tree visualization rendered through ggtree with clade annotations mapping known disease-resistance loci.",
        rPackages: ["ggtree", "ape", "phangorn", "msa", "Biostrings"],
        discipline: "Molecular Biology",
        publishedAt: "2026-03-30",
        author: "PlAiNSYT",
        authorRole: "Admin",
    },
    {
        id: "r6",
        title: "Time Series Forecasting of Shrimp Pond Water Quality Parameters Using forecast and tseries",
        abstract: "Daily dissolved oxygen, pH, and ammonia readings from 18 IoT-equipped aquaculture ponds were modeled with ARIMA (auto.arima from forecast), ETS, and Prophet. Ljung-Box tests (tseries) validated residual independence. The ARIMA(2,1,2) model achieved MAPE of 3.8% on 30-day holdout validation for DO forecasting. ggplot2 visualizations with geom_ribbon display prediction intervals.",
        rPackages: ["forecast", "tseries", "prophet", "ggplot2", "xts"],
        discipline: "Aquaculture & IoT Analytics",
        publishedAt: "2026-03-12",
        author: "PlAiNSYT",
        authorRole: "Admin",
    },
];

export type ResearchArticle = typeof researchArticles[0];

export function getArticleById(id: string): ResearchArticle | undefined {
    return researchArticles.find(a => a.id === id);
}
