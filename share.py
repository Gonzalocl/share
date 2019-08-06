import os
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

port = 8080


class RequestHandler(BaseHTTPRequestHandler):

  def do_GET(self):

    if os.access(self.path[1:], os.R_OK):
      with open(self.path[1:], "rb") as f:
        self.send_response(200)
        self.end_headers()
        self.wfile.write(f.read())

    else:
      self.send_error(404, "File Not Found")

  def do_POST(self):

    if self.path == "/share_list_files":
      print(self.rfile.read(int(self.headers['Content-Length'])))
      response = {
        "name": "Gonzalo",
        "dir": "24"
      }
      self.send_response(200)
      self.end_headers()
      self.wfile.write(json.dumps(response).encode())

    elif self.path == "/share_get_thumbnail":
      print(self.rfile.read(int(self.headers['Content-Length'])))
      response = {
        "name": "Gonzalo",
        "dir": "24",
        "arr": [
          "one",
          "two",
          "tree"
        ]
      }
      self.send_response(200)
      self.end_headers()
      self.wfile.write(json.dumps(response).encode())

    else:
      self.send_error(404, "File Not Found")


server = HTTPServer(('localhost', port), RequestHandler)
server.serve_forever()


