import pymupdf4llm
import os

pdf_path = "processing/docs"
md_path = "processing/md"

def pdf_to_md(input_file):
    input_path = os.path.join(pdf_path, input_file)
    output_file_name = input_file[:-4]+'.md'
    output_path = os.path.join(md_path, output_file_name)
    
    print(f"DEBUG: Looking for file at: {input_path}")
    print(f"DEBUG: File exists: {os.path.exists(input_path)}")
    print(f"DEBUG: Current working directory: {os.getcwd()}")
    
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"File not found: {input_path}")
    
    markdown_text = pymupdf4llm.to_markdown(input_path)
    with open(output_path, "w", errors='ignore') as f:
        f.write(markdown_text)
