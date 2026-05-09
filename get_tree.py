import os

def print_tree(startpath, exclude_dirs):
    lines = []
    for root, dirs, files in os.walk(startpath):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        lines.append(f'{indent}{os.path.basename(root)}/')
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            lines.append(f'{subindent}{f}')
    return "\n".join(lines)

if __name__ == "__main__":
    out = print_tree('.', ['.git', 'node_modules', '.agents', '__pycache__', 'graphify-out', '.venv', 'env'])
    with open('tree_output_utf8.txt', 'w', encoding='utf-8') as f:
        f.write(out)
