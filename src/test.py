import ee 
import json 
import sys
from scipy.signal import savgol_filter


## Google Earth Engine Authentication
#service_account = 'secondno2@cryptic-lattice-296913.iam.gserviceaccount.com'
#credentials = ee.ServiceAccountCredentials(service_account,'src/ee_api_key.json')
#ee.Initialize(credentials)


params = json.loads(sys.argv[1])
msg = params['msg']

res = {'msg': "recibed message: " + msg}
print(json.dumps(res))
