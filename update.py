import json
import os
import re
import shutil
import datetime

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
    
    # Agregar fecha de última modificación
    config['last_modified'] = datetime.datetime.now().strftime('%Y-%m-%d')
    
    # Copiar todo el contenido de src a docs
    if os.path.exists('src'):
        shutil.copytree('src', 'docs', dirs_exist_ok=True)
        print("Copiado src/ a docs/")
    else:
        print("Directorio src/ no encontrado")
    
    # Lista de archivos a actualizar en docs
    files_to_update = ['docs/index.html']
    
    update_files(config, files_to_update)