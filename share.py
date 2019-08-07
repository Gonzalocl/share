import os
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import urllib.parse

port = 8080

img_file_ext = ["jpg", "jpeg", "png"]

def find_thumbnail(path):
  if not os.access(path, os.R_OK):
    # TODO return no access thumbnail
    return ""
  for f in os.listdir(path):
    if f.split(".")[-1].lower() in img_file_ext:
      return path + "/" + f
  # TODO return folder thumbnail
  return ""

class RequestHandler(BaseHTTPRequestHandler):

  def do_GET(self):

    path = urllib.parse.unquote(self.path)
    if os.access(path[1:], os.R_OK):
      with open(path[1:], "rb") as f:
        self.send_response(200)
        self.end_headers()
        self.wfile.write(f.read())

    else:
      self.send_error(404, "File Not Found")


  def do_POST(self):

    if self.path == "/share_list_files":
      request = json.loads(self.rfile.read(int(self.headers['Content-Length'])))

      if request["dir"] == "/":
        path = "."
      else:
        path = request["dir"][1:]

      if os.access(path, os.R_OK):
        if request["thumbnail"]:
          response = {
            "list": []
          }
          for d in os.listdir(path):
            full_path = path + "/" + d
            if os.path.isfile(full_path):
              # TODO thumbnail
              response["list"].append({"path": d, "thumbnail": ""})
            else:
              response["list"].append({"path": d, "thumbnail": find_thumbnail(full_path)})

        else:
          response = {
            "list": os.listdir(path)
          }
      else:
        # TODO return no access thumbnail
        response = {
          "list": []
        }

      self.send_response(200)
      self.end_headers()
      self.wfile.write(json.dumps(response).encode())

    else:
      path = urllib.parse.unquote(self.path)
      if os.access(path[1:], os.R_OK):
        with open(path[1:], "rb") as f:
          self.send_response(200)
          self.end_headers()
          self.wfile.write(f.read())

      else:
        self.send_error(404, "File Not Found")



server = HTTPServer(('', port), RequestHandler)
server.serve_forever()


