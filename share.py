import os
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import urllib.parse
import tempfile
import threading
from PIL import Image

port = 8080

img_file_ext = ["jpg", "jpeg", "png"]

thumbnail_size = (512, 512)

class ThumbnailCache:

  def __init__(self):
    self.tmp_dir = tempfile.mkdtemp()
    self.lock = threading.Lock()
    self.cache = dict()
    self.inv_cache = dict()
    self.cache_size = 0
    self.processed = 0

  def get_thumbnail_name(self, path):
    if path in self.cache:
      self.lock.acquire()
      _, thumbnail_path = self.cache[path]
      self.lock.release()
      # print("Cache hit : " + str(self.cache_size) + "; Processed : " + str(self.processed))
    else:
      _, thumbnail_path = tempfile.mkstemp(suffix=".jpg", dir=self.tmp_dir)
      self.lock.acquire()
      self.cache[path] = (False, thumbnail_path)
      self.inv_cache[thumbnail_path] = (False, path)
      self.cache_size += 1
      self.lock.release()
      # print("Cache miss : " + str(self.cache_size) + "; Processed : " + str(self.processed))
    return thumbnail_path

  def get_thumbnail_data(self, thumbnail_path):
    self.lock.acquire()
    processed, path = self.inv_cache[thumbnail_path]
    self.lock.release()
    if not processed:
      self.lock.acquire()
      self.cache[path] = (True, thumbnail_path)
      self.inv_cache[thumbnail_path] = (True, path)
      self.processed += 1
      self.lock.release()
      img = Image.open(path)
      img.thumbnail(thumbnail_size, Image.ANTIALIAS)
      img.save(thumbnail_path, "JPEG")
      # print("Cache : " + str(self.cache_size) + "; Processed miss : " + str(self.processed))
    # else:
    #   print("Cache : " + str(self.cache_size) + "; Processed hit : " + str(self.processed))

    with open(thumbnail_path, "rb") as f:
      return f.read()

  def is_thumbnail(self, thumbnail_path):
    self.lock.acquire()
    ret = thumbnail_path in self.inv_cache
    self.lock.release()
    return ret
    # splitted = thumbnail_path.split("/")
    # if splitted.__len__() < 3:
    #   return False
    # return splitted[1] == 'tmp' and ("/tmp/" + splitted[2]) == self.tmp_dir

thumbnail_cache = ThumbnailCache()

def find_thumbnail(path):
  if not os.access(path, os.R_OK):
    # TODO return no access thumbnail
    return ""
  for f in os.listdir(path):
    if f.split(".")[-1].lower() in img_file_ext:
      return thumbnail_cache.get_thumbnail_name(path + "/" + f)
  # TODO return folder thumbnail
  return ""

class RequestHandler(BaseHTTPRequestHandler):

  def do_GET(self):

    path = urllib.parse.unquote(self.path)
    if thumbnail_cache.is_thumbnail(path):
      self.send_response(200)
      self.end_headers()
      self.wfile.write(thumbnail_cache.get_thumbnail_data(path))
    elif os.access(path[1:], os.R_OK):
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
              if full_path.split(".")[-1].lower() in img_file_ext:
                response["list"].append({"path": d, "thumbnail": thumbnail_cache.get_thumbnail_name(full_path)})
              else:
                # TODO unknown file format thumbnail
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
      if thumbnail_cache.is_thumbnail(path):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(thumbnail_cache.get_thumbnail_data(path))
      elif os.access(path[1:], os.R_OK):
        with open(path[1:], "rb") as f:
          self.send_response(200)
          self.end_headers()
          self.wfile.write(f.read())

      else:
        self.send_error(404, "File Not Found")



server = HTTPServer(('', port), RequestHandler)
server.serve_forever()


