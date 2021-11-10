import ee 
import json 
import sys

# Google Earth Engine Authentication
service_account = 'secondno2@cryptic-lattice-296913.iam.gserviceaccount.com'
credentials = ee.ServiceAccountCredentials(service_account,'src/ee_api_key.json')
ee.Initialize(credentials)

def getImageTile(StartDate,EndDate):
    ## StartDate es la fecha de inicio
    #  EndDate es la fecha final 
    # Gemoetry es el objeto de geometría que se desea
    
    band_viz = { # Parémetros de visualización
    'min': 0,
    'max': 0.0002 ,
    'palette': ['white','red'], #'blue', 'purple', 'cyan','green', 'yellow', 'red'],
    'opacity': 0.6
    }
    # Colleción de imagenés del satélite
    NO2 = ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_NO2").select('tropospheric_NO2_column_number_density')
    NO2 = NO2.filterDate(StartDate, EndDate)
    NO2_mapViz2 = NO2.mosaic()
    # Se hace un imagen apartir de la colleción
    map_id_dict = ee.Image(NO2_mapViz2).getMapId(band_viz)
    URL = map_id_dict['tile_fetcher'].url_format
    
    return URL # Tile para la visualización



params = json.loads(sys.argv[1])
StartDate = params['Start']
EndDate = params['End']
Link = getImageTile(StartDate, EndDate)

res = {'Link': Link}
print(json.dumps(res))