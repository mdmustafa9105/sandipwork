import base64

with open("public/icon-512.png", "rb") as f:
    b64 = base64.b64encode(f.read()).decode("utf-8")

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,{b64}" width="512" height="512" />
</svg>
'''

with open("src/app/icon.svg", "w") as f:
    f.write(svg_content)

with open("public/favicon.svg", "w") as f:
    f.write(svg_content)

print("SVG icons generated successfully!")

