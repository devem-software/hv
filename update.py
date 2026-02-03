import json
import os
import re

def update_files(config, file_paths):
    for file_path in file_paths:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Reemplazar variables en formato {% variable %}
            for key, value in config.items():
                pattern = r'\{\%\s*' + re.escape(key) + r'\s*\%\}'
                content = re.sub(pattern, str(value), content)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Actualizado: {file_path}")

if __name__ == "__main__":
    with open('config.json', 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    # Lista de archivos a actualizar (puedes expandir)
    files_to_update = ['index.html']  # Agrega más si es necesario
    
    update_files(config, files_to_update)