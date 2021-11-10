import ee 
import json 
import sys

params = json.loads(sys.argv[1])
msg = params['msg']

res = {'msg': "recibed message: " + msg}
print(json.dumps(res))