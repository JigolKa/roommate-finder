import lib

response = lib.googleimagesdownload()

arguments = {"keywords": "strasbourgt", "limit": 2, "print_urls": True,
             "no_download": True}
paths = response.download(arguments)
print(paths[0])
